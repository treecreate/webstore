import { LocalStorageVars, CookieStatus } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

describe('AddToBasketModal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
  });

  it('should open add-to-basket modal when user is authenticated', () => {
    cy.visit('/products/family-tree');
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
    cy.visit('/products/quotable');
    cy.get('[data-cy=add-quotable-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
  });

  it('should increase / decrease quantity', () => {
    cy.visit('/products/family-tree');
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '1');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should('not.be.disabled');
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '2');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '3');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '4');
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '3');
  });

  it('should increase / decrease dimensions', () => {
    cy.visit('/products/family-tree');
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '20cm x 20cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should('not.be.disabled');
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '25cm x 25cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '30cm x 30cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '25cm x 25cm');
  });
});
