package dk.treecreate.api.order;

import dk.treecreate.api.designs.DesignDimension;
import dk.treecreate.api.designs.DesignType;
import dk.treecreate.api.discount.Discount;
import dk.treecreate.api.transactionitem.TransactionItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class OrderService
{
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);

    public boolean verifyPrice(Order order)
    {
        int totalItems = 0;
        BigDecimal subTotal = new BigDecimal(0);
        subTotal = subTotal.setScale(2, RoundingMode.HALF_EVEN);
        for (TransactionItem item : order.getTransactionItems())
        {
            // TODO - designType should come from transaction item
            int quantity = item.getQuantity();
            BigDecimal pricePerItem =
                pricePerItem(item.getDesign().getDesignType(), item.getDimension());
            subTotal = subTotal.add(pricePerItem.multiply(BigDecimal.valueOf(quantity)));
            totalItems += quantity;
        }
        // each planted tree adds 10kr to the price, minus the default 1 tree
        int plantedTreesPrice = (order.getPlantedTrees() * 10) - 10;
        subTotal = subTotal.add(new BigDecimal(plantedTreesPrice));

        LOGGER.info("verify price | SubTotal: " + subTotal + " | item count: " + totalItems +
            " | planted trees price: " + order.getPlantedTrees());
        if (!subTotal.equals(order.getSubtotal().setScale(2, RoundingMode.HALF_EVEN)))
        {
            LOGGER.warn("verify price | SubTotal (" + subTotal +
                ") DOES NOT match order.subtotal: " +
                order.getSubtotal());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Provided order subtotal (" + order.getSubtotal() +
                    ") does not match calculated subtotal (" + subTotal + ")!");
        }

        // Apply the discount etc
        BigDecimal total = calculateTotal(subTotal, order.getDiscount(), totalItems > 3);
        LOGGER.info("Verify price | Calculated Total: " + total);
        if (!total.equals(order.getTotal().setScale(2, RoundingMode.HALF_EVEN)))
        {
            LOGGER.warn("Verify price | Total (" + total +
                ") DOES NOT match order.total (" +
                order.getTotal().setScale(2, RoundingMode.HALF_EVEN) + ")!");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Provided order total (" + order.getTotal() +
                    ") does not match calculated total (" + total + ")!");
        }
        return true;
    }

    public BigDecimal calculateTotal(BigDecimal subTotal, Discount discount, boolean hasMoreThan3)
    {
        BigDecimal total = subTotal;
        total = total.setScale(2, RoundingMode.HALF_EVEN);
        if (discount != null)
        {
            switch (discount.getType())
            {
                case AMOUNT:
                    total = subTotal.subtract(BigDecimal.valueOf(discount.getAmount()));
                    break;
                case PERCENT:
                    total = subTotal.subtract(
                        subTotal.multiply(BigDecimal.valueOf((double) discount.getAmount() / 100)));
                    break;
                default:
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        " Provided discount information is not valid (" +
                            discount.getType() + ")!");
            }
            LOGGER.info(
                "verify price | Detected discount " + discount.getType() +
                    " of amount " + discount.getAmount());
        } else
        {
            if (hasMoreThan3)
            {
                LOGGER.info(
                    "verify price | Detected discount via More Than 4 items");
                total = subTotal.subtract(subTotal.multiply(new BigDecimal("0.25")));
            }
        }
        total = total.setScale(2, RoundingMode.HALF_EVEN);
        return total;
    }

    public BigDecimal pricePerItem(DesignType designType, DesignDimension designDimension)
    {
        switch (designType)
        {
            case FAMILY_TREE:
                switch (designDimension)
                {
                    case SMALL:
                        return new BigDecimal(495);
                    case MEDIUM:
                        return new BigDecimal(695);
                    case LARGE:
                        return new BigDecimal(995);
                    default:
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Provided design (" + designDimension +
                                ") dimension data is not valid");
                }
            default:
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Provided design (" + designType + ") type data is not valid");
        }
    }
}
