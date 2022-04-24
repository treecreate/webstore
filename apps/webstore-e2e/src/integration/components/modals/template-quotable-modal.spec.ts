import { LocalStorageVars, CookieStatus } from '@models';

describe('Template selection modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/products/quotable');
  });

  it('opens when clicking select a template', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
  });

  it('closes when clicking the x button', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
    cy.get('[data-cy=quotable-template-modal-x-btn]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('not.exist');
  });

  it('selects the correct template', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
    cy.get('[data-cy=template-select-btn]').first().click({ force: true });
    cy.get('[data-cy=save-button]').click({ force: true });
    cy.visit('/products/quotable');
    const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designQuotable));
    console.log(localStorageDesignAfter);

    cy.get('[data-cy=text]').should('contain', 'Det eneste bedre');
  });
});
