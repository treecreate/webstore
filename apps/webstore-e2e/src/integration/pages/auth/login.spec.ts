import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('Login Page', () => {
  const authMockService = new AuthenticationService();

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
  });

  describe('Login page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should properly authenticate user with correct credentials', () => {
      cy.intercept('POST', `/auth/signin`, {
        body: authMockService.getMockUser(AuthUserEnum.authUser),
        statusCode: 200,
      }).as('signinRequest');
      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
      cy.get('[data-cy=login-btn]').should('be.disabled');
      cy.get('[data-cy=login-email-input]').type('e2e@test.com');
      cy.get('[data-cy=login-password-input]').type('abcDEF123');
      cy.get('[data-cy=login-btn]').should('be.enabled').click();
      cy.get('[data-cy=navbar]').contains('Log in').should('not.exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('exist');
      cy.url().should('contain', '/products');
    });

    it('should refuse signin for user with incorrect credentials', () => {
      cy.intercept('POST', `/auth/signin`, {
        body: 'Unauthorized',
        statusCode: 401,
      }).as('signinRequest');
      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
      cy.get('[data-cy=login-btn]').should('be.disabled');
      cy.get('[data-cy=login-email-input]').type('e2e@test.com');
      cy.get('[data-cy=login-password-input]').type('incorrectPassword');
      cy.get('[data-cy=login-btn]').should('be.enabled').click();
      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
      cy.url().should('contain', '/login');
    });

    it('should redirect to signup page when signup button is clicked', () => {
      cy.get('[data-cy=login-signup-btn]').click();
      cy.url().should('contain', '/signup');
    });

    it('should open and close forgot password modal correctly', () => {
      cy.get('[data-cy=forgot-password-btn]').click();
      cy.get('[data-cy=forgot-password-modal]').should('exist');
      cy.get('[data-cy=forgot-password-modal-close-btn]').click();
      cy.get('[data-cy=forgot-password-modal]').should('not.exist');
    });

    it('should show error message in forgot password modal correctly', () => {
      cy.get('[data-cy=forgot-password-btn]').click();
      cy.get('[data-cy=forgot-password-modal]').should('exist');
      cy.get('[data-cy=forgot-password-reset-password-button]').should('be.disabled');

      cy.get('[data-cy=forgot-password-email-input]').type('test@test.com');
      cy.get('[data-cy=forgot-password-email-error-message]').should('not.exist');
      cy.get('[data-cy=forgot-password-reset-password-button]').should('not.be.disabled');

      cy.get('[data-cy=forgot-password-email-input]').clear();
      cy.get('[data-cy=forgot-password-email-input]').type('test-test.com');
      cy.get('[data-cy=forgot-password-email-error-message]').should('exist');
      cy.get('[data-cy=forgot-password-reset-password-button]').should('be.disabled');
    });

    it('should send the email properly', () => {
      const emailRequest = 'test@test.com';
      cy.intercept('GET', `users/resetPassword/${emailRequest}`, {
        statusCode: 204,
      });
      cy.get('[data-cy=forgot-password-btn]').click();
      cy.get('[data-cy=forgot-password-email-input]').type('test@test.com');
      cy.get('[data-cy=forgot-password-reset-password-button]').click();
    });
  });

  describe('Local storage', () => {
    it('should detect that the user is logged in', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/login');
      // should get redirected away from login since the user is detected as logged in
      cy.url().should('not.contain', '/login');

      cy.get('[data-cy=navbar]').contains('Log in').should('not.exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('exist');
    });

    it('should detect that the user is not logged in', () => {
      cy.visit('/login');
      cy.url().should('contain', '/login');

      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
    });

    it('should detect that the access token is expired and log the user out', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserExpired))
      );
      cy.visit('/login');

      cy.url().should('contain', '/home');

      cy.get('[data-cy=navbar]').contains('Log in').should('exist');
      cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
    });
  });
});
