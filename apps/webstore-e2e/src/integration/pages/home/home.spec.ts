import { CookieStatus, LocalStorageVars } from '@models';
describe('HomePage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/home');
  });

  it('should contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=footer]').should('exist');
  });
  it('should do nothing when "start" button is clicked', () => {
    cy.get('.tc-start-main').click({ force: true });
    cy.url().should('contain', '/home');
  });
});
