import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('Login Page', () => {
  const authMockService = new AuthenticationService();

  describe('Login page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should properly authenticate user with correct credentials', () => {
      cy.intercept('POST', `/auth/signin`, {
        body: authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin),
        statusCode: 200,
      }).as('signinRequest');
      cy.get('[data-cy=admin-navbar]').contains('TC management').should('exist');
      cy.get('[data-cy=login-email-input]').type('e2e@test.com');
      cy.get('[data-cy=login-password-input]').type('abcDEF123');
      cy.get('[data-cy=login-btn]').should('be.enabled').click();
      cy.get('[data-cy=admin-navbar]').contains('Login').should('not.exist');
      cy.get('[data-cy=admin-navbar]').contains('Account').should('exist');
      cy.get('[data-cy=admin-navbar]').contains('Logout').should('exist');
      cy.url().should('contain', '/dashboard');
    });

    it('should refuse signin for user with incorrect credentials', () => {
      cy.intercept('POST', `/auth/signin`, {
        body: 'Unauthorized',
        statusCode: 401,
      }).as('signinRequest');
      cy.get('[data-cy=admin-navbar]').contains('Account').should('not.exist');
      cy.get('[data-cy=login-email-input]').type('e2e@test.com');
      cy.get('[data-cy=login-password-input]').type('incorrectPassword');
      cy.get('[data-cy=login-btn]').should('be.enabled').click();
      cy.get('[data-cy=admin-navbar]').contains('Account').should('not.exist');
      cy.url().should('contain', '/login');
    });
  });

  describe('Local storage', () => {
    it('should detect that the user is logged in', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin))
      );
      cy.visit('/login');
      // should get redirected away from login since the user is detected as logged in
      cy.url().should('not.contain', '/login');

      cy.get('[data-cy=admin-navbar]').contains('Account').should('exist');
    });

    it('should detect that the user is not logged in', () => {
      cy.visit('/login');
      cy.url().should('contain', '/login');

      cy.get('[data-cy=admin-navbar]').contains('Account').should('not.exist');
    });

    it('should detect that the access token is expired and log the user out', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserExpired))
      );
      cy.visit('/login');

      cy.url().should('contain', '/login');

      cy.get('[data-cy=admin-navbar]').contains('Account').should('not.exist');
    });
  });
});
