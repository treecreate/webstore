import { CookieStatus, LocalStorageVars } from '@models';

describe('Template selection modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/products/family-tree');
  });

  it('shows up on first visit and not on second', () => {
    cy.get('[data-cy=family-tree-template-modal]').should('exist');
    cy.visit('/products/family-tree');
    cy.get('[data-cy=family-tree-template-modal]').should('not.exist');
  });

  it('selects the correct template', () => {
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.get('[data-cy=family-tree-template-button]').click({ force: true });
    cy.get('[data-cy=template-select-btn]').first().click({ force: true });
    cy.visit('/products/family-tree').then(() => {
      const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
      console.warn('After design: ', localStorageDesignAfter);
      cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 17);
    });
  });
});
