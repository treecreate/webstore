import { IUser } from '@interfaces';
import { LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const mockAdminUser: IUser = {
  userId: 'PleaseTakeMe',
  email: 'e2e@test.com',
  roles: [
    { name: UserRoles.user, roleId: '' },
    { name: UserRoles.developer, roleId: '' },
    { name: UserRoles.admin, roleId: '' },
  ],
  name: 'telinior the great',
  phoneNumber: '69420420',
  streetAddress: 'Y u b like dis?',
  streetAddress2: 'plds stap',
  city: 'TestCity',
  postcode: '6996',
  country: 'Neverland',
};

const authMockService = new AuthenticationService();

describe('Account page for admin user', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/users/me', {
      body: mockAdminUser,
      statusCode: 200,
    });
    cy.visit('/account');
  });

  it('should display the information correctly', () => {
    cy.get('[data-cy=account-email-input]').should('have.value', 'e2e@test.com');
    cy.get('[data-cy=account-name-input]').should('have.value', 'telinior the great');
    cy.get('[data-cy=account-city-input]').should('have.value', 'TestCity');
    cy.get('[data-cy=account-postcode-input]').should('have.value', '6996');
    cy.get('[data-cy=account-phone-number-input]').should('have.value', '69420420');
    cy.get('[data-cy=account-address-input]').should('have.value', 'Y u b like dis?');
    cy.get('[data-cy=account-address-2-input]').should('have.value', 'plds stap');
  });

  it('should update the user correctly', () => {
    cy.intercept('PUT', `/users/${mockAdminUser.userId}`, {
      statusCode: 200,
    });
    cy.get('[data-cy=account-email-input]').clear().type('slap@me.daddy');
    cy.get('[data-cy=account-name-input]').clear().type('slap daddy');
    cy.get('[data-cy=account-city-input]').clear().type('slapCity');
    cy.get('[data-cy=account-postcode-input]').clear().type('0420');
    cy.get('[data-cy=account-phone-number-input]').clear().type('69696969');
    cy.get('[data-cy=account-address-input]').clear().type('slap street avenue 69');
    cy.get('[data-cy=account-address-2-input]').clear().type('420th of course');

    cy.get('[data-cy=update-account-btn]').click();
  });

  it('should fail to update user', () => {
    cy.intercept('PUT', `/users/${mockAdminUser.userId}`, {
      statusCode: 404,
    });
    cy.get('[data-cy=account-name-input]').clear().type('slap@me.daddy');
    cy.get('[data-cy=update-account-btn]').click();
    cy.visit('/dashboard');
    cy.visit('/account');
    cy.get('[data-cy=account-email-input]').should('not.have.value', 'slap@me.daddy');
    cy.get('[data-cy=account-email-input]').should('have.value', 'e2e@test.com');
  });

  it('should log user out when changing email', () => {
    cy.intercept('PUT', `/users/${mockAdminUser.userId}`, {
      statusCode: 200,
    });
    cy.get('[data-cy=account-email-input]').clear().type('slap@me.daddy');
    cy.get('[data-cy=update-account-btn]').click();
    cy.url().should('contain', '/login');
  });

  it('should show the correct roles', () => {
    cy.get('[data-cy=is-user]').should('exist');
    cy.get('[data-cy=is-developer]').should('exist');
    cy.get('[data-cy=is-admin]').should('exist');
    cy.get('[data-cy=is-operation]').should('not.exist');
  });
});

describe('change password dialog', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/users/me', {
      body: mockAdminUser,
      statusCode: 200,
    });
    cy.visit('/account');
    cy.get('[data-cy=change-password-btn]').click();
  });

  it('should display the change password dialog properly', () => {
    cy.get('[data-cy=change-password-dialog]').should('exist');
  });

  it('should have update btn be disabled when password is not good enough', () => {
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    // Check uppercase
    cy.get('[data-cy=change-password-input]').type('abcdef123');
    cy.get('[data-cy=change-confirm-password-input]').type('abcdef123');
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').clear().type('abcDEF123');
    cy.get('[data-cy=change-confirm-password-input]').clear().type('abcDEF123');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    // Check lowercase
    cy.get('[data-cy=change-password-input]').clear().type('ABCDEF123');
    cy.get('[data-cy=change-confirm-password-input]').clear().type('ABCDEF123');
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').clear().type('abcDEF123');
    cy.get('[data-cy=change-confirm-password-input]').clear().type('abcDEF123');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    // Check number
    cy.get('[data-cy=change-password-input]').clear().type('ABCdefabc');
    cy.get('[data-cy=change-confirm-password-input]').clear().type('ABCdefabc');
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').type('123');
    cy.get('[data-cy=change-confirm-password-input]').type('123');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    // Check length
    cy.get('[data-cy=change-password-input]').clear().type('abcDEF1');
    cy.get('[data-cy=change-confirm-password-input]').clear().type('abcDEF1');
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').type('23!');
    cy.get('[data-cy=change-confirm-password-input]').type('23!');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
  });

  it('should update password', () => {
    cy.intercept('PUT', `/users/${mockAdminUser.userId}`, {
      statusCode: 200,
    });
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').type('abcDEF123');
    cy.get('[data-cy=change-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    cy.get('[data-cy=update-password-btn]').click();
    cy.get('[data-cy=change-password-dialog]').should('not.exist');
  });

  it('should fail to update password', () => {
    cy.intercept('PUT', `/users/${mockAdminUser.userId}`, {
      statusCode: 404,
    });
    cy.get('[data-cy=update-password-btn]').should('be.disabled');
    cy.get('[data-cy=change-password-input]').type('abcDEF123');
    cy.get('[data-cy=change-confirm-password-input]').type('abcDEF123');
    cy.get('[data-cy=update-password-btn]').should('not.be.disabled');
    cy.get('[data-cy=update-password-btn]').click();
    cy.get('[data-cy=change-password-dialog]').should('exist');
  });

  it('should be able to close dialog', () => {
    cy.get('[data-cy=change-password-dialog]').should('exist');
    cy.get('[data-cy=change-password-cancel-btn]').click();
    cy.get('[data-cy=change-password-dialog]').should('not.exist');
  });
});
