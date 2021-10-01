import { IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockUser: IUser = {
  userId: '1',
  email: 'e2e@test.com',
  roles: [UserRoles.user],
  isVerified: true,
  name: 'teodor jonasson',
  phoneNumber: '',
  streetAddress: '',
  streetAddress2: '',
  city: '',
  postcode: '',
  country: '',
};
describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');
    //TODO: add user auth when implemented in checkout page
    cy.visit('/checkout');
  });

  it.skip('should not contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('not.exist');
    cy.get('[data-cy=footer]').should('not.exist');
  });

  it.skip('should have billing address be the same as delivery address be true', () => {
    cy.get('[data-cy=billing-address-is-the-same-checkbox]').should(
      'be.checked'
    );
  });

  it.skip('should not show billing address form', () => {
    cy.get('[data-cy=billing-address-form]').should('not.exist');
  });

  it.skip('should display billing address form when diabling billing and shipping address being the same', () => {
    cy.get('[data-cy=billing-address-is-the-same-button]').click();
    cy.get('[data-cy=billing-address-form]').should('exist');
  });

  it.skip('should have delivery be set to parcelshop delivery', () => {
    cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should('be.checked');
    cy.get('[data-cy=checkout-form-home-delivery-checkbox]').should(
      'not.be.checked'
    );
  });

  it.skip('should change to home delivery', () => {
    cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should('be.checked');
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

  it.skip('should not show option to subscribe if user is already subscribed', () => {
    cy.intercept('GET', '/newsletter/me', {
      statusCode: 200,
    });
    cy.visit('/checkout');
    cy.get('[data-cy=checkout-form-subscribe-option]').should('not.exist');
  });

  it.skip('should display subscribe option when user isnt subscribed', () => {
    cy.intercept('GET', '/newsletter/me', {
      statusCode: 404,
    });
    cy.visit('/checkout');
    cy.get('[data-cy=checkout-form-subscribe-option]').should('exist');
  });

  describe.skip('billingAddressForm', () => {
    it('should display error message for billingAddressForm name input', () => {});

    it('should display error message for billingAddressForm street address input', () => {});

    it('should display error message for billingAddressForm street address 2 input', () => {});

    it('should display error message for billingAddressForm city input ', () => {});

    it('should display error message for billingAddressForm postcode input ', () => {});
  });

  describe.skip('checkoutForm', () => {
    it('should update form values automatically', () => {});

    it('should display error message for chekcoutForm name input', () => {});

    it('should display error message for chekcoutForm phone number input', () => {});

    it('email input should be disabled', () => {});

    it('should display error message for chekcoutForm street address input', () => {});

    it('should display error message for chekcoutForm street address 2 input', () => {});

    it('should display error message for chekcoutForm city input ', () => {});

    it('should display error message for chekcoutForm postcode input ', () => {});
  });
});
