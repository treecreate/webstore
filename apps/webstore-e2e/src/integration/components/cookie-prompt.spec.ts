import { CookieStatus, LocalStorageVars } from '@models';
describe('CookiePromptModal', () => {
  beforeEach(() => cy.visit('/home'));

  it('should display a cookie prompt on first visit', () => {
    cy.get('[data-cy=cookie-prompt-modal]').should('exist');
  });

  it('should contain buttons for accepting and rejecting cookies', () => {
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').should('exist');
    cy.get('[data-cy=cookie-prompt-modal-reject-cookies-btn]').should('exist');
  });

  it('should redirect to /rejectedCookies and not allow the user to use Treecreate when cookies are rejected', () => {
    cy.get('[data-cy=cookie-prompt-modal-reject-cookies-btn]')
      .click()
      .then(() => {
        cy.url().should('contain', '/rejectedCookies');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
        expect(
          localStorage
            .getItem(LocalStorageVars.cookiesAccepted)
            .replace(new RegExp('"', 'g'), '')
        ).to.equal(CookieStatus.rejected);
        // shouldn't allow to directly visit home
        cy.visit('/home');
        cy.url().should('contain', '/rejectedCookies');
      });
  });

  it('should close the modal, update LocalStorage, and never open the prompt again when cookies are accepted.', () => {
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]')
      .click()
      .then(() => {
        cy.url().should('contain', '/home');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
        expect(
          localStorage
            .getItem(LocalStorageVars.cookiesAccepted)
            .replace(new RegExp('"', 'g'), '')
        ).to.equal(CookieStatus.accepted);
        // shouldn't open the prompt when re-visiting the website
        cy.visit('/home');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
      });
  });
  it("shouldn't allow to close the popup by clicking on the background", () => {
    cy.get('.fade').click({
      multiple: true,
      force: true,
    });
    cy.wait(100); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=cookie-prompt-modal]').should('exist');
  });

  it("shouldn't allow to close the popup by pressing escape", () => {
    cy.get('[data-cy=cookie-prompt-modal]').type('Cypress.io{esc}');
    cy.wait(250); // the modal takes around 200 milliseconds to fade away
    cy.get('[data-cy=cookie-prompt-modal]').should('exist');
  });

  it('should display terms of use modal when the link is clicked', () => {
    cy.get('[data-cy=cookie-prompt-modal-terms-of-use-link]').click();
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
  });

  it('should display terms of use modal when the link is clicked', () => {
    cy.get('[data-cy=cookie-prompt-modal-terms-of-use-link]').click();
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
  });

  it('should display terms of use modal when the link is clicked', () => {
    cy.get('[data-cy=cookie-prompt-modal-terms-of-use-link]').click();
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
    cy.get('.fade').click({
      multiple: true,
      force: true,
    });
    cy.wait(100); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-use-modal]').should('not.exist');
  });
});
