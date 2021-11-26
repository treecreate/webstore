import { CookieStatus, LocalStorageVars } from '@models';
describe('PageNotFoundPage', () => {
  beforeEach(() => {
    cy.visit('/pageNotFound');
  });

  it('should redirect to home when the "home" button is clicked', () => {
    cy.get('[data-cy=page-not-found-home-btn]').click();
    cy.url().should('contain', '/home');
  });

  it('should redirect to back to previous page (home) when the "back" button is clicked', () => {
    cy.visit('/home');
    cy.visit('/pageNotFound');
    cy.get('[data-cy=page-not-found-back-btn]').click();
    cy.url().should('contain', '/home');
  });

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
