import { CookieStatus, LocalStorageVars } from '@models';
describe('RejectedCookiesPage', () => {
  beforeEach(() => {
    cy.visit('/rejectedCookies');
    // close the automatically-opening cookie prompt
    cy.get('[data-cy=cookie-prompt-modal-reject-cookies-btn]').click();
  });

  it('should display a cookie prompt on first visit', () => {
    cy.get('[data-cy=cookie-prompt-modal]').should('exist');
  });

  it('should contain a button for accepting all cookies', () => {
    cy.get('[data-cy=rejected-cookies-accept-all-btn]').should('exist');
  });

  it('should contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=footer]').should('exist');
  });

  it('should update local storage and redirect to home when "accept all" button is clicked', () => {
    cy.get('[data-cy=rejected-cookies-accept-all-btn]')
      .click()
      .then(() => {
        cy.url().should('contain', '/home');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
        expect(localStorage.getItem(LocalStorageVars.cookiesAccepted).replace(new RegExp('"', 'g'), '')).to.equal(
          CookieStatus.accepted
        );
        // shouldn't open the prompt when re-visiting the website
        cy.visit('/home');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
      });
  });
});
