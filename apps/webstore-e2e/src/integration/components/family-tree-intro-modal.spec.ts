import { LocalStorageVars, CookieStatus } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('introduction modal', () => {
  const authMockService = new AuthenticationService();
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
  });

  it('should display the intro modal when user not logged in', () => {
    cy.visit('/product');
    cy.get('[data-cy=family-tree-intro-modal]').should('exist');
  });

  it('should have img describing how to use the design', () => {
    cy.visit('/product');
    cy.get('[data-cy=intro-img-01]').should('exist');
  });

  it('should not display intro if user is logged in', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.visit('/product');
    cy.get('[data-cy=family-tree-intro-modal]').should('not.exist');
  });
});
