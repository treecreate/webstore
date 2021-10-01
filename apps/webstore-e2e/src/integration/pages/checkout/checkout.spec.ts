import { CookieStatus, LocalStorageVars } from '@models';
describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    //TODO: add user auth when implemented in checkout page
    cy.visit('/checkout');
  });

  it('should not contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('not.exist');
    cy.get('[data-cy=footer]').should('not.exist');
  });

  it('should not show billing address form', () => {});

  it('should display error message for shipping address name input', () => {});

  it('should display error message for shipping address phone number input', () => {});

  it('email input should be disabled', () => {});

  it('should display error message for shipping address name input', () => {});
});
