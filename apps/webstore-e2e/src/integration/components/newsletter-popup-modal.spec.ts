import { LocalStorageVars, CookieStatus } from '@models';

describe('Signup to newsletter popup modal', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should show the popup and save it in localstorage', () => {
    expect(localStorage.getItem(LocalStorageVars.hasSeenNewsletterModal)).to.equal(null);
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();
    /*eslint-disable */
    setTimeout(() => {
      cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
      cy.get('[data-cy=newsletter-modal-popup]').should('exist');
      cy.get('[data-cy=newsletter-modal-close-btn]')
        .click()
        .then(() => {
          expect(localStorage.getItem(LocalStorageVars.hasSeenNewsletterModal)).to.equal('true');
        });
    }, 4000);
    /*eslint-enable */
  });

  it('registers a new newsletter signup', () => {
    cy.intercept('POST', '/newsletter/test@test.com', {
      statusCode: 200,
    });
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();
    cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
    /*eslint-disable */
    setTimeout(() => {
      cy.get('[data-cy=newsletter-modal-popup]').should('exist');
      cy.get('[data-cy=newsletter-modal-email-input]').type('test');
      cy.get('[data-cy=newsletter-modal-subscribe-btn]').click();
      cy.get('[data-cy=newsletter-modal-email-input]').type('@test.com');
      cy.get('[data-cy=newsletter-modal-subscribe-btn]').click();
      cy.get('[data-cy=newsletter-modal-popup]').should('not.exist');
    }, 4000);
    /*eslint-enable */
  });
});
