import { CurrencyEnum, DiscountType, IOrder, OrderStatusEnum, ShippingMethodEnum } from '@interfaces';
import { LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

const mockUsers = [
  {
    userId: 'IllTakeYouSon',
    email: 'IllTakeYouSon@test.com',
    roles: [UserRoles.user, UserRoles.developer, UserRoles.admin],
    name: 'Teo the almigthy',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddyOG',
    email: 'PleaseTakeMeDaddyOG@test.com',
    roles: [UserRoles.user],
    name: 'cristian the huh hah',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddy1',
    email: 'PleaseTakeMeDaddy1@test.com',
    roles: [UserRoles.user],
    name: 'Alex MACAGNANA oooh nana',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddy2',
    email: 'PleaseTakeMeDaddy2@CAliJanuwich.com',
    roles: [UserRoles.user],
    name: 'CAliJanuwich',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
];

const mockOrders: IOrder[] = [
  {
    status: OrderStatusEnum.assembling,
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
    createdAt: new Date(),
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
    userId: 'IllTakeYouSon',
  },
  {
    status: OrderStatusEnum.assembling,
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
    createdAt: new Date(),
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
    userId: 'IllTakeYouSon',
  },
];

describe('Users page', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', 'http://localhost:5050/users', {
      body: mockUsers,
      statusCode: 200,
    }).as('fetchUsers');

    cy.visit('/users');
  });

  it('it should display the users in the list', () => {
    cy.get('[data-cy=users-table]').should('exist');
    cy.get('[data-cy=user-email]').should('have.length', 4);
  });
  it('it should display orders list dialog when clicking view orders', () => {
    cy.intercept('GET', '/orders', {
      body: mockOrders,
      statusCode: 200,
    });
    cy.get('[data-cy=view-orders-dialog]').should('not.exist');
    cy.get('[data-cy=view-user-orders-btn]').first().click();
    cy.get('[data-cy=view-orders-dialog]').should('exist');
    cy.get('[data-cy=user-has-no-orders]').should('not.exist');
    cy.get('[data-cy=user-orders-table]').should('exist');
  });

  it('it should display orders list dialog with no orders', () => {
    cy.intercept('GET', '/orders', {
      body: [],
      statusCode: 200,
    });
    cy.get('[data-cy=view-orders-dialog]').should('not.exist');
    cy.get('[data-cy=view-user-orders-btn]').first().click();
    cy.get('[data-cy=view-orders-dialog]').should('exist');
    cy.get('[data-cy=user-has-no-orders]').should('exist');
  });

  it('it should be able to view details about the user when clicking the view button', () => {
    cy.intercept('GET', '/users/' + mockUsers[0].userId, {
      body: mockUsers[0],
      statusCode: 200,
    });
    cy.get('[data-cy=edit-user-btn]').first().click();
    cy.url().should('contain', '/account?userId=IllTakeYouSon');
  });
});
