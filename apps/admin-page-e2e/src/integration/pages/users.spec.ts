import { LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

const mockUsers = [
  {
    userId: 'IllTakeYouSon',
    email: 'IllTakeYouSon@test.com',
    roles: [UserRoles.user, UserRoles.developer, UserRoles.admin],
    name: 'Teo the almigthy',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddyOG',
    email: 'PleaseTakeMeDaddyOG@test.com',
    roles: [UserRoles.user],
    name: 'cristian the huh hah',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddy1',
    email: 'PleaseTakeMeDaddy1@test.com',
    roles: [UserRoles.user],
    name: 'Alex MACAGNANA oooh nana',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
  {
    userId: 'PleaseTakeMeDaddy2',
    email: 'PleaseTakeMeDaddy2@CAliJanuwich.com',
    roles: [UserRoles.user],
    name: 'CAliJanuwich',
    phoneNumber: '69420420',
    streetAddress: 'Y u b like dis?',
    streetAddress2: 'plds stap',
    city: 'TestCity',
    postcode: '6996',
    country: 'Neverland',
  },
];

describe('Users page', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', 'localhost:5000/users', {
      body: mockUsers,
      statusCode: 200,
    }).as('fetchUsers');

    cy.visit('/users');
  });

  it('it should display the users in the list', () => {});
  it('it should display view orders email', () => {});
});
