import { CookieStatus, LocalStorageVars } from '@models';
describe('NavbarComponent', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/home');
  });

  it('should contain a navbar', () => {
    cy.get('[data-cy=navbar]').should('exist');
  });

  it('should contain a Treecreate logo, Home button, Product button, Log In button, and Basket', () => {
    cy.get('[data-cy=navbar]')
      .get('[data-cy=navbar-logo-img]')
      .should('be.visible');
    cy.get('[data-cy=navbar]').contains('Home').should('exist');
    cy.get('[data-cy=navbar]').contains('Product').should('exist');
    cy.get('[data-cy=navbar]').contains('Log In').should('exist');
  });
});
