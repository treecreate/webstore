import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
describe('PageNotFoundPage', () => {
  beforeEach(() => {
    cy.visit('/pageNotFound');
  });

  describe.skip('Not logged in actions', () => {
    it('should be opened when invalid page is opened', () => {
      cy.visit('/veryInvalidPageMuchWrongSuchError');
      cy.contains('Page not found');
    });

    it('should point to the correct email', () => {
      const treecreateMail = 'info@treecreate.dk';
      cy.get('[data-cy=page-not-found-mail-treecreate-link]').contains(treecreateMail);
      cy.get('[data-cy=page-not-found-mail-treecreate-link]')
        .should('have.attr', 'href')
        .and('include', `mailto:${treecreateMail}`);
    });

    it('should redirect to login when the "dashboard" button is clicked', () => {
      cy.get('[data-cy=page-not-found-dashboard-btn]').click();
      cy.contains('Login');
    });
  });

  describe('Logged in actions', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin))
      );
    });
    it('should redirect to dashboard when the "dashboard" button is clicked', () => {
      cy.visit('/pageNotFound');
      cy.get('[data-cy=page-not-found-dashboard-btn]').click();
      cy.url().should('contain', '/dashboard');
    });

    it('should redirect to back to previous page (dashboard) when the "back" button is clicked', () => {
      cy.visit('/dashboard');
      cy.visit('/pageNotFound');
      cy.get('[data-cy=page-not-found-back-btn]').click();
      cy.url().should('contain', '/dashboard');
    });

    it('should be opened when invalid page is opened', () => {
      cy.visit('/veryInvalidPageMuchWrongSuchError');
      cy.contains('Page not found');
    });
  });
});
