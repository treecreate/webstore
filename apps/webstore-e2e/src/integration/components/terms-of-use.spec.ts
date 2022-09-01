import { CookieStatus, LocalStorageVars } from '@models';
describe.skip('TermsOfUseModal', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/');
  });

  it('should open terms of use modal when clicked on its link', () => {
    cy.get('[data-cy=footer-terms-of-use-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-use-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
  });

  it('should close terms of use modal when clicked on the "close" button', () => {
    cy.get('[data-cy=footer-terms-of-use-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-use-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
    cy.get('[data-cy=terms-of-use-modal-close-btn]').click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-use-modal]').should('not.be.visible');
  });

  it('should close terms of use modal when clicked on the "X" button', () => {
    cy.get('[data-cy=footer-terms-of-use-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-use-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-use-modal]').should('exist');
    cy.get('[data-cy=terms-of-use-modal-x-btn]').click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(150); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-use-modal]').should('not.be.visible');
  });
});
