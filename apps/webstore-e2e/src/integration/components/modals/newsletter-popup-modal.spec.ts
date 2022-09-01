import { LocalStorageVars } from '@models';

describe('Signup to newsletter popup modal', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should show the popup and save it in localstorage', () => {
    expect(localStorage.getItem(LocalStorageVars.hasSeenNewsletterModal)).to.equal(null);
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
    cy.get('[data-cy=sticky-newsletter-button]').should('exist');
    cy.get('[data-cy=sticky-newsletter-button]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('exist');
    cy.get('[data-cy=newsletter-modal-close-btn]')
      .click()
      .then(() => {
        expect(localStorage.getItem(LocalStorageVars.hasSeenNewsletterModal)).to.equal('true');
      });
  });

  it('registers a new newsletter signup', () => {
    cy.intercept('POST', '/newsletter/test@test.com?lang=da', {
      statusCode: 200,
    });
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
    cy.get('[data-cy=sticky-newsletter-button]').should('exist');
    cy.get('[data-cy=sticky-newsletter-button]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('exist');
    cy.get('[data-cy=newsletter-modal-email-input]').type('test');
    cy.get('[data-cy=newsletter-modal-subscribe-btn]').click();
    cy.get('[data-cy=newsletter-modal-email-input]').type('@test.com');
    cy.get('[data-cy=newsletter-modal-subscribe-btn]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
  });
});
