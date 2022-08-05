import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
describe('admin-page', () => {
  beforeEach(() => cy.visit('/'));

  describe('layout', () => {
    // ___ Layout Structure ___
    describe('layout_structure', () => {
      it('should contain a navbar', () => {
        cy.get('[data-cy=admin-navbar]').should('exist');
      });

      it('should contain a body container', () => {
        cy.get('[data-cy=body-container]').should('exist');
      });

      it('should contain a sidebar', () => {
        cy.get('[data-cy=sidebar]').should('exist');
      });

      it('should contain a content', () => {
        cy.get('[data-cy=content]').should('exist');
      });
    });

    // ___ Navbar ___
    describe('navbar', () => {
      it('should contain a title, "Account", and "Logout" buttons', () => {
        localStorage.setItem(
          LocalStorageVars.authUser,
          JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin))
        );
        cy.visit('/dashboard');
        cy.get('[data-cy=admin-navbar]').should('not.contain.text', 'TC Management');
        cy.get('[data-cy=admin-navbar]').contains('Account').should('exist');
        cy.get('[data-cy=navbar-account-btn]').should('exist');
        cy.get('[data-cy=admin-navbar]').contains('Logout').should('exist');
        cy.get('[data-cy=navbar-logout-btn]').should('exist');
      });
    });

    // ___ Sidebar ___
    describe('sidebar', () => {
      beforeEach(() => {
        localStorage.setItem(
          LocalStorageVars.authUser,
          JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin))
        );
        cy.visit('/dashboard');
      });

      it('account icon in sidebar should redirect to account page', () => {
        cy.get('[data-cy=sidebar-user-icon]').click();
        cy.url().should('contain', 'account');
      });

      it('account btn in navbar should redirect to account page', () => {
        cy.get('[data-cy=navbar-account-btn]').click();
        cy.url().should('contain', 'account');
      });

      it('should contain a header', () => {
        cy.get('[data-cy=sidebar-header]').should('exist');
      });

      it('should contain an icon button, a title, and username', () => {
        cy.get('[data-cy=sidebar-user-icon]').should('be.visible');
        cy.get('[data-cy=sidebar-header]').contains('Admin').should('exist');
        cy.get('[data-cy=sidebar-username]').should('exist');
      });

      it('should contain a divider', () => {
        cy.get('[data-cy=sidebar-divider]').should('exist');
      });

      it('should contain an item list', () => {
        cy.get('[data-cy=sidebar-items]').should('exist');
      });

      it('should contain a dashboard item', () => {
        cy.get('[data-cy=sidebar-dashboard-btn]').should('exist');
        cy.get('[data-cy=sidebar-dashboard-btn]').contains('Dashboard').should('exist');
        cy.get('[data-cy=sidebar-dashboard-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain an orders item', () => {
        cy.get('[data-cy=sidebar-orders-btn]').should('exist');
        cy.get('[data-cy=sidebar-orders-btn]').contains('Orders').should('exist');
        cy.get('[data-cy=sidebar-orders-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a users item', () => {
        cy.get('[data-cy=sidebar-users-btn]').should('exist');
        cy.get('[data-cy=sidebar-users-btn]').contains('Users').should('exist');
        cy.get('[data-cy=sidebar-users-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a discounts item', () => {
        cy.get('[data-cy=sidebar-discounts-btn]').should('exist');
        cy.get('[data-cy=sidebar-discounts-btn]').contains('Discounts').should('exist');
        cy.get('[data-cy=sidebar-discounts-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain an event-log item', () => {
        cy.get('[data-cy=sidebar-event-log-btn]').should('exist');
        cy.get('[data-cy=sidebar-event-log-btn]').contains('Event Log').should('exist');
        cy.get('[data-cy=sidebar-event-log-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain an error-log item', () => {
        cy.get('[data-cy=sidebar-errorlogs-btn]').should('exist');
        cy.get('[data-cy=sidebar-errorlogs-btn]').contains('Error Log').should('exist');
        cy.get('[data-cy=sidebar-errorlogs-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a newsletter item', () => {
        cy.get('[data-cy=sidebar-newsletter-btn]').should('exist');
        cy.get('[data-cy=sidebar-newsletter-btn]').contains('Newsletter').should('exist');
        cy.get('[data-cy=sidebar-newsletter-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapse button', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').should('exist');
      });
    });

    // ___ Sidebar Collapse ___
    describe('sidebar_colapse', () => {
      beforeEach(() => {
        localStorage.setItem(
          LocalStorageVars.authUser,
          JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleAdmin))
        );
        cy.visit('/dashboard');
      });

      it('should collapse the sidebar', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar]').should('exist');
        cy.get('[data-cy=sidebar]').should('have.css', 'width', '70px');
      });

      it('should only display header icon', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-header]').should('exist');
        cy.get('[data-cy=sidebar-user-icon]').should('be.visible');
        cy.get('[data-cy=sidebar-user-icon]').should('have.css', 'fontSize', '24px');
        cy.get('[data-cy=sidebar-role]').should('not.be.visible');
        cy.get('[data-cy=sidebar-username]').should('not.be.visible');
      });

      it('should not display divider', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-divider]').should('not.be.visible');
      });

      it('should contain a collapsed dashboard item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-dashboard-btn]').should('exist');
        cy.get('[data-cy=sidebar-dashboard-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-dashboard-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed orders item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-orders-btn]').should('exist');
        cy.get('[data-cy=sidebar-orders-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-orders-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed users item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-users-btn]').should('exist');
        cy.get('[data-cy=sidebar-users-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-users-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed discounts item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-discounts-btn]').should('exist');
        cy.get('[data-cy=sidebar-discounts-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-discounts-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed event-log item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-event-log-btn]').should('exist');
        cy.get('[data-cy=sidebar-event-log-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-event-log-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed error-log item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-errorlogs-btn]').should('exist');
        cy.get('[data-cy=sidebar-errorlogs-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-errorlogs-btn]').get('[data-cy=icon]').should('be.visible');
      });

      it('should contain a collapsed newsletter item', () => {
        cy.get('[data-cy=sidebar-collapse-btn]').click({ force: true });
        cy.get('[data-cy=sidebar-newsletter-btn]').should('exist');
        cy.get('[data-cy=sidebar-newsletter-btn]').get('[data-cy=item-desc').should('not.be.visible');
        cy.get('[data-cy=sidebar-newsletter-btn]').get('[data-cy=icon]').should('be.visible');
      });
    });
    // TODO - write e2e test for admin-page /event-log page
  });
});
