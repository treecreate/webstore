import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
describe('PageNotFoundPage', () => {
  beforeEach(() => {
    cy.visit('/pageNotFound');
  });

  describe('Not logged in actions', () => {
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
  });

  describe('Logged in actions', () => {});
});
