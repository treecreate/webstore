import { CookieStatus, LocalStorageVars } from '@models';
describe('PageNotFoundPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/pageNotFound');
  });

  it('should contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=footer]').should('exist');
  });

  it('should have url of 404', () => {
    cy.visit('/pageNotFound');
    cy.url().should('contain', '/404');
  });

  it('should redirect to home when the "home" button is clicked', () => {
    cy.get('[data-cy=page-not-found-home-btn]').click();
    cy.url().should('contain', '/');
  });

  it('should redirect to back to previous page (home) when the "back" button is clicked', () => {
    cy.visit('/');
    cy.visit('/pageNotFound');
    cy.get('[data-cy=page-not-found-back-btn]').click();
    cy.url().should('contain', '/');
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
