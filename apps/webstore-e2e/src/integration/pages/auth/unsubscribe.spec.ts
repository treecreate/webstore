import { CookieStatus, LocalStorageVars } from '@models';

describe('Signup Page', () => {
  const subscribedNewsletterUUID = 'c0a80121-7ac0-190b-817a-c08ab0a12345';
  const notSubscribedNewsletterUUID = '7ac0-c0a80121-190b-817a-c08ab0a12345';
  const invalidNewsletterUUID = '1234';

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/');
  });

  it('should display a success message 204', () => {
    cy.intercept('DELETE', '/newsletter/' + subscribedNewsletterUUID, {
      statusCode: 204,
    });

    cy.visit('newsletter/unsubscribe/' + subscribedNewsletterUUID);

    cy.get('[data-cy=unsubscribe-success-message]').should('exist');
    cy.get('[data-cy=unsubscribe-success-icon]').should('exist');
    cy.get('[data-cy=unsubscribe-failed-icon]').should('not.exist');
    cy.get('[data-cy=unsubscribe-error-message]').should('not.exist');
    cy.get('[data-cy=unsubscribe-success-message]').should('contain', 'Unsubscribed!');
  });

  it('should display a failed message 404', () => {
    cy.intercept('DELETE', 'newsletter/' + notSubscribedNewsletterUUID, {
      statusCode: 404,
    });

    cy.visit('newsletter/unsubscribe/' + notSubscribedNewsletterUUID);

    cy.get('[data-cy=unsubscribe-success-message]').should('not.exist');
    cy.get('[data-cy=unsubscribe-success-icon]').should('not.exist');
    cy.get('[data-cy=unsubscribe-failed-icon]').should('exist');
    cy.get('[data-cy=unsubscribe-error-message]').should('exist');
  });

  it('should display a invalid message 400', () => {
    cy.intercept('DELETE', 'newsletter/' + invalidNewsletterUUID, {
      statusCode: 400,
    });

    cy.visit('newsletter/unsubscribe/' + invalidNewsletterUUID);

    cy.get('[data-cy=unsubscribe-success-message]').should('not.exist');
    cy.get('[data-cy=unsubscribe-success-icon]').should('not.exist');
    cy.get('[data-cy=unsubscribe-failed-icon]').should('exist');
    cy.get('[data-cy=unsubscribe-error-message]').should('exist');
  });

  it('redirect home button should work', () => {
    cy.intercept('DELETE', '/newsletter/' + subscribedNewsletterUUID, {
      statusCode: 204,
    });

    cy.visit('newsletter/unsubscribe/' + subscribedNewsletterUUID);
    cy.get('[data-cy=unsubscribe-home-btn]').click();
    cy.url().should('contain', '/home');
  });
});
