import { LocalStorageVars, CookieStatus } from '@models';

describe('introduction modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
  });

  it('should display the intro modal when clicking on question button', () => {
    cy.visit('/product');
    cy.get('[data-cy=family-tree-intro-modal-option-button]').click();
    cy.get('[data-cy=family-tree-intro-modal]').should('exist');
  });

  it('should have img describing how to use the design', () => {
    cy.visit('/product');
    cy.get('[data-cy=family-tree-intro-modal-option-button]').click();
    cy.get('[data-cy=intro-img-01]').should('exist');
  });

  it('should close modal when clicking the close button', () => {
    cy.visit('/product');
    cy.get('[data-cy=family-tree-intro-modal-option-button]').click();
    cy.get('[data-cy=intro-img-01]').should('exist');
    cy.get('[data-cy=family-tree-intro-close-button]').click();
    cy.get('[data-cy=intro-img-01]').should('not.exist');
  });
});
