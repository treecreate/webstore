import { IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockUser: IUser = {
  userId: '1',
  email: 'e2e@test.com',
  roles: [UserRoles.user],
  name: 'teodor jonasson',
  phoneNumber: '26192327',
  streetAddress: 'hillerødgade 69, 3 etage',
  streetAddress2: 'whackado',
  city: 'Århus',
  postcode: '1234',
  country: 'DenDenDen Wait, country? :o',
};

/* TODO: Add missing tests to checkout
 * - should have correct items in transaction (depends on data)
 * - should have correct pricing (depends on the data)
 * - should send the right request when going to payment and possibly others (@Kwandes)
 */

describe('CheckoutPage', () => {

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');
    //TODO: add user auth when implemented in checkout page
    cy.visit('/checkout');
  });

  it('should not contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('not.exist');
    cy.get('[data-cy=footer]').should('not.exist');
  });

  it('should have billing address be the same as delivery address be true', () => {
    cy.get('[data-cy=billing-address-is-the-same-checkbox]').should(
      'be.checked'
    );
    cy.get('[data-cy=billing-address-form]').should('not.exist');
  });

  it('should display billing address form when disabling billing and shipping address being the same', () => {
    cy.get('[data-cy=billing-address-is-the-same-button]').click();
    cy.get('[data-cy=billing-address-form]').should('exist');
  });

  it('should have delivery be set to parcelshop delivery', () => {
    cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should(
      'be.checked'
    );
    cy.get('[data-cy=checkout-form-home-delivery-checkbox]').should(
      'not.be.checked'
    );
  });

  it('should change to home delivery', () => {
    cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should(
      'be.checked'
    );
    cy.get('[data-cy=checkout-form-home-delivery-checkbox]').should(
      'not.be.checked'
    );
    cy.get('[data-cy=checkout-form-home-delivery-button]').click();
    cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should(
      'not.be.checked'
    );
    cy.get('[data-cy=checkout-form-home-delivery-checkbox]').should(
      'be.checked'
    );
  });

  it('should not show option to subscribe if user is already subscribed', () => {
    cy.intercept('GET', '/newsletter/me', {
      statusCode: 200,
    });
    cy.visit('/checkout');
    cy.get('[data-cy=checkout-form-subscribe-option]').should('not.exist');
  });

  it(`should display subscribe option when user isn't subscribed`, () => {
    cy.intercept('GET', '/newsletter/me', {
      statusCode: 404,
    });
    cy.visit('/checkout');
    cy.get('[data-cy=checkout-form-subscribe-option]').should('exist');
  });

  it('should have go to payment button disabled with wrong input in checkout form', () => {});

  it('should have go to payment button disabled when terms are not accepted', () => {
    cy.get('[data-cy=checkout-form-terms-checkbox]').should('not.be.checked');
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=checkout-form-terms-button]').click();
    cy.get('[data-cy=checkout-form-terms-checkbox]').should('be.checked');
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'not.be.disabled'
    );
  });

  it('should have go to payment button disabled when billing form is not filled', () => {
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=checkout-form-terms-button]').click();
    cy.get('[data-cy=checkout-form-terms-checkbox]').should('be.checked');
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'not.be.disabled'
    );
    cy.get('[data-cy=billing-address-is-the-same-button]').click();
    cy.get('[data-cy=billing-address-form]').should('exist');
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'be.disabled'
    );
  });

  it('should have "go to payment" button not be disabled when billing address is filled', () => {
    cy.get('[data-cy=checkout-form-terms-button]').click();
    cy.get('[data-cy=billing-address-is-the-same-button]').click();
    cy.get('[data-cy=billing-address-name-input]').type('test name');
    cy.get('[data-cy=billing-address-street-address-input]').type(
      'test address 123'
    );
    cy.get('[data-cy=billing-address-city-input]').type('test city');
    cy.get('[data-cy=billing-address-postcode-input]').type('1234');
    cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
      'not.be.disabled'
    );
  });

  it('should show terms modal when link is clicked', () => {
    cy.get('[data-cy=checkout-form-terms-of-sale]').click();
    cy.get('[data-cy=terms-of-sale-modal]').should('exist');
    cy.get('[data-cy=terms-of-sale-modal-close-btn]').click();
  });

  describe('billingAddressForm', () => {
    beforeEach(() => {
      cy.get('[data-cy=billing-address-is-the-same-button]').click();
    });
    it('should display error message for billingAddressForm name input', () => {
      cy.get('[data-cy=billing-address-name-input]').type('test');
      cy.get('[data-cy=billing-address-name-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=billing-address-name-input]').type('123');
      cy.get('[data-cy=billing-address-name-error-message]').should('exist');
    });

    it('should display error message for billingAddressForm street address input', () => {
      cy.get('[data-cy=billing-address-street-address-input]').type('test');
      cy.get('[data-cy=billing-address-street-address-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=billing-address-street-address-input]').type(
        '123134112341234123412341234 1234 1234 1234 123 41234 123 41234 123 41234 1234 '
      );
      cy.get('[data-cy=billing-address-street-address-error-message]').should(
        'exist'
      );
    });

    it('should display error message for billingAddressForm street address 2 input', () => {
      cy.get('[data-cy=billing-address-street-address-2-input]').type('test');
      cy.get(
        '[data-cy=billing-address-street-address-2-error-message]'
      ).should('not.exist');
      cy.get('[data-cy=billing-address-street-address-2-input]').type(
        '123134112341234123412341234 1234 1234 1234 123 41234 123 41234 123 41234 1234 '
      );
      cy.get(
        '[data-cy=billing-address-street-address-2-error-message]'
      ).should('exist');
    });

    it('should display error message for billingAddressForm city input ', () => {
      cy.get('[data-cy=billing-address-city-input]').type('CityName');
      cy.get('[data-cy=billing-address-city-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=billing-address-city-input]').type('123');
      cy.get('[data-cy=billing-address-city-error-message]').should('exist');
    });

    it('should display error message for billingAddressForm postcode input ', () => {
      cy.get('[data-cy=billing-address-postcode-input]').type('1234');
      cy.get('[data-cy=billing-address-postcode-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=billing-address-postcode-input]').type('1');
      cy.get('[data-cy=billing-address-postcode-error-message]').should(
        'exist'
      );
      cy.get('[data-cy=billing-address-postcode-input]').clear();
      cy.get('[data-cy=billing-address-postcode-input]').type('four');
      cy.get('[data-cy=billing-address-postcode-error-message]').should(
        'exist'
      );
    });
  });

  describe('checkoutForm', () => {
    it('should display error message for checkoutForm name input', () => {
      cy.get('[data-cy=checkout-form-name-input]').clear();
      cy.get('[data-cy=checkout-form-name-input]').type('test');
      cy.get('[data-cy=checkout-form-name-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-name-input]').type('123');
      cy.get('[data-cy=checkout-form-name-error-message]').should('exist');
    });

    it('should display error message for checkoutForm phone number input', () => {
      cy.get('[data-cy=checkout-form-phone-number-input]').clear();
      cy.get('[data-cy=checkout-form-phone-number-input]').type('12345678');
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-phone-number-input]').clear();
      cy.get('[data-cy=checkout-form-phone-number-input]').type(
        '+4512345678'
      );
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-phone-number-input]').type('1');
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'exist'
      );
      cy.get('[data-cy=checkout-form-phone-number-input]').clear();
      cy.get('[data-cy=checkout-form-phone-number-input]').type(
        '+4512oneTwo'
      );
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'exist'
      );
    });

    it('should display error message for checkoutForm street address input', () => {
      cy.get('[data-cy=checkout-form-street-address-input]').clear();
      cy.get('[data-cy=checkout-form-street-address-input]').type('test');
      cy.get('[data-cy=checkout-form-street-address-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-street-address-input]').type(
        '123134112341234123412341234 1234 1234 1234 123 41234 123 41234 123 41234 1234 '
      );
      cy.get('[data-cy=checkout-form-street-address-error-message]').should(
        'exist'
      );
    });

    it('should display error message for checkoutForm street address 2 input', () => {
      cy.get('[data-cy=checkout-form-street-address-2-input]').clear();
      cy.get('[data-cy=checkout-form-street-address-2-input]').type('test');
      cy.get('[data-cy=checkout-form-street-address-2-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-street-address-2-input]').type(
        '123134112341234123412341234 1234 1234 1234 123 41234 123 41234 123 41234 1234 '
      );
      cy.get('[data-cy=checkout-form-street-address-2-error-message]').should(
        'exist'
      );
    });

    it('should display error message for checkoutForm city input ', () => {
      cy.get('[data-cy=checkout-form-city-input]').clear();
      cy.get('[data-cy=checkout-form-city-input]').type('CityName');
      cy.get('[data-cy=checkout-form-city-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-city-input]').type('123');
      cy.get('[data-cy=checkout-form-city-error-message]').should('exist');
    });

    it('should display error message for checkoutForm postcode input ', () => {
      cy.get('[data-cy=checkout-form-postcode-input]').clear();
      cy.get('[data-cy=checkout-form-postcode-input]').type('1234');
      cy.get('[data-cy=checkout-form-postcode-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-postcode-input]').type('1');
      cy.get('[data-cy=checkout-form-postcode-error-message]').should(
        'exist'
      );
      cy.get('[data-cy=checkout-form-postcode-input]').clear();
      cy.get('[data-cy=checkout-form-postcode-input]').type('four');
      cy.get('[data-cy=checkout-form-postcode-error-message]').should(
        'exist'
      );
    });
  });
});
