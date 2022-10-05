import { CurrencyEnum, DiscountType, IOrder, OrderStatusEnum, ShippingMethodEnum } from '@interfaces';
import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}

/**
 * Validates if `k` is a key of object T;
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isKeyof<T>(k: keyof any, obj: T): k is keyof T {
  return k in obj;
}

/**
 * Converts a hex color to an rgb color.
 *
 * @param hex the hex color.
 * @returns an object with the rgb color.
 */
function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Gets the Label color of the Order Status based on the status.
 *
 * @param orderStatus the status of the order.
 * @returns the color of the label.
 */
function getOrderStatusColor(orderStatus: OrderStatusEnum): LabelColorsEnum {
  switch (orderStatus) {
    case OrderStatusEnum.initial:
      return LabelColorsEnum.blue;
    case OrderStatusEnum.pending:
      return LabelColorsEnum.blue;
    case OrderStatusEnum.new:
      return LabelColorsEnum.red;
    case OrderStatusEnum.rejected:
      return LabelColorsEnum.grey;
    case OrderStatusEnum.processed:
      return LabelColorsEnum.red;
    case OrderStatusEnum.assembling:
      return LabelColorsEnum.yellow;
    case OrderStatusEnum.shipped:
      return LabelColorsEnum.blue;
    case OrderStatusEnum.delivered:
      return LabelColorsEnum.green;
    default:
      return LabelColorsEnum.lightGrey;
  }
}

/**
 * Gets the Label color for the 'Days Left' column in the table based on the days left until
 * delivery and the status of the order.
 *
 * @param daysLeft days left until delivery.
 * @param orderStatus the status of the order.
 * @returns the color of the label.
 */
function getDaysLeftColor(daysLeft: number, orderStatus: OrderStatusEnum): LabelColorsEnum {
  // Order status is NOT: Delivered, Shipped or Rejected.
  if (
    orderStatus !== OrderStatusEnum.delivered &&
    orderStatus !== OrderStatusEnum.shipped &&
    orderStatus !== OrderStatusEnum.rejected
  ) {
    if (daysLeft >= 9) {
      return LabelColorsEnum.green;
    }
    if (daysLeft >= 5) {
      return LabelColorsEnum.yellow;
    }
    return LabelColorsEnum.red;
  }
  return LabelColorsEnum.lightGrey;
}

/**
 * Generates a date when the order would have to be created to match the given amount
 * of days left until the delivery date.
 *
 * @param daysLeft - days left until delivery.
 * @returns date when the order would be created in order to fit the days left.
 */
function getCreatedAt(daysLeft: number): Date {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (14 - daysLeft));

  return createdAt;
}

/**
 * Generates a mocked order with the given status and amount of days left until delivery.
 *
 * @param status - order status.
 * @param daysLeft - days left until delivery.
 * @returns a mocked order with the required data.
 */
function mockOrder(status: OrderStatusEnum, daysLeft: number): IOrder {
  return {
    status: status,
    billingInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    contactInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    createdAt: getCreatedAt(daysLeft),
    currency: CurrencyEnum.dkk,
    discount: {
      discountCode: 'suck it',
      type: DiscountType.amount,
      amount: 100,
      remainingUses: 1,
      totalUses: 2,
      isEnabled: true,
    },
    orderId: 'MakeMeWantIt',
    paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    plantedTrees: 1,
    shippingMethod: ShippingMethodEnum.homeDelivery,
    //State    -- not implemented
    subtotal: 1914,
    total: 1814,
    transactionItems: [],
    userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  };
}

const authMockService = new AuthenticationService();

const mockOrders = [mockOrder(OrderStatusEnum.initial, 14)];

describe('orderDetailsPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', `/orders`, {
      body: mockOrders,
      statusCode: 200,
    }).as('fetchOrders');

    cy.visit('/orders/MakeMeWantIt');
  });

  it('should display the back button', () => {
    cy.get('[data-cy=back-btn]').should('exist');
  });

  it('should display the order details card', () => {
    cy.get('[data-cy=order-details-card]').should('exist');
  });

  it('should display the order details card header', () => {
    cy.get('[data-cy=order-details-header]').should('exist');
    cy.get('[data-cy=order-details-header]').contains('Days');
  });

  it('should have the corresponding color for amount of days left', () => {
    cy.get('[data-cy=order-details-days]').should('exist');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cy.get('[data-cy=order-details-days]').each(($label, index) => {
      const daysLeft = $label.contents().text().trim();
      const status = mockOrders[0].status;
      if (isKeyof(status, OrderStatusEnum)) {
        const statusEnum = OrderStatusEnum[status];
        const expectedColor = hexToRgb(getDaysLeftColor(Number(daysLeft), statusEnum));
        const colorInRgb = `rgb(${expectedColor?.r}, ${expectedColor?.g}, ${expectedColor?.b})`;
        expect($label.css('background-color')).to.contain(colorInRgb);
      }
    });
  });

  it('should display the ids section', () => {
    cy.get('[data-cy=order-details-ids]').should('exist');
    cy.get('[data-cy=order-details-ids]').contains('Customer id:');
    cy.get('[data-cy=order-details-ids]').contains(mockOrders[0].userId);
    cy.get('[data-cy=order-details-ids]').contains('Order id:');
    cy.get('[data-cy=order-details-ids]').contains(mockOrders[0].orderId);
  });

  it('should display the date and status section', () => {
    cy.get('[data-cy=order-details-date-status]').should('exist');
    cy.get('[data-cy=order-details-date-status]').contains('Created at:');
    cy.get('[data-cy=order-details-date-status]').contains('Order status:');
    cy.get('[data-cy=order-details-date-status]').contains(mockOrders[0].status);
  });

  it('should have the corresponding color for each status', () => {
    cy.get('[data-cy=order-status]').each(($label) => {
      const status = $label.contents().text().trim().toLowerCase();
      if (isKeyof(status, OrderStatusEnum)) {
        const statusEnum = OrderStatusEnum[status];
        const expectedColor = hexToRgb(getOrderStatusColor(statusEnum));
        const colorInRgb = `rgb(${expectedColor?.r}, ${expectedColor?.g}, ${expectedColor?.b})`;
        expect($label.css('background-color')).to.contain(colorInRgb);
      }
    });
  });

  it('should display a list of options', () => {
    cy.get('.mat-select-panel').should('not.exist');
    cy.get('[data-cy=order-status]').first().click();
    cy.get('.mat-select-panel').should('be.visible');
    cy.get('[data-cy=order-status-option]').should('have.length', 8);
  });

  // TODO - Figure out why this minor test fails in CI but not locally
  it.skip('should correctly change the status', () => {
    cy.intercept('PATCH', 'orders/MakeMeWantIt', {
      statusCode: 200,
    }).as('updateOrderStatus');

    cy.get('[data-cy=order-status]').first().contains('INITIAL');
    cy.get('[data-cy=order-status]').first().click();
    cy.get('[data-cy=order-status-option]').first().click();
    cy.get('[data-cy=order-status]').first().contains('DELIVERED');
    cy.wait('@updateOrderStatus').get('[data-cy=order-status-option]').should('contain', 'DELIVERED');
  });

  it('should reload orders on status change failure', () => {
    cy.intercept('PATCH', 'orders/MakeMeWantIt', {
      statusCode: 500,
    }).as('updateOrderStatus');

    cy.get('[data-cy=order-status]').first().click();
    cy.get('[data-cy=order-status-option]').first().click();

    cy.wait('@fetchOrders');
    cy.get('[data-cy=order-status]').first().contains('INITIAL');
  });

  describe('items-section', () => {
    it('should display the items divider', () => {
      cy.get('[data-cy=items-divider]').should('exist');
      cy.get('[data-cy=items-divider]').contains('Items');
    });
  });

  describe('payment-section', () => {
    it('should display the payment divider', () => {
      cy.get('[data-cy=payment-divider]').should('exist');
      cy.get('[data-cy=payment-divider]').contains('Payment');
    });

    it('should display the payment left information', () => {
      cy.get('[data-cy=payment-left]').should('exist');
      cy.get('[data-cy=payment-left]').contains('Payment id:');
      cy.get('[data-cy=payment-left]').contains(mockOrders[0].userId);
      cy.get('[data-cy=payment-left]').contains('Subtotal:');
      cy.get('[data-cy=payment-left]').contains(mockOrders[0].subtotal);
      cy.get('[data-cy=payment-left]').contains('Saved:');
      cy.get('[data-cy=payment-left]').contains(mockOrders[0].subtotal - (mockOrders[0].total - 25));
      cy.get('[data-cy=payment-left]').contains('Delivery price:');
      cy.get('[data-cy=payment-left]').contains('Trees planted price:');
      cy.get('[data-cy=payment-left]').contains('Total amount payed:');
      cy.get('[data-cy=payment-left]').contains(mockOrders[0].total);
      cy.get('[data-cy=payment-left]').contains('VAT:');
    });

    it('should display the payment right information', () => {
      cy.get('[data-cy=payment-right]').should('exist');
      cy.get('[data-cy=payment-right]').contains('Created at:');
      cy.get('[data-cy=payment-right]').contains('Discount type:');
      cy.get('[data-cy=payment-right]').contains('Discount code:');
      cy.get('[data-cy=payment-right]').contains('Discount amount:');
      cy.get('[data-cy=payment-right]').contains('Delivery type:');
      cy.get('[data-cy=payment-right]').contains('Extra trees planted:');
      cy.get('[data-cy=payment-right]').contains(mockOrders[0].plantedTrees - 1);
    });
  });

  describe('contact-info-section', () => {
    it('should display the contact info divider', () => {
      cy.get('[data-cy=contact-info-divider]').should('exist');
      cy.get('[data-cy=contact-info-divider]').contains('Customer contact info');
    });

    it('should display the contact-info left information', () => {
      cy.get('[data-cy=contact-info-left]').should('exist');
      cy.get('[data-cy=contact-info-left]').contains('E-mail');
      cy.get('[data-cy=contact-info-left]').contains('Update contact info');
    });

    it('should display the contact-info right information', () => {
      cy.get('[data-cy=contact-info-right]').should('exist');
      cy.get('[data-cy=contact-info-right]').contains('Phonenumber');
    });
  });

  describe('delivery-info-section', () => {
    it('should update order delivery info', () => {
      cy.intercept('PATCH', '/orders/' + mockOrders[0].orderId, {
        statusCode: 200,
      });
      cy.get('[data-cy=update-contact-info-btn]').should('be.disabled');
      cy.get('[data-cy=email-input]').clear().type('howdy@maggot.booty');
      cy.get('[data-cy=phone-number-input]').clear().type('12345678');
      cy.get('[data-cy=update-contact-info-btn]').should('not.be.disabled');
      cy.get('[data-cy=update-contact-info-btn]').click();
    });

    it('should update order delivery info', () => {
      cy.intercept('PATCH', '/orders/' + mockOrders[0].orderId, {
        statusCode: 200,
      });
      cy.get('[data-cy=update-delivery-address-btn]').should('be.disabled');
      cy.get('[data-cy=name-input]').clear().type('Joe who? Joe mamma!');
      cy.get('[data-cy=update-delivery-address-btn]').should('not.be.disabled');
      cy.get('[data-cy=city-input]').clear().type('MammaCity');
      cy.get('[data-cy=postcode-input]').clear().type('Joe who? Joe mamma!');
      cy.get('[data-cy=update-delivery-address-btn]').should('be.disabled');
      cy.get('[data-cy=postcode-input]').clear().type('1234');
      cy.get('[data-cy=update-delivery-address-btn]').should('not.be.disabled');
      cy.get('[data-cy=update-delivery-address-btn]').click();
    });

    it('should display the delivery info divider', () => {
      cy.get('[data-cy=delivery-info-divider]').should('exist');
      cy.get('[data-cy=delivery-info-divider]').contains('Delivery address');
    });

    it('should display the delivery-info left information', () => {
      cy.get('[data-cy=delivery-info-left]').should('exist');
      cy.get('[data-cy=delivery-info-left]').contains('Name');
      cy.get('[data-cy=delivery-info-left]').contains('City');
      cy.get('[data-cy=delivery-info-left]').contains('Postcode');
      cy.get('[data-cy=delivery-info-left]').contains('Update address');
    });

    it('should display the delivery-info right information', () => {
      cy.get('[data-cy=delivery-info-right]').should('exist');
      cy.get('[data-cy=delivery-info-right]').contains('Address');
    });
  });

  describe('billing-info-section', () => {
    it('should display the billing info divider', () => {
      cy.get('[data-cy=billing-info-divider]').should('exist');
      cy.get('[data-cy=billing-info-divider]').contains('Billing address');
    });

    it('should display the billing-info left information', () => {
      cy.get('[data-cy=billing-info-left]').should('exist');
      cy.get('[data-cy=billing-info-left]').contains('Name');
      cy.get('[data-cy=billing-info-left]').contains('City');
      cy.get('[data-cy=billing-info-left]').contains('Postcode');
    });

    it('should display the billing-info right information', () => {
      cy.get('[data-cy=billing-info-right]').should('exist');
      cy.get('[data-cy=billing-info-right]').contains('Address');
    });
  });

  describe('actions-section', () => {
    it('should display the actions divider', () => {
      cy.get('[data-cy=actions-divider]').should('exist');
      cy.get('[data-cy=actions-divider]').contains('Actions');
    });

    it('should display the actions', () => {
      cy.get('[data-cy=actions-section]').should('exist');
      cy.get('[data-cy=actions-section]').contains('Generate shipping label');
      cy.get('[data-cy=actions-section]').contains('Resend order confirmation email');
      cy.get('[data-cy=actions-section]').contains('Generate paymentlink');
    });
  });
});
