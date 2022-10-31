package dk.treecreate.api.order;

import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.contactinfo.ContactInfoRepository;
import dk.treecreate.api.contactinfo.dto.UpdateContactInfoRequest;
import dk.treecreate.api.designs.ContactInfoService;
import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignType;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.discount.DiscountRepository;
import dk.treecreate.api.exceptionhandling.ResourceNotFoundException;
import dk.treecreate.api.mail.MailService;
import dk.treecreate.api.order.dto.CreateCustomOrderRequest;
import dk.treecreate.api.order.dto.CreateOrderRequest;
import dk.treecreate.api.order.dto.UpdateOrderRequest;
import dk.treecreate.api.transactionitem.TransactionItem;
import dk.treecreate.api.transactionitem.TransactionItemRepository;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.utils.OrderStatus;
import dk.treecreate.api.utils.model.quickpay.ShippingMethod;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class OrderService {
  private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);

  @Autowired DiscountRepository discountRepository;
  @Autowired TransactionItemRepository transactionItemRepository;
  @Autowired ContactInfoService contactInfoService;
  @Autowired UserRepository userRepository;
  @Autowired AuthUserService authUserService;
  @Autowired OrderRepository orderRepository;

  @Autowired MailService mailService;

  public boolean verifyPrice(Order order) {
    int totalItems = 0;
    BigDecimal subTotal = new BigDecimal(0);
    subTotal = subTotal.setScale(2, RoundingMode.HALF_EVEN);
    for (TransactionItem item : order.getTransactionItems()) {
      // TODO - designType should come from transaction item
      int quantity = item.getQuantity();
      BigDecimal pricePerItem = pricePerItem(item.getDesign().getDesignType(), item.getDimension());
      subTotal = subTotal.add(pricePerItem.multiply(BigDecimal.valueOf(quantity)));
      totalItems += quantity;
    }

    LOGGER.info(
        "Verify price | SubTotal: "
            + subTotal
            + " | item count: "
            + totalItems
            + " | planted trees: "
            + order.getPlantedTrees());
    if (!subTotal.equals(order.getSubtotal().setScale(2, RoundingMode.HALF_EVEN))) {
      LOGGER.warn(
          "Verify price | SubTotal ("
              + subTotal
              + ") DOES NOT match order.subtotal: "
              + order.getSubtotal());
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Provided order subtotal ("
              + order.getSubtotal()
              + ") does not match calculated subtotal ("
              + subTotal
              + ")!");
    }

    // Apply the discount and delivery price etc
    BigDecimal total = calculateTotal(subTotal, order.getDiscount(), totalItems > 3);

    // each planted tree adds 10kr to the price, minus the default 1 tree
    int plantedTreesPrice = (order.getPlantedTrees() - 1) * 10;
    total = total.add(new BigDecimal(plantedTreesPrice));

    // add shipping cost
    total =
        calculateDeliveryPrice(order.getShippingMethod(), total)
            .setScale(2, RoundingMode.HALF_EVEN);

    LOGGER.info("Verify price | Calculated Total: " + total);
    if (!total.equals(order.getTotal().setScale(2, RoundingMode.HALF_EVEN))) {
      LOGGER.warn(
          "Verify price | Total ("
              + total
              + ") DOES NOT match order.total ("
              + order.getTotal().setScale(2, RoundingMode.HALF_EVEN)
              + ")!");
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Provided order total ("
              + order.getTotal()
              + ") does not match calculated total ("
              + total
              + ")!");
    }
    return true;
  }

  @Autowired ContactInfoRepository contactInfoRepository;

  /**
   * Updates the order with select data from the provided DTO
   *
   * @param orderId the ID of the order
   * @param updateOrderRequest the new order data
   * @return the updated order
   */
  public Order updateOrder(UUID orderId, UpdateOrderRequest updateOrderRequest) {
    Order order =
        orderRepository
            .findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    if (updateOrderRequest == null) {
      return order;
    }
    // only update the fields that aren't null
    if (updateOrderRequest.getStatus() != null) {
      order.setStatus(updateOrderRequest.getStatus());
    }
    if (updateOrderRequest.getContactInfo() != null) {
      ContactInfo contactInfo = order.getContactInfo();
      UpdateContactInfoRequest updateContactInfoRequest = updateOrderRequest.getContactInfo();
      if (updateContactInfoRequest.getName() != null) {
        contactInfo.setName(updateContactInfoRequest.getName());
      }
      if (updateContactInfoRequest.getPhoneNumber() != null) {
        contactInfo.setPhoneNumber(updateContactInfoRequest.getPhoneNumber());
      }
      if (updateContactInfoRequest.getStreetAddress() != null) {
        contactInfo.setStreetAddress(updateContactInfoRequest.getStreetAddress());
      }
      if (updateContactInfoRequest.getStreetAddress2() != null) {
        contactInfo.setStreetAddress2(updateContactInfoRequest.getStreetAddress2());
      }
      if (updateContactInfoRequest.getCity() != null) {
        contactInfo.setCity(updateContactInfoRequest.getCity());
      }
      if (updateContactInfoRequest.getPostcode() != null) {
        contactInfo.setPostcode(updateContactInfoRequest.getPostcode());
      }
      if (updateContactInfoRequest.getCountry() != null) {
        contactInfo.setCountry(updateContactInfoRequest.getCountry());
      }
      contactInfo = contactInfoRepository.save(contactInfo);
      order.setContactInfo(contactInfo);
    }
    return orderRepository.save(order);
  }

  public BigDecimal calculateTotal(BigDecimal subTotal, Discount discount, boolean hasMoreThan3) {
    BigDecimal total = subTotal;
    total = total.setScale(2, RoundingMode.HALF_EVEN);
    if (discount != null) {
      switch (discount.getType()) {
        case AMOUNT:
          total = subTotal.subtract(BigDecimal.valueOf(discount.getAmount()));
          break;
        case PERCENT:
          total =
              subTotal.subtract(
                  subTotal.multiply(BigDecimal.valueOf((double) discount.getAmount() / 100)));
          break;
        default:
          throw new ResponseStatusException(
              HttpStatus.BAD_REQUEST,
              " Provided discount information is not valid (" + discount.getType() + ")!");
      }
      LOGGER.info(
          "Verify price | Detected discount "
              + discount.getType()
              + " of amount "
              + discount.getAmount());
    } else {
      if (hasMoreThan3) {
        LOGGER.info("Verify price | Detected discount via More Than 4 items");
        total = subTotal.subtract(subTotal.multiply(new BigDecimal("0.25")));
      }
    }
    total = total.setScale(2, RoundingMode.HALF_EVEN);
    return total;
  }

  public BigDecimal pricePerItem(DesignType designType, DesignDimension designDimension) {
    switch (designType) {
      case FAMILY_TREE:
        switch (designDimension) {
          case SMALL:
            return new BigDecimal(499);
          case MEDIUM:
            return new BigDecimal(699);
          case LARGE:
            return new BigDecimal(999);
          default:
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Provided design (" + designDimension + ") dimension data is not valid");
        }
      case QUOTABLE:
        switch (designDimension) {
          case SMALL:
            return new BigDecimal(299);
          case MEDIUM:
            return new BigDecimal(399);
          case LARGE:
            return new BigDecimal(499);
          default:
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Provided design (" + designDimension + ") dimension data is not valid");
        }
      case PET_SIGN:
        switch (designDimension) {
          case SMALL:
            return new BigDecimal(299);
          case MEDIUM:
            return new BigDecimal(399);
          case LARGE:
            return new BigDecimal(499);
          default:
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Provided design (" + designDimension + ") dimension data is not valid");
        }
      default:
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Provided design (" + designType + ") type data is not valid");
    }
  }

  public BigDecimal calculateDeliveryPrice(ShippingMethod shippingMethod, BigDecimal total) {
    switch (shippingMethod) {
      case PICK_UP_POINT:
        if (total.compareTo(new BigDecimal(350)) > 0) {
          // is free
        } else {
          total = total.add(new BigDecimal(45));
        }

        break;
      case HOME_DELIVERY:
        if (total.compareTo(new BigDecimal(350)) > 0) {
          total = total.add(new BigDecimal(25));
        } else {
          total = total.add(new BigDecimal(65));
        }

        break;
      case OWN_DELIVERY:
        total = total.add(new BigDecimal(100));
        break; // 100 kr
    }
    return total;
  }

  public void sendOrderConfirmationEmail(String paymentId) {
    Order order =
        orderRepository
            .findByPaymentId(paymentId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Order with paymentId " + paymentId + " not found"));
    sendOrderConfirmationEmail(order);
  }

  public void sendOrderConfirmationEmail(UUID orderId) {
    Order order =
        orderRepository
            .findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    sendOrderConfirmationEmail(order);
  }

  public void sendOrderConfirmationEmail(Order order) {
    try {
      mailService.sendOrderConfirmationEmail(order.getContactInfo().getEmail(), order);
    } catch (Exception e) {
      LOGGER.error("Failed to process order confirmation email", e);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to send order confirmation email. Try again later");
    }
  }

  public Order setupOrderFromCreateRequest(CreateOrderRequest createOrderRequest) {
    Order order = new Order();
    order.setSubtotal(createOrderRequest.getSubtotal());
    order.setTotal(createOrderRequest.getTotal());
    order.setCurrency(createOrderRequest.getCurrency());
    order.setStatus(OrderStatus.INITIAL);
    order.setPlantedTrees(createOrderRequest.getPlantedTrees());
    order.setShippingMethod(createOrderRequest.getShippingMethod());
    if (createOrderRequest.getDiscountId() != null) {
      Discount discount =
          discountRepository
              .findByDiscountId(createOrderRequest.getDiscountId())
              .orElseThrow(() -> new ResourceNotFoundException("Discount not found"));
      if (discount.getRemainingUses() == 0) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "This discount has no remaining uses");
      }
      if (discount.getExpiresAt() != null && new Date().after(discount.getExpiresAt())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This discount is expired");
      }

      if (!discount.getIsEnabled()
          || discount.getStartsAt() != null && new Date().before(discount.getStartsAt())) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "This discount (" + discount.getDiscountCode() + ") is invalid");
      }

      discount.setRemainingUses(discount.getRemainingUses() - 1);
      discount.setTotalUses(discount.getTotalUses() + 1);
      order.setDiscount(discount);
    } else {
      order.setDiscount(null);
    }

    // set contact and billing info
    ContactInfo contactInfo = new ContactInfo();
    contactInfo =
        contactInfoService.mapCreateContactInfoRequest(
            contactInfo, createOrderRequest.getContactInfo());
    order.setContactInfo(contactInfo);
    if (createOrderRequest.getBillingInfo() != null) {
      ContactInfo billingInfo = new ContactInfo();
      billingInfo =
          contactInfoService.mapCreateContactInfoRequest(
              billingInfo, createOrderRequest.getBillingInfo());
      order.setBillingInfo(billingInfo);
    } else {
      order.setBillingInfo(null);
    }
    List<TransactionItem> itemList = new ArrayList<>();
    // set transaction items

    var userDetails = authUserService.getCurrentlyAuthenticatedUser();
    User user =
        userRepository
            .findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    order.setUserId(user.getUserId());
    for (UUID itemId : createOrderRequest.getTransactionItemIds()) {
      TransactionItem transactionItem =
          transactionItemRepository
              .findByTransactionItemId(itemId)
              .orElseThrow(() -> new ResourceNotFoundException("Transaction item not found"));
      // check if the user has access to the transaction item
      if (transactionItem.getDesign().getUser().getUserId() != user.getUserId()) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "You lack clearance to create an order including this transaction item: '"
                + transactionItem.getTransactionItemId()
                + "'");
      }
      itemList.add(transactionItem);
    }
    order.setTransactionItems(itemList);

    return order;
  }

  public void sendCustomOrderRequestEmail(CreateCustomOrderRequest order) {
    try {
      this.mailService.sendCustomOrderRequestEmail(order);
    } catch (Exception e) {
      LOGGER.error("Failed to process custom order request email", e);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to send custom order request email. Try again later");
    }
  }
}
