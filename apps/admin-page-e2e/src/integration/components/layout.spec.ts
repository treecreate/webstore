describe('LayoutComponent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // ___ Layout Structure ___
  it('should contain a navbar', () => {
    cy.get('[data-cy=navbar]').should('exist');
  });

  it('should contain a body', () => {
    cy.get('[data-cy=body]').should('exist');
  });

  it('should contain a sidebar', () => {
    cy.get('[data-cy=sidebar]').should('exist');
  });

  it('should contain a content', () => {
    cy.get('[data-cy=content]').should('exist');
  });
  // ___ End Layout Structure ___

  // ___ Navbar ___
  it('should contain a title, "Account", and "Logout" buttons', () => {
    cy.get('[data-cy=navbar]').contains('TC Management').should('exist');
    cy.get('[data-cy=navbar]').contains('Account').should('exist');
    cy.get('[data-cy=navbar]').contains('Logout').should('exist');
  });

  it('should navigate to account page', () => {
    cy.get('[data-cy=navbar-account-btn]').click({ force: true });
    cy.url().should('contain', '/account');
    cy.get('[data-cy=content]').contains('account').should('exist');
  });

  it('should navigate to logout', () => {
    cy.get('[data-cy=navbar-logout-btn]').click({ force: true });
    cy.url().should('contain', '/logout');
    cy.get('[data-cy=content]').contains('logout').should('exist');
  });
  // ___ End Navbar ___

  // ___ Sidebar ___
  it('should contain a header', () => {
    cy.get('[data-cy=sidebar-header]').should('exist');
  });

  it('should contain an icon button, a title, and username', () => {
    cy.get('[data-cy=sidebar-account-btn]').should('exist');
    cy.get('[data-cy=sidebar-user-icon]').should('be.visible');
    cy.get('[data-cy=sidebar-header]').contains('Admin').should('exist');
    cy.get('[data-cy=sidebar-username]').should('exist');
  });

  it('should navigate to account page', () => {
    cy.get('[data-cy=sidebar-account-btn]').click({ force: true });
    cy.url().should('contain', '/account');
    cy.get('[data-cy=content]').contains('account').should('exist');
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
    cy.get('[data-cy=sidebar-dashboard-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to dashboard page', () => {
    cy.get('[data-cy=sidebar-dashboard-btn]').click({ force: true });
    cy.url().should('contain', '/dashboard');
    cy.get('[data-cy=content]').contains('dashboard').should('exist');
  });

  it('should contain an orders item', () => {
    cy.get('[data-cy=sidebar-orders-btn]').should('exist');
    cy.get('[data-cy=sidebar-orders-btn]').contains('Orders').should('exist');
    cy.get('[data-cy=sidebar-orders-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to orders page', () => {
    cy.get('[data-cy=sidebar-orders-btn]').click({ force: true });
    cy.url().should('contain', '/orders');
    cy.get('[data-cy=content]').contains('orders').should('exist');
  });

  it('should contain a customers item', () => {
    cy.get('[data-cy=sidebar-customers-btn]').should('exist');
    cy.get('[data-cy=sidebar-customers-btn]').contains('Customers').should('exist');
    cy.get('[data-cy=sidebar-customers-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to customers page', () => {
    cy.get('[data-cy=sidebar-customers-btn]').click({ force: true });
    cy.url().should('contain', '/customers');
    cy.get('[data-cy=content]').contains('customers').should('exist');
  });

  it('should contain a discounts item', () => {
    cy.get('[data-cy=sidebar-discounts-btn]').should('exist');
    cy.get('[data-cy=sidebar-discounts-btn]').contains('Discounts').should('exist');
    cy.get('[data-cy=sidebar-discounts-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to discounts page', () => {
    cy.get('[data-cy=sidebar-discounts-btn]').click({ force: true });
    cy.url().should('contain', '/discounts');
    cy.get('[data-cy=content]').contains('discounts').should('exist');
  });

  it('should contain an activity-log item', () => {
    cy.get('[data-cy=sidebar-activity-log-btn]').should('exist');
    cy.get('[data-cy=sidebar-activity-log-btn]').contains('Activity Log').should('exist');
    cy.get('[data-cy=sidebar-activity-log-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to activity-log page', () => {
    cy.get('[data-cy=sidebar-activity-log-btn]').click({ force: true });
    cy.url().should('contain', '/activity-log');
    cy.get('[data-cy=content]').contains('activity-log').should('exist');
  });

  it('should contain a newsletter item', () => {
    cy.get('[data-cy=sidebar-newsletter-btn]').should('exist');
    cy.get('[data-cy=sidebar-newsletter-btn]').contains('Newsletter').should('exist');
    cy.get('[data-cy=sidebar-newsletter-btn]').get('[data-cy=icon').should('be.visible');
  });

  it('should navigate to newsletter page', () => {
    cy.get('[data-cy=sidebar-newsletter-btn]').click({ force: true });
    cy.url().should('contain', '/newsletter');
    cy.get('[data-cy=content]').contains('newsletter').should('exist');
  });
  // ___ End Sidebar ___
});
