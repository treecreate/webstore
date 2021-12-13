import { IDiscount, DiscountType } from '@interfaces';
import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const mockDiscount: IDiscount = {
  discountId: '123',
  discountCode: 'yeet10percent',
  amount: 10,
  type: DiscountType.percent,
  remainingUses: 2,
  totalUses: 1,
  expiresAt: new Date('2029-11-20T00:00:00'),
};

const mockDiscountNoUsesLeft: IDiscount = {
  discountId: '1234',
  discountCode: 'yeet20percent',
  amount: 20,
  type: DiscountType.percent,
  remainingUses: 0,
  totalUses: 1,
  expiresAt: new Date('2029-11-20T00:00:00'),
};

const mockDiscountExpired: IDiscount = {
  discountId: '12345',
  discountCode: 'yeet30percent',
  amount: 30,
  type: DiscountType.percent,
  remainingUses: 10,
  totalUses: 1,
  expiresAt: new Date('2021-11-20T00:00:00'),
};

const authMockService = new AuthenticationService();

const mockDiscounts = [mockDiscount, mockDiscountNoUsesLeft, mockDiscountExpired];

describe('discountsPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', 'localhost:5000/discounts', {
      body: mockDiscounts,
      statusCode: 200,
    }).as('fetchDiscounts');

    cy.visit('/discounts');
  });

  it('should display the discounts card', () => {
    cy.get('[data-cy=discounts-card]').should('exist');
  });

  it('should display the create new button', () => {
    cy.get('[data-cy=discounts-create-btn]').should('exist');
  });

  it('should display the discounts table with header and rows', () => {
    cy.get('[data-cy=discounts-table]').should('exist');
    cy.get('[data-cy=discounts-table]').get('[data-cy=discounts-table-header]').should('exist');
    cy.get('[data-cy=discounts-table]').get('[data-cy=discounts-table-row]').should('exist');
    cy.get('[data-cy=discounts-table-row]').should('have.length', mockDiscounts.length);
  });

  it('should display the correct headers', () => {
    cy.get('[data-cy=discounts-table-header]').first().contains('Code').should('exist');
    cy.get('[data-cy=discounts-table-header]').first().contains('Id').should('exist');
    cy.get('[data-cy=discounts-table-header]').first().contains('Uses left').should('exist');
    cy.get('[data-cy=discounts-table-header]').first().contains('Used').should('exist');
    cy.get('[data-cy=discounts-table-header]').first().contains('Expires at').should('exist');
    cy.get('[data-cy=discounts-table-header]').first().contains('Actions').should('exist');
  });

  it('should display the correct discounts information', () => {
    cy.get('[data-cy=discounts-table-row]').first().contains(mockDiscounts[0].discountCode).should('exist');
    cy.get('[data-cy=discounts-table-row]').first().contains('123').should('exist');
    cy.get('[data-cy=discounts-table-row]').first().contains(mockDiscounts[0].remainingUses).should('exist');
    cy.get('[data-cy=discounts-table-row]').first().contains(mockDiscounts[0].totalUses).should('exist');
    cy.get('[data-cy=discounts-table-row]').first().contains('Edit').should('exist');
    cy.get('[data-cy=discounts-table-row]').first().contains('Active').should('exist');
  });

  it('should contain an edit and activate button for each entry', () => {
    cy.get('[data-cy=discounts-edit-btn]').should('have.length', mockDiscounts.length);
    cy.get('[data-cy=discounts-enable-btn]').should('have.length', mockDiscounts.length);
  });
});
