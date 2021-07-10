import { CookieStatus, LocalStorageVars } from '@models';
describe('ProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/product');
  });

  // box-size buttons
  it('should contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=footer]').should('exist');
  });

  it('should have a box-size of 10', () => {
    cy.get('[data-cy=box-size]').should('have.text', '10');
  });

  it('should increase box size when + is pressed in options', () => {
    cy.get('[data-cy=box-size]').should('have.text', '10');
    cy.get('[data-cy=box-size-plus]').click();
    cy.get('[data-cy=box-size]').should('have.text', '11');
  });

  it('should decrease box size when - is pressed in options', () => {
    cy.get('[data-cy=box-size]').should('have.text', '10');
    cy.get('[data-cy=box-size-minus]').click();
    cy.get('[data-cy=box-size]').should('have.text', '9');
  });

  it('should not increase box size above 30', () => {
    cy.get('[data-cy=box-size-plus]').should('not.be.disabled');
    for (let i = 0; i < 20; i++) {
      cy.get('[data-cy=box-size-plus]').click();
    }
    cy.get('[data-cy=box-size]')
      .invoke('text')
      .then(parseFloat)
      .should('not.be.above', 30);
    cy.get('[data-cy=box-size-plus]').should('be.disabled');
  });

  it('should not decrease box size below 0', () => {
    cy.get('[data-cy=box-size-minus]').should('not.be.disabled');
    for (let i = 0; i < 10; i++) {
      cy.get('[data-cy=box-size-minus]').click();
    }
    cy.get('[data-cy=box-size]')
      .invoke('text')
      .then(parseFloat)
      .should('not.be.lt', 0);
    cy.get('[data-cy=box-size-minus]').should('be.disabled');
  });

  // Font change
  it('should change the font', () => {
    cy.get('[data-cy=font]').should('have.text', 'Times new roman');
    cy.get('[data-cy=font-next-btn]').click();
    cy.get('[data-cy=font]').should('have.text', 'Roboto');
    cy.get('[data-cy=font-prev-btn]').click();
    cy.get('[data-cy=font-prev-btn]').click();
    cy.get('[data-cy=font]').should('have.text', 'Sansita');
  });

  // Banner
  it('should show/remove banner', () => {
    cy.get('[data-cy=banner]').should('have.text', 'false');
    cy.get('[data-cy=checkbox-banner]').click();
    cy.get('[data-cy=banner]').should('have.text', 'true');
    cy.get('[data-cy=checkbox-banner]').click();
    cy.get('[data-cy=banner]').should('have.text', 'false');
  });

  // Big font
  it('should show/remove big-font', () => {
    cy.get('[data-cy=big-font]').should('have.text', 'false');
    cy.get('[data-cy=checkbox-big-font]').click();
    cy.get('[data-cy=big-font]').should('have.text', 'true');
    cy.get('[data-cy=checkbox-big-font]').click();
    cy.get('[data-cy=big-font]').should('have.text', 'false');
  });
});
