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
    name: 'teodor jonasson',
    phoneNumber: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    country: '',
  };

  const updatedMockUser: IUser = {
    userId: '1',
    email: 'suckmeoff@test.com',
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

  const mockUserNewPassword = {
    password: 'abcDEF123',
  };

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
  });

  it('should update user', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');

    //Update values in form to mach the retrieved user
    cy.get('[data-cy=account-email-input]');

    //Change values in form
    cy.get('[data-cy=account-phone-number-input]').type('+4512345678');
    cy.get('[data-cy=account-address-input]').type('Yo mammas house 69, 3rd floor');
    cy.get('[data-cy=account-address-2-input]').type('more details: suck it');
    cy.get('[data-cy=account-city-input]').type('Copenhagen');
    cy.get('[data-cy=account-postcode-input]').type('1234');

    //Update user request
    cy.get('[data-cy=account-update-button]').click();
  });

  it('should open change password modal', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');

    cy.get('[data-cy=account-change-password-button]').click();
    cy.get('[data-cy=change-password-modal]').should('exist');
  });

  it('should update password', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.intercept('PUT', '/users', {
      body: mockUserNewPassword,
      statusCode: 200,
    }).as('updatePasswordRequest');

    cy.visit('/profile');

    cy.get('[data-cy=account-change-password-button]').click();
    cy.get('[data-cy=change-password-modal]').should('exist');

    cy.get('[data-cy=update-password-btn]').should('be.disabled');

    cy.get('[data-cy=change-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=change-password-confirm-password-input]').type('abcDEF123');

    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    cy.get('[data-cy=update-password-btn]').click();

    cy.get('[data-cy=change-password-modal]').should('not.exist');
    cy.url().should('contain', '/home');
  });

  it('should not be able to update password with non matching password', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.intercept('PUT', '/users', {
      body: mockUserNewPassword,
      statusCode: 200,
    }).as('updatePasswordRequest');

    cy.visit('/profile');

    cy.get('[data-cy=account-change-password-button]').click();
    cy.get('[data-cy=change-password-modal]').should('exist');

    cy.get('[data-cy=update-password-btn]').should('be.disabled');

    cy.get('[data-cy=change-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=change-password-confirm-password-input]').type('abcDEF321');

    cy.get('[data-cy=change-password-not-matching-message]').should('contain', 'Passwords must match');
    cy.get('[data-cy=update-password-btn]').should('be.disabled');

    cy.get('[data-cy=change-password-confirm-password-input]').clear();
    cy.get('[data-cy=change-password-confirm-password-input]').type('abcDEF123');

    cy.get('[data-cy=change-password-not-matching-message]').should('not.exist');
  });

  it('should detect that the access token is expired and log the user out after change password', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');

    cy.intercept('PUT', '/users', {
      body: mockUserNewPassword,
      statusCode: 200,
    }).as('updatePasswordRequest');

    cy.get('[data-cy=account-change-password-button]').click();

    cy.get('[data-cy=change-password-password-input]').type('abcDEF123');
    cy.get('[data-cy=change-password-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=update-password-btn]').click();

    cy.visit('/login');
    cy.url().should('contain', '/login');

    cy.get('[data-cy=navbar]').contains('Log in').should('exist');
    cy.get('[data-cy=navbar]').contains('Profile').should('not.exist');
  });

  it('should not update when no inputfields have been changed', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');
    cy.get('[data-cy=account-update-button]').should('be.disabled');
  });

  it('should see if inputs fields are disabled when wrong', () => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    //Mock return user request
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');

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
  });

  it('should not show resend-verification-button with a verified user', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserNotVerified))
    );

    //Mock return not verified user request
    cy.intercept('GET', '/users/me', {
      body: updatedMockUser,
      statusCode: 200,
    }).as('getUserRequest');

    cy.visit('/profile');

    cy.get('[data-cy=resend-verification-email-button]').should('exist');
  });
});
