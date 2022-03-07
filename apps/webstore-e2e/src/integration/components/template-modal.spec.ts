import { LocalStorageVars, CookieStatus } from '@models';

describe('Template selection modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/product');
  });

  it('shows up on first visit and not on second', () => {
    cy.get('[data-cy=template-container]').should('exist');
    cy.visit('/product');
    cy.get('[data-cy=template-container]').should('not.exist');
  });

  it('closes when clicking cancel', () => {
    cy.get('[data-cy=template-container]').should('exist');
    cy.get('[data-cy=family-tree-template-close-button]').click();
    cy.get('[data-cy=template-container]').should('not.exist');
  });

  it('opens when clicking template button', () => {
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.get('[data-cy=template-container]').should('not.exist');
    cy.get('[data-cy=family-tree-template-button]').click();
    cy.get('[data-cy=template-container]').should('exist');
  });

  it('selects the correct template', () => {
    cy.get('[data-cy=template-select-btn]').first().click();
    cy.visit('/product').then(() => {
      const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
      console.warn('After design: ', localStorageDesignAfter);
      cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 17);
    });
  });
});
