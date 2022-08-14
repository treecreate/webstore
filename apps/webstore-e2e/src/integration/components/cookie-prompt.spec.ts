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

  it('should close the moda, update LocalStorage, and not open the prompt again on page reload when cookies are rejected', () => {
    cy.get('[data-cy=cookie-prompt-modal-reject-cookies-btn]')
      .click()
      .then(() => {
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
        expect(localStorage.getItem(LocalStorageVars.cookiesAccepted).replace(new RegExp('"', 'g'), '')).to.equal(
          CookieStatus.rejected
        );
        // shouldn't open the prompt when re-visiting the website
        cy.visit('/home');
        cy.get('[data-cy=cookie-prompt-modal]').should('not.exist');
      });
  });

  it('should close the modal, update LocalStorage, and not open the prompt again on page reload when cookies are accepted', () => {
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]')
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
  it('should allow clicking on the background without closing the modal', () => {
    cy.get('[data-cy=home-title]').click({
      multiple: true,
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100); // the modal takes around 50 milliseconds to fade away
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
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-use-modal]').should('not.exist');
  });
});
