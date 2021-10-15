package dk.treecreate.api.utils;

import dk.treecreate.api.config.CustomPropertiesConfig;
import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.order.Order;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.utils.model.quickpay.Currency;
import dk.treecreate.api.utils.model.quickpay.*;
import dk.treecreate.api.utils.model.quickpay.dto.CreatePaymentLinkRequest;
import dk.treecreate.api.utils.model.quickpay.dto.CreatePaymentLinkResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.validation.constraints.NotNull;
import javax.xml.bind.DatatypeConverter;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@Service
public class QuickpayService
{
    private static final Logger LOGGER = LoggerFactory.getLogger(QuickpayService.class);

    @Autowired
    CustomPropertiesConfig customProperties;

    /**
     * send a POST /payments request to Quickpay, creating a new payment
     *
     * @param order order information
     * @return payment ID of the newly created payment
     */
    public String sendCreatePaymentRequest(Order order) throws URISyntaxException
    {
        Payment payment =
            createPaymentRequestBody(order.getOrderId(), order.getUserId(), order.getPlantedTrees(),
                order.getDiscount(), order.getContactInfo(),
                order.getBillingInfo() != null ? order.getBillingInfo() : order.getContactInfo(),
                order.getShippingMethod(), order.getTransactionItems());
        // TODO - fully setup environment in API (currently is just a custom property.)
        // The environment should affect urls included in the emails etc
        payment.order_id =
            createOrderId(order.getContactInfo().getEmail(), Environment.DEVELOPMENT);

        // perform POST https://api.quickpay.net/payments to create a payment object in Quickpay
        String quickpayApiUrl = "https://api.quickpay.net";
        String apiKey = customProperties.getQuickpayApiKey();

        WebClient client = WebClient.create();

        // TODO - add proper error handling of the response
        Payment response = client.post()
            .uri(new URI(quickpayApiUrl + "/payments"))
            .headers(headers -> headers.setBasicAuth("", apiKey))
            .header("Accept-Version", "v10")
            .header("QuickPay-Callback-Url", generateCallbackUrl(customProperties.getEnvironment()))
            .body(BodyInserters.fromValue(payment))
            .retrieve()
            .bodyToMono(Payment.class)
            .block();

        if (response == null)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "An error has occurred while creating a payment. Try again later");
        }

        LOGGER.info(
            "New payment has been created for user " + order.getUserId() +
                " | PaymentID: " + response.id + " | Total: " + order.getTotal());

        return response.id;
    }

    /**
     * perform PUT https://api.quickpay.net/payments/:paymentId/link to get a payment link
     *
     * @param paymentId Quickpay payment ID
     * @return url that the user can navigate to in order to give us money
     */
    public CreatePaymentLinkResponse sendCreatePaymentLinkRequest(String paymentId,
                                                                  BigDecimal total, Locale locale)
        throws URISyntaxException
    {
        String quickpayApiUrl = "https://api.quickpay.net";
        String apiKey = customProperties.getQuickpayApiKey();

        var createPaymentLinkRequest = new CreatePaymentLinkRequest();
        // quickpay requires the value as an integer. The remainder is preserved by multiplying by 100
        createPaymentLinkRequest.amount = total.multiply(new BigDecimal(100)).intValue();
        // TODO - convert locale to use ISO-639-codes (danish is da not dk)
        if (locale.getLanguage().equals("dk"))
        {
            createPaymentLinkRequest.language = "da";
        } else
        {
            createPaymentLinkRequest.language = locale.getLanguage();
        }

        // assign the payment redirect urls
        createPaymentLinkRequest.continue_url =
            generatePaymentRedirectUrl(customProperties.getEnvironment(), locale, true);
        createPaymentLinkRequest.cancel_url =
            generatePaymentRedirectUrl(customProperties.getEnvironment(), locale, false);
        createPaymentLinkRequest.callback_url =
            generateCallbackUrl(customProperties.getEnvironment());

        // TODO - add proper error handling of the response
        WebClient client = WebClient.create();
        CreatePaymentLinkResponse response = client.put()
            .uri(new URI(quickpayApiUrl + "/payments/" + paymentId + "/link"))
            .headers(headers -> headers.setBasicAuth("", apiKey))
            .header("Accept-Version", "v10")
            .header("QuickPay-Callback-Url", generateCallbackUrl(customProperties.getEnvironment()))
            .body(BodyInserters.fromValue(createPaymentLinkRequest))
            .retrieve()
            .bodyToMono(CreatePaymentLinkResponse.class)
            .block();

        if (response == null)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "An error has occurred while creating a payment link. Try again later");
        }

        LOGGER.info("Payment link has been created for payment id " + paymentId + " | " +
            response.getUrl());
        return response;
    }

    /**
     * Creates a body needed for the quickpay POST /payments request
     *
     * @param orderId          treecreate database entity id.
     * @param userId           id of the user who made the order
     * @param discount         discount object. Nullable
     * @param plantedTrees     how many trees are planted as part of the order
     * @param shippingAddress  contact information
     * @param billingAddress   billing information
     * @param shippingMethod   shipping method
     * @param transactionItems a list of transaction items included in the order
     * @return an almost-finished payment object that is used as a body for the create payment request
     */
    public Payment createPaymentRequestBody(UUID orderId, UUID userId, int plantedTrees,
                                            @Nullable Discount discount,
                                            @NotNull ContactInfo shippingAddress,
                                            @NotNull ContactInfo billingAddress,
                                            @NotNull ShippingMethod shippingMethod,
                                            @NotNull List<TransactionItem> transactionItems)
    {
        Payment payment = new Payment();
        payment.currency = Currency.DKK;

        PaymentVariables paymentVariables = new PaymentVariables();
        payment.invoice_address = fillOutPaymentAddress(billingAddress);
        payment.shipping_address = fillOutPaymentAddress(shippingAddress);
        PaymentShipping shipping = new PaymentShipping();
        shipping.method = shippingMethod.label;
        payment.shipping = shipping;

        // Setup data to be saved in the `variables` property
        List<PaymentTransactionItemInfo> items = new ArrayList<>();
        for (TransactionItem item : transactionItems)
        {
            PaymentTransactionItemInfo itemInfo = new PaymentTransactionItemInfo();
            itemInfo.designId = item.getDesign().getDesignId();
            itemInfo.designType = item.getDesign().getDesignType();
            itemInfo.quantity = item.getQuantity();
            itemInfo.dimension = item.getDimension();
            items.add(itemInfo);
        }
        paymentVariables.items = items;
        paymentVariables.orderId = orderId;
        paymentVariables.userId = userId;
        if (discount != null)
        {
            paymentVariables.discountId = discount.getDiscountId();
        }
        paymentVariables.plantedTrees = plantedTrees;
        payment.variables = paymentVariables;
        return payment;
    }

    /**
     * Create a PaymentAddress object with the provided information
     *
     * @param info ContactInfo object containing the data
     * @return filled out PaymentAddress object
     */
    private PaymentAddress fillOutPaymentAddress(ContactInfo info)
    {
        PaymentAddress address = new PaymentAddress();
        address.name = info.getName();
        // ignoring house number, is part of street
        address.street = info.getStreetAddress();
        address.house_extension = info.getStreetAddress2();
        address.city = info.getCity();
        address.zip_code = info.getPostcode();
        address.region = info.getCountry(); // used as country
        address.phone_number = info.getPhoneNumber();
        address.email = info.getEmail();
        return address;
    }

    /**
     * Create a 20-char alphanumeric string that is used as orderId in Quickpay payment model
     *
     * @param email       the email that will be sued as a prefix
     * @param environment the api environment
     * @return random alphanumeric string with prefix of env and email. Example: Dmail-1A2Bcd34EFg56H
     */
    public String createOrderId(String email, Environment environment)
    {
        String prefix;
        if (environment.equals(Environment.PRODUCTION))
        {
            prefix = "P";
        } else
        {
            prefix = "D";
        }
        String emailPrefix = email.split("@")[0];
        emailPrefix = emailPrefix.substring(0, Math.min(emailPrefix.length(), 4));
        StringBuilder emailBuilder = new StringBuilder(emailPrefix);
        while (emailBuilder.length() < 4)
        {
            emailBuilder.append('x');
        }
        emailPrefix = emailBuilder.toString();

        String alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomId = new StringBuilder();
        Random random = new Random();
        // 20 chars max - 1 for env prefix, 4 for email, and a dash. Example: Dmail-1A2Bcd34EFg56H
        int idLength = 14;
        for (int i = 0; i < idLength; i++)
        {
            int index = random.nextInt(alphanumericChars.length());
            randomId.append(alphanumericChars.charAt(index));
        }

        return prefix + emailPrefix + "-" + randomId;
    }

    /**
     * Returns url that can be assigned to the payment link as the url it should redirect to after a failed/successful payment
     *
     * @param environment what environment the app is running in. Affects the domain
     * @param locale      what locale the redirected page should be opened in
     * @param successLink whether the link is for a success of payment cancelled redirect
     * @return the url for redirect
     */
    public String generatePaymentRedirectUrl(Environment environment, Locale locale,
                                             boolean successLink)
    {
        String route = successLink ? "/payment/success" : "/payment/cancelled";
        String lang = locale.equals(Locale.ENGLISH) ? "/en-US" : "/dk";
        switch (environment)
        {
            case PRODUCTION:
                return "https://treecreate.dk" + lang + route;
            case STAGING:
                return "https://testing.treecreate.dk" + lang + route;
            default:
                return "http://localhost:4200" + route;
        }
    }

    /**
     * Returns url that can be assigned to the payment and payment link as the callback url
     *
     * @param environment what environment the app is running in. Affects the domain
     * @return the url for redirect
     */
    public String generateCallbackUrl(Environment environment)
    {
        String route = "/orders/paymentCallback";
        switch (environment)
        {
            case PRODUCTION:
                return "https://api.treecreate.dk" + route;
            case STAGING:
                return "https://api.testing.treecreate.dk" + route;
            default:
                return "http://localhost:5000" + route;
        }
    }

    public boolean validatePaymentCallbackChecksum(String checksum, String requestBody)
    {
        String privateKey = customProperties.getQuickpayPrivateKey();
        try
        {
            String hashedBody = encode(privateKey, requestBody);
            LOGGER.info("Checksum:    " + checksum);
            LOGGER.info("Hashed body: " + hashedBody);
            return checksum.equalsIgnoreCase(hashedBody);
        } catch (Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to calculate the checksum for the request body");
        }
    }

    public static String encode(String key, String data) throws Exception
    {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        return DatatypeConverter.printHexBinary(sha256_HMAC.doFinal(data.getBytes("UTF-8")));
    }
}
