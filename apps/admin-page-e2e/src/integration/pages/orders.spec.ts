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

const mockOrders = [
  mockOrder(OrderStatusEnum.initial, 14),
  mockOrder(OrderStatusEnum.assembling, 9),
  mockOrder(OrderStatusEnum.delivered, 8),
  mockOrder(OrderStatusEnum.new, 5),
  mockOrder(OrderStatusEnum.pending, 4),
  mockOrder(OrderStatusEnum.processed, 1),
  mockOrder(OrderStatusEnum.rejected, 0),
  mockOrder(OrderStatusEnum.shipped, -1),
];

describe('ordersPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', 'http://localhost:5050/orders', {
      body: mockOrders,
      statusCode: 200,
    }).as('fetchOrders');

    cy.visit('/orders');
  });

  it('should display the orders card', () => {
    cy.get('[data-cy=orders-card]').should('exist');
  });

  it('should display the orders table with header and rows', () => {
    cy.get('[data-cy=orders-table]').should('exist');
    cy.get('[data-cy=orders-table]').get('[data-cy=orders-table-header]').should('exist');
    cy.get('[data-cy=orders-table]').get('[data-cy=orders-table-row]').should('exist');
    cy.get('[data-cy=orders-table-row]').should('have.length', mockOrders.length);
  });

  it('should display the correct headers', () => {
    cy.get('[data-cy=orders-table-header]').first().contains('Payment ID').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Payment Total').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Contact Email').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Date').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Days Left').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Items').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Status').should('exist');
    cy.get('[data-cy=orders-table-header]').first().contains('Actions').should('exist');
  });

  it('should display the correct order information', () => {
    cy.get('[data-cy=orders-table-row]').first().contains(mockOrders[0].paymentId).should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains(mockOrders[0].total).should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains(mockOrders[0].contactInfo.email).should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('14').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains(mockOrders[0].transactionItems.length).should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains(mockOrders[0].status).should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('View').should('exist');
  });

  it('should contain a view button for each entry', () => {
    cy.get('[data-cy=order-view-btn]').should('have.length', mockOrders.length);
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

  it('should have the corresponding color for each amount of days left', () => {
    cy.get('[data-cy=order-days-left]').each(($label, index) => {
      cy.get('[data-cy=order-status]')
        .eq(index)
        .then((statusLabel) => {
          const daysLeft = $label.contents().text().trim();
          const status = statusLabel.text().toLowerCase();
          if (isKeyof(status, OrderStatusEnum)) {
            const statusEnum = OrderStatusEnum[status];
            const expectedColor = hexToRgb(getDaysLeftColor(Number(daysLeft), statusEnum));
            const colorInRgb = `rgb(${expectedColor?.r}, ${expectedColor?.g}, ${expectedColor?.b})`;
            expect($label.css('background-color')).to.contain(colorInRgb);
          }
        });
    });
  });

  it('should display a list of options', () => {
    cy.get('.mat-select-panel').should('not.exist');
    cy.get('[data-cy=order-status]').first().click();
    cy.get('.mat-select-panel').should('be.visible');
    cy.get('[data-cy=order-status-option]').should('have.length', 8);
  });

  it('should correctly change the status', () => {
    cy.intercept('PATCH', 'orders/MakeMeWantIt', {
      body: mockOrder(OrderStatusEnum.delivered, 14),
      statusCode: 200,
    }).as('updateOrderStatus');

    cy.get('[data-cy=order-status]').first().contains('INITIAL');
    cy.get('[data-cy=order-status]').first().click();
    cy.get('[data-cy=order-status-option]').first().click();
    cy.get('[data-cy=order-status]').first().contains('DELIVERED');
    cy.wait('@updateOrderStatus').its('request.body').should('include', { status: 'DELIVERED' });
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

  it('should display sort buttons', () => {
    cy.get('.mat-sort-header-container').should('exist');
    cy.get('.mat-sort-header-container').should('have.length', 7);
  });
});
