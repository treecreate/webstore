import { CookieStatus, LocalStorageVars } from '@models';

// TODO: Re-activate these cy tests since terms of sale is now a part of the footer. ( I dont know how to do this - Teo )
describe.skip('TermsOfSaleModal', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/home');
  });

  it('should open terms of Sale modal when clicked on its link', () => {
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-Sale-modal]').should('exist');
  });

  it('should close terms of Sale modal when clicked on the "close" button', () => {
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-Sale-modal]').should('exist');
    cy.get('[data-cy=terms-of-Sale-modal-close-btn]').click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(150); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-sale-modal]').should('not.be.visible');
  });

  it('should close terms of Sale modal when clicked on the "X" button', () => {
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').should('be.visible');
    cy.get('[data-cy=footer-terms-of-sale-modal-link]').click({ force: true });
    cy.get('[data-cy=terms-of-sale-modal]').should('exist');
    cy.get('[data-cy=terms-of-sale-modal-x-btn]').click({
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(150); // the modal takes around 50 milliseconds to fade away
    cy.get('[data-cy=terms-of-sale-modal]').should('not.be.visible');
  });
});
