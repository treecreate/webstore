import { IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('accountPage', () => {
  const authMockService = new AuthenticationService();

  const mockUser: IUser = {
    userId: '1',
    email: 'e2e@test.com',
    roles: [UserRoles.user],
    isVerified: true,
    name: '',
    phoneNumber: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    country: '',
  };

  const updatedMockUser: IUser = {
    userId: '1',
    email: 'e2e@test.com',
    roles: [UserRoles.user],
    isVerified: false,
    name: '',
    phoneNumber: '+4512345678',
    streetAddress: 'Yo mammas house 69, 3rd floor',
    streetAddress2: 'more details: suck it',
    city: 'Copenhagen',
    postcode: '1234',
    country: '',
  };

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

    cy.visit('/profile');
  });

  it('should update user', () => {
    //Mock update user request
    cy.intercept('PUT', '/users', {
      body: updatedMockUser,
      statusCode: 200,
    }).as('updateUserRequest');

    //Update values in form to mach the retrieved user
    cy.get('[data-cy=account-email-input]');

    //Change values in form
    cy.get('[data-cy=account-phone-number-input]').type('+4512345678');
    cy.get('[data-cy=account-address-input]').type(
      'Yo mammas house 69, 3rd floor'
    );
    cy.get('[data-cy=account-address-2-input]').type('more details: suck it');
    cy.get('[data-cy=account-city-input]').type('Copenhagen');
    cy.get('[data-cy=account-postcode-input]').type('1234');

    //Update user request
    cy.get('[data-cy=account-update-button]').click();
  });

  it('should not update when no inputfields have been changed', () => {
    cy.get('[data-cy=account-update-button]').should('be.disabled');
  });

  it('should redirect to collection page', () => {
    cy.get('[data-cy=account-collection-button]').click();
    cy.url().should('contain', '/collection');
  });

  //TODO: check all input fields are correct / incorrect
  it('should see if inputs fields are disabled when wrong', () => {
    cy.get('[data-cy=account-phone-number-input]').type('+4512345678');
    cy.get('[data-cy=account-invalid-phone-number]').should('not.exist');
    cy.get('[data-cy=account-phone-number-input]').clear();
    cy.get('[data-cy=account-phone-number-input]').type('4512345');
    cy.get('[data-cy=account-invalid-phone-number]').should('exist');
    cy.get('[data-cy=account-phone-number-input]').type('+451234567t');
    cy.get('[data-cy=account-invalid-phone-number]').should('exist');

    cy.get('[data-cy=account-email-input]').clear();
    cy.get('[data-cy=account-email-input]').type('e2e@test.com');
    cy.get('[data-cy=account-invalid-email]').should('not.exist');
    cy.get('[data-cy=account-email-input]').clear();
    cy.get('[data-cy=account-email-input]').type('e2etest.com');
    cy.get('[data-cy=account-invalid-email]').should('exist');

    cy.get('[data-cy=account-address-input]').type('Yo mammas house 69, ');
    cy.get('[data-cy=account-invalid-address]').should('not.exist');
    cy.get('[data-cy=account-address-input]').type(
      'Yo mammas house 69, Yo mammas house 69, Yo mammas house 69, Yo mammas house 69, Yo mammas house 69, '
    );
    cy.get('[data-cy=account-invalid-address]').should('exist');

    cy.get('[data-cy=account-address-2-input]').type('more details: suck');
    cy.get('[data-cy=account-invalid-address-2]').should('not.exist');
    cy.get('[data-cy=account-address-2-input]').type(
      ', more details: suck it, more details: suck it, more details: suck it, more details: suck it, more details: suck me off'
    );
    cy.get('[data-cy=account-invalid-address-2]').should('exist');

    cy.get('[data-cy=account-city-input]').type('Copenhagen');
    cy.get('[data-cy=account-invalid-city]').should('not.exist');
    cy.get('[data-cy=account-city-input]').clear();
    cy.get('[data-cy=account-city-input]').type('C');
    cy.get('[data-cy=account-invalid-city]').should('exist');
    cy.get('[data-cy=account-city-input]').type('C2dinMor');

    cy.get('[data-cy=account-postcode-input]').type('1234');
    cy.get('[data-cy=account-invalid-postcode]').should('not.exist');
    cy.get('[data-cy=account-postcode-input]').type('1');
    cy.get('[data-cy=account-invalid-postcode]').should('exist');
    cy.get('[data-cy=account-postcode-input]').clear();
    cy.get('[data-cy=account-invalid-postcode]').should('not.exist');
    cy.get('[data-cy=account-postcode-input]').type('123');
    cy.get('[data-cy=account-invalid-postcode]').should('exist');

    cy.get('[data-cy=account-update-button]').should('be.disabled');
  });

  //TODO: Check that a verified user doesnt have the resend verification button
  it('should not show resend-verification-button with a verified user', () => {});
});
