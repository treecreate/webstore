import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('Signup Page', () => {
  const authMockService = new AuthenticationService();

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
  });

  describe('Signup page', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });

    it('should properly create a new user with correct credentials', () => {
      cy.intercept('POST', `/auth/signup`, {
        body: authMockService.getMockUser(AuthUserEnum.authUser),
        statusCode: 200,
      }).as('signupRequest');
      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      cy.get('[data-cy=signup-email-input]').type('e2e@test.com');
      cy.get('[data-cy=signup-password-input]').type('abcDEF123');
      cy.get('[data-cy=signup-confirm-password-input]').type('abcDEF123');
      cy.get('[data-cy=checkbox-terms-of-use]').click();
      cy.get('[data-cy=checkbox-newsletter]').click();
      cy.get('[data-cy=signup-btn]').should('be.enabled').click();
      cy.get('[data-cy=navbar]').contains('Log in').should('not.exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('exist');
      cy.url().should('contain', '/product');
    });

    it('should refuse signup for user with incorrect credentials', () => {
      cy.intercept('POST', `/auth/signup`, {
        body: authMockService.getMockUser(AuthUserEnum.authUser),
        statusCode: 200,
      }).as('signupRequest');
      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      cy.get('[data-cy=signup-email-input]').type('e2e@test.com');
      cy.get('[data-cy=signup-password-input]').type('abcDEF123');
      cy.get('[data-cy=checkbox-terms-of-use]').click();
      cy.get('[data-cy=checkbox-newsletter]').click();
      // check that confirm password validation works
      cy.get('[data-cy=signup-confirm-password-input]').type('abcDEF1234');
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      cy.get('[data-cy=signup-confirm-password-error').should('exist');
      cy.get('[data-cy=signup-confirm-password-input]')
        .clear()
        .type('abcDEF123');
      cy.get('[data-cy=signup-confirm-password-error').should('not.exist');
      cy.get('[data-cy=signup-btn]').should('be.enabled');
      // check that email validation works
      cy.get('[data-cy=signup-email-input]').clear().type('e2etest.com');
      cy.get('[data-cy=signup-email-error').should('exist');
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      cy.get('[data-cy=signup-email-input]').clear().type('e2e@test.com');
      cy.get('[data-cy=signup-email-error').should('not.exist');
      cy.get('[data-cy=signup-btn]').should('be.enabled');
      // check that password validation works
      cy.get('[data-cy=signup-password-input]').clear().type('abcDEF');
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      cy.get('[data-cy=signup-password-error').should('exist');
      cy.get('[data-cy=signup-password-input]').clear().type('abcDEF123');
      cy.get('[data-cy=signup-password-error').should('not.exist');
      // all of the inputs are correct
      cy.get('[data-cy=signup-btn]').should('be.enabled');
      // Uncheck terms od use
      cy.get('[data-cy=checkbox-terms-of-use]').click();
      cy.get('[data-cy=signup-btn]').should('be.disabled');
      // Uncheck newsletter (shouldn't be needed)
      cy.get('[data-cy=checkbox-terms-of-use]').click();
      cy.get('[data-cy=checkbox-newsletter]').click();
    });

    it('should redirect to login page when button is clicked', () => {
      cy.get('[data-cy=signup-redirect-login-btn]').click();
      cy.url().should('contain', '/login');
    });
  });

  describe('Local storage', () => {
    it('should detect that the user is logged in', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/signup');
      // should get redirected away from login since the user is detected as logged in
      cy.url().should('not.contain', '/login');

      cy.get('[data-cy=navbar]').contains('Log in').should('not.exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('exist');
    });

    it('should detect that the user is not logged in', () => {
      cy.visit('/signup');
      cy.url().should('contain', '/signup');

      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
    });

    it('should detect that the access token is expired and log the user out', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(
          authMockService.getMockUser(AuthUserEnum.authUserExpired)
        )
      );
      cy.visit('/signup');

      cy.url().should('contain', '/signup');

      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
    });
  });
});
