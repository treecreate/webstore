import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

describe('item-card', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.visit('/orders');
  });

  it('should contain a card', () => {
    cy.get('[data-cy=card]').should('exist');
  });

  it('should contain a visible title', () => {
    cy.get('[data-cy=card-title]').should('exist');
    cy.get('[data-cy=card-title]').should('be.visible');
  });

  it('should contain a "Orders" as a title', () => {
    cy.get('[data-cy=card-title]').contains('Orders').should('exist');
  });

  it('should contain a card divider', () => {
    cy.get('[data-cy=card-divider]').should('exist');
  });

  it('should contain a card content', () => {
    cy.get('[data-cy=card-content]').should('exist');
  });
});
