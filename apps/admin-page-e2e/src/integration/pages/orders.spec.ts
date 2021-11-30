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
    },
    orderId: 'MakeMeWantIt',
    paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    plantedTrees: 1,
    shippingMethod: ShippingMethodEnum.homeDelivery,
    //State    -- not implemented
    subtotal: 1914,
    total: 1814,
    transactionItems: [],
    userID: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  };
}

const authMockService = new AuthenticationService();

describe('ordersPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/orders', {
      body: [
        mockOrder(OrderStatusEnum.initial, 14),
        mockOrder(OrderStatusEnum.assembling, 9),
        mockOrder(OrderStatusEnum.delivered, 8),
        mockOrder(OrderStatusEnum.new, 5),
        mockOrder(OrderStatusEnum.pending, 4),
        mockOrder(OrderStatusEnum.processed, 1),
        mockOrder(OrderStatusEnum.rejected, 0),
        mockOrder(OrderStatusEnum.shipped, -1),
      ],
      statusCode: 200,
    });
    cy.visit('/orders');
  });

  it('should display the orders card', () => {
    cy.get('[data-cy=orders-card]').should('exist');
  });

  it('should display the orders table with header and rows', () => {
    cy.get('[data-cy=orders-table]').should('exist');
    cy.get('[data-cy=orders-table]').get('[data-cy=orders-table-header]').should('exist');
    cy.get('[data-cy=orders-table]').get('[data-cy=orders-table-row]').should('exist');
    cy.get('[data-cy=orders-table-row]').should('have.length', 8);
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
    cy.get('[data-cy=orders-table-row]').first().contains('c0a80121-7ac0-190b-812a1-c08ab0a12345').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('1814').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('example@hotdeals.dev').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('14').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('0').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('INITIAL').should('exist');
    cy.get('[data-cy=orders-table-row]').first().contains('View').should('exist');
  });

  it('should contain a view button for each entry', () => {
    cy.get('[data-cy=orders-view-btn]').should('have.length', 8);
  });
});
