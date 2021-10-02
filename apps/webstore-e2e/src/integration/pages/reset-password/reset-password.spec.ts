import { CookieStatus, LocalStorageVars } from '@models';

const resetPasswordUUID = '1c1ca614-6600-4e61-aec5-8e6143b1';
describe('resetPasswordPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/resetPassword/' + resetPasswordUUID);
  });

  it('should show error messages when password is not good enough', () => {
    cy.get('[data-cy=reset-password-password-input]').type('abcDEFabcDEF');
    cy.get('[data-cy=reset-password-password-error-message]').should('exist');
    cy.get('[data-cy=reset-password-password-input]').type('123');
    cy.get('[data-cy=reset-password-password-error-message]').should(
      'not.exist'
    );
    cy.get('[data-cy=reset-password-password-input]').clear();
    cy.get('[data-cy=reset-password-password-input]').type('abCD12');
    cy.get('[data-cy=reset-password-password-error-message]').should('exist');
  });

  it("should display confirm password error message when it doesn't match password", () => {
    cy.get('[data-cy=reset-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-confirm-password-input]').type('abcDEF321');
    cy.get('[data-cy=reset-password-confirm-password-error-message]').should(
      'exist'
    );
    cy.get('[data-cy=reset-password-confirm-password-input]').clear();
    cy.get('[data-cy=reset-password-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-confirm-password-error-message]').should(
      'not.exist'
    );
  });

  it("should disable reset password button when passwords don't match", () => {
    cy.get('[data-cy=reset-password-button]').should('be.disabled');
    cy.get('[data-cy=reset-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-button]').should('be.disabled');
    cy.get('[data-cy=reset-password-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-button]').should('not.be.disabled');
    cy.get('[data-cy=reset-password-confirm-password-input]').type('4');
    cy.get('[data-cy=reset-password-button]').should('be.disabled');
  });

  it('should display failed message after changing password', () => {
    cy.get('[data-cy=reset-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=reset-password-button]').click();
    cy.get('[data-cy=reset-password-failed]').should('exist');
  });
});
