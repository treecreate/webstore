package dk.treecreate.api.payment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import dk.treecreate.api.order.OrderService;
import dk.treecreate.api.utils.QuickpayService;
import dk.treecreate.api.utils.model.quickpay.QuickpayOperationType;
import dk.treecreate.api.utils.model.quickpay.QuickpayStatusCode;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import springfox.documentation.annotations.ApiIgnore;

import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping()
@Api(tags = {"Payment"})
public class PaymentController
{
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    OrderService orderService;
    @Autowired
    QuickpayService quickpayService;

    @ApiIgnore
    @PostMapping("/paymentCallback")
    public void paymentCallback(@RequestHeader("quickpay-checksum-sha256") String checksum,
                                @RequestBody String body)
    {
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
            JsonNode json = objectMapper.readTree(body);
            LOGGER.info("A payment callback request has been received");
            LOGGER.info(json.toString());
            // validate the checksum
            if (!quickpayService.validatePaymentCallbackChecksum(checksum, json.toString()))
            {
                LOGGER.warn("The request body checksum does not match");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The request body checksum does not match");
            }

            LOGGER.info("Processing the operations data");
            JsonNode operations = json.get("operations");
            if (operations.isArray())
            {
                // get the latest operation
                ArrayNode arrayNode = (ArrayNode) operations;
                JsonNode latestOperation = arrayNode.get(arrayNode.size() - 1);
                JsonNode operationType = latestOperation.get("type");
                JsonNode operationStatus = latestOperation.get("qp_status_code");
                if (operationType == null || operationType.isNull())
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "The provided body is missing the necessary field: /operations/[" +
                            (arrayNode.size() - 1) + "]/type");
                }
                if (operationStatus == null || operationStatus.isNull())
                {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "The provided body is missing the necessary field: /operations/[" +
                            (arrayNode.size() - 1) + "]/qp_status_code");
                }

                LOGGER.info("Latest operation type: " + operationType.asText());
                LOGGER.info("Latest operation status: " + operationStatus.asInt());

                if (operationType.asText().equals(QuickpayOperationType.AUTHORIZE.label))
                {
                    LOGGER.info("Received callback is of operation type AUTHORIZE");
                    if (operationStatus.asInt() != QuickpayStatusCode.APPROVED.label)
                    {
                        LOGGER.warn("Operation status is " + operationStatus.asInt() +
                            ", aka not approved. Aborting");
                        return;
                    }

                    LOGGER.info("Operation status is APPROVED, sending out an email");

                    // Send out the email based on the orderId
                    JsonNode orderId = json.at("/variables/orderId");
                    if (orderId == null || orderId.isNull())
                    {
                        // try to send the order based on the paymentID instead
                        JsonNode paymentId = json.get("id");
                        LOGGER.warn(
                            "The provided body does not contain orderId variable, sending email based on the paymentId instead");
                        if (paymentId == null || paymentId.isNull())
                        {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "The provided body is missing the necessary field: id");
                        }
                        LOGGER.info("Sending order confirmation email to order with paymentID: " +
                            paymentId.asText());
                        orderService.sendOrderConfirmationEmail(paymentId.asText());
                    } else
                    {
                        LOGGER.info("Sending order confirmation email to: " + orderId.asText());
                        orderService.sendOrderConfirmationEmail(UUID.fromString(orderId.asText()));
                    }

                } else
                {
                    LOGGER.info("Received callback is of operation type " + operationType.asText() +
                        ", ignoring (nothing coded for handling this operation)");
                    return;
                }
            }
            LOGGER.info("Finished processing the callback");
        } catch (JsonProcessingException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "An error has occurred while processing the callback", e);
        }
    }
}
