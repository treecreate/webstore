import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTreeBanner,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
//import { AuthenticationService } from '@webstore/mocks';

//const authMockService = new AuthenticationService();
const mockUser: IUser = {
  userId: '1',
  email: 'e2e@test.com',
  roles: [UserRoles.user],
  name: 'teodor jonasson',
  phoneNumber: '26192327',
  streetAddress: 'hillerødgade 69,  3 etage',
  streetAddress2: 'whackado',
  city: 'Århus',
  postcode: '1234',
  country: 'DenDenDen Wait, country? :o',
};
const mockDraggableBoxOne: IDraggableBox = {
  x: 400,
  y: 400,
  previousX: 0,
  previousY: 0,
  dragging: false,
  boxDesign: BoxDesignEnum.box1,
  text: 'teo',
};
const mockDraggableBoxTwo: IDraggableBox = {
  x: 200,
  y: 200,
  previousX: 100,
  previousY: 100,
  dragging: false,
  boxDesign: BoxDesignEnum.box2,
  text: 'dor',
};
const mockBanner: IFamilyTreeBanner = {
  text: 'my tree 1',
  style: 'first',
};
const mockDesign: IDesign = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  designProperties: {
    title: 'title1',
    font: FamilyTreeFontEnum.roboto,
    backgroundTreeDesign: TreeDesignEnum.tree1,
    boxSize: 20,
    banner: mockBanner,
    largeFont: false,
    boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
  },
  designType: DesignTypeEnum.familyTree,
  user: mockUser,
  mutable: true,
};
const mockTransactionItem: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
  design: mockDesign,
};

/* TODO: Add missing tests to checkout
 * - should have correct items in transaction when logged in (depends on data)
 * - should have correct items in transaction when getting it from localstorage (depends on data)
 * - should have correct pricing (depends on the data)
 * - should send the right request when going to payment and possibly others (@Kwandes)
 */

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
  });
  describe('general page functionality', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.transactionItems,
        JSON.stringify([mockTransactionItem])
      );
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
      cy.get('[data-cy=billing-address-form]').should('not.exist');
    });

    it.skip('should display billing address form when disabling billing and shipping address being the same', () => {
      cy.get('[data-cy=billing-address-is-the-same-button]').click();
      cy.get('[data-cy=billing-address-form]').should('exist');
    });

    it.skip('should have delivery be set to parcelshop delivery', () => {
      cy.get('[data-cy=checkout-form-parcelshop-checkbox]').should(
        'be.checked'
      );
      cy.get('[data-cy=checkout-form-home-delivery-checkbox]').should(
        'not.be.checked'
      );
    });

    it.skip('should change to home delivery', () => {
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

    it('should have go to payment button disabled with wrong input in checkout form', () => {
      cy.get('[data-cy=checkout-form-name-input]').type('test');
      cy.get('[data-cy=checkout-form-email-input]').type('test@urMom.com');
      cy.get('[data-cy=checkout-form-street-address-input]').type('test');
      cy.get('[data-cy=checkout-form-city-input]').type('CityName');
      cy.get('[data-cy=checkout-form-postcode-input]').type('1234');
      cy.get('[data-cy=checkout-form-terms-button]').click();
      cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
        'not.be.disabled'
      );
      cy.get('[data-cy=checkout-form-postcode-input]').type('1');
      cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
        'be.disabled'
      );
      cy.get('[data-cy=checkout-form-postcode-input]').clear();
      cy.get('[data-cy=checkout-form-postcode-input]').type('1234');
      cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
        'not.be.disabled'
      );
      cy.get('[data-cy=checkout-form-city-input]').type('12!');
      cy.get('[data-cy=checkout-form-go-to-payment-button]').should(
        'be.disabled'
      );
    });
  });

  describe('logged in user functionality', () => {
    beforeEach(() => {
      cy.intercept('GET', '/transaction-items/me', {
        body: [mockTransactionItem],
        statusCode: 200,
      });
      cy.intercept('GET', '/users/me', {
        body: mockUser,
        statusCode: 200,
      }).as('getUserRequest');
    });

    // TODO: add tests here
  });

  describe.skip('not a user functionality tests', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.transactionItems,
        JSON.stringify([mockTransactionItem])
      );
      cy.visit('/checkout');
      cy.get('[data-cy=checkout-form-name-input]').type('test');
      cy.get('[data-cy=checkout-form-email-input]').type('test@urMom.com');
      cy.get('[data-cy=checkout-form-street-address-input]').type('test');
      cy.get('[data-cy=checkout-form-city-input]').type('CityName');
      cy.get('[data-cy=checkout-form-postcode-input]').type('1234');
    });
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
  });

  describe.skip('billingAddressForm', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.transactionItems,
        JSON.stringify([mockTransactionItem])
      );
      cy.visit('/checkout');
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
      cy.get('[data-cy=billing-address-street-address-2-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=billing-address-street-address-2-input]').type(
        '123134112341234123412341234 1234 1234 1234 123 41234 123 41234 123 41234 1234 '
      );
      cy.get('[data-cy=billing-address-street-address-2-error-message]').should(
        'exist'
      );
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

  describe.skip('checkoutForm', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.transactionItems,
        JSON.stringify([mockTransactionItem])
      );
      cy.visit('/checkout');
    });
    it('should display error message for checkoutForm name input', () => {
      cy.get('[data-cy=checkout-form-name-input]').clear();
      cy.get('[data-cy=checkout-form-name-input]').type('test');
      cy.get('[data-cy=checkout-form-name-error-message]').should('not.exist');
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
      cy.get('[data-cy=checkout-form-phone-number-input]').type('+4512345678');
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'not.exist'
      );
      cy.get('[data-cy=checkout-form-phone-number-input]').type('1');
      cy.get('[data-cy=checkout-form-phone-number-error-message]').should(
        'exist'
      );
      cy.get('[data-cy=checkout-form-phone-number-input]').clear();
      cy.get('[data-cy=checkout-form-phone-number-input]').type('+4512oneTwo');
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
      cy.get('[data-cy=checkout-form-city-error-message]').should('not.exist');
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
      cy.get('[data-cy=checkout-form-postcode-error-message]').should('exist');
      cy.get('[data-cy=checkout-form-postcode-input]').clear();
      cy.get('[data-cy=checkout-form-postcode-input]').type('four');
      cy.get('[data-cy=checkout-form-postcode-error-message]').should('exist');
    });
  });
});
