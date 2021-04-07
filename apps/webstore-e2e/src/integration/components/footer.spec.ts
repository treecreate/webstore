import {
  CookieStatus,
  LocalStorageVars,
} from 'apps/webstore-e2e/src/support/test.constants';
describe('FooterComponent', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/home');
  });

  it('should contain a footer', () => {
    cy.get('[data-cy=footer]').should('exist');
  });

  it('should contain a Navigation, Contact and Premium Offers sections', () => {
    cy.get('[data-cy=footer]').contains('Navigation').should('exist');
    cy.get('[data-cy=footer]').contains('Contact').should('exist');
    cy.get('[data-cy=footer]').contains('Premium offers').should('exist');
  });

  describe('should contain buttons for modals that', () => {
    it('should open terms of use modal when clicked on its link, and close by clicking on the backdrop', () => {
      cy.get('[data-cy=footer-terms-of-use-modal-link]').should('be.visible');
      cy.get('[data-cy=footer-terms-of-use-modal-link]').click({ force: true });
      cy.get('[data-cy=terms-of-use-modal]').should('exist');
      cy.get('.fade').click({
        multiple: true,
        force: true,
      });
      cy.wait(100); // the modal takes around 50 milliseconds to fade away
      cy.get('[data-cy=terms-of-use-modal]').should('not.be.visible');
    });
    it('should open terms of use modal when clicked on its link, and close when user presses the escape key', () => {
      cy.get('[data-cy=footer-terms-of-use-modal-link]').should('be.visible');
      cy.get('[data-cy=footer-terms-of-use-modal-link]').click({ force: true });
      cy.get('[data-cy=terms-of-use-modal]').should('exist');
      cy.get('[data-cy=terms-of-use-modal]').type('Cypress.io{esc}');
      cy.wait(250); // the modal takes around 200 milliseconds to fade away
      cy.get('[data-cy=terms-of-use-modal]').should('not.exist');
    });

    it('should open privacy notice modal when clicked on its link, and close by clicking on the backdrop', () => {
      cy.get('[data-cy=footer-privacy-notice-modal-link]').should('be.visible');
      cy.get('[data-cy=footer-privacy-notice-modal-link]').click({
        force: true,
      });
      cy.get('[data-cy=privacy-notice-modal]').should('exist');
      cy.get('.fade').click({
        multiple: true,
        force: true,
      });
      cy.wait(100); // the modal takes around 50 milliseconds to fade away
      cy.get('[data-cy=privacy-notice-modal]').should('not.be.visible');
    });

    it('should open privacy notice modal when clicked on its link, and close when user presses the escape key', () => {
      cy.get('[data-cy=footer-privacy-notice-modal-link]').should('be.visible');
      cy.get('[data-cy=footer-privacy-notice-modal-link]').click({
        force: true,
      });
      cy.get('[data-cy=privacy-notice-modal]').should('exist');
      cy.get('[data-cy=privacy-notice-modal]').type('Cypress.io{esc}');
      cy.wait(250); // the modal takes around 200 milliseconds to fade away
      cy.get('[data-cy=privacy-notice-modal]').should('not.exist');
    });
  });
});
