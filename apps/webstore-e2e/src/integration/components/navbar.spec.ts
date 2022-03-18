import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';
describe('NavbarComponent', () => {
  const authMockService = new AuthenticationService();

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

  it('should contain a Treecreate logo, Products button, Log In button, and Basket', () => {
    cy.get('[data-cy=navbar]').get('[data-cy=navbar-logo-img]').should('be.visible');
    cy.get('[data-cy=navbar]').get('[data-cy=navbar-localization]').should('be.visible');
    cy.get('[data-cy=navbar]').get('[data-cy=navbar-basket-link]').should('be.visible');
    cy.get('[data-cy=navbar]').contains('Products').should('exist');
    cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
    cy.get('[data-cy=navbar]').contains('Log in').should('exist');
  });

  it('should display profile instead of log in when user is authenticated', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.visit('/home');
    cy.get('[data-cy=navbar]').contains('Log in').should('not.exist');
    cy.get('[data-cy=navbar]').contains('Profile').should('exist');
  });

  it('should log the out user and clear local storage information', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.visit('/home');
    cy.get('[data-cy=navbar-profile-dropdown]').trigger('mouseenter');
    cy.get('[data-cy=navbar-log-out-btn]').click({ force: true });
    cy.url().should('contain', '/home');
    cy.get('[data-cy=navbar]').contains('Log in').should('exist');
    cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
  });
});
