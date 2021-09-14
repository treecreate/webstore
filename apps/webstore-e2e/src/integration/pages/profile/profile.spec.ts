import { IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('ProfilePage', () => {
  const authMockService = new AuthenticationService();

  const mockUser: IUser = {
    userId: '1',
    email: 'e2e@test.com',
    roles: [UserRoles.user],
    isVerified: false,
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
    phoneNumber: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    country: '',
  };

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(
        authMockService.getMockUser(AuthUserEnum.authUserNotVerified)
      )
    );
    cy.intercept('POST', `/auth/signin`, {
      body: authMockService.getMockUser(AuthUserEnum.authUser),
      statusCode: 200,
    }).as('signinRequest');
    cy.visit('/login');
    cy.get('[data-cy=login-email-input]').type('e2e@test.com');
    cy.get('[data-cy=login-password-input]').type('abcDEF123');
    cy.get('[data-cy=login-btn]').click();
  });

  it('should update user', () => {
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    //Mock update user request
    cy.intercept('PUT', '/users', {
      body: updatedMockUser,
      statusCode: 200,
    });

    //Update values in form to mach the retrieved user

    cy.get('[data-cy=profile-email-input]');

    //Change values in form
    cy.get('[data-cy=profile-name-input]').type('firstName secondName');
    cy.get('[data-cy=profile-phone-number-input]').type('+4512345678');
    cy.get('[data-cy=profile-street-address-input]').type(
      'Yo mammas house 69, 3rd floor'
    );
    cy.get('[data-cy=profile-street-address-2-input]').type(
      'more details: suck it'
    );
    cy.get('[data-cy=profile-city-input]').type('Copenhagen');
    cy.get('[data-cy=profile-postcode-input]').type('1234');

    //Update user request
  });
});
