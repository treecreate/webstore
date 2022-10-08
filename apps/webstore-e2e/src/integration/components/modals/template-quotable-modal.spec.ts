import { LocalStorageVars, CookieStatus } from '@models';

describe('Template selection modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/products/quotable');
  });

  it.skip('opens when clicking select a template', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
  });

  it.skip('closes when clicking the x button', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
    cy.get('[data-cy=quotable-template-modal-x-btn]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('not.exist');
  });

  it('selects the quotable correct template', () => {
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=quotable-template-modal]').should('exist');
    cy.get('[data-cy=template-select-btn]').first().click({ force: true });

    cy.get('[data-cy=text]').should('contain', 'Det eneste bedre');
    cy.get('[data-cy=font-size]').should('contain', '40');
    cy.get('[data-cy=title-input-field]').should('not.exist');
    cy.get('[data-cy=show-text]').should('contain', 'true');
    cy.get('[data-cy=show-title]').should('contain', 'false');
    cy.get('[data-cy=vertical-placement]').should('contain', '35');
  });

  it('shows the correct baby sign templates', () => {
    cy.visit('/products/quotable?productType=BABY_SIGN');
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=template-select-btn]').first().click({ force: true });

    cy.get('[data-cy=title]').should('contain', 'Fulde navn');
    cy.get('[data-cy=text]').should('contain', '01.01.2022');
    cy.get('[data-cy=font-size]').should('contain', '30');
    cy.get('[data-cy=show-text]').should('contain', 'true');
    cy.get('[data-cy=show-title]').should('contain', 'true');
    cy.get('[data-cy=vertical-placement]').should('contain', '81');
  });

  it('shows the correct love letter templates', () => {
    cy.visit('/products/quotable?productType=LOVE_LETTER');
    cy.get('[data-cy=quotable-template-button]').click({ force: true });
    cy.get('[data-cy=template-select-btn]').first().click({ force: true });

    cy.get('[data-cy=title]').should('contain', 'Fulde navn');
    cy.get('[data-cy=text]').should('contain', 'Jeg skrev dit navn i skyerne');
    cy.get('[data-cy=font-size]').should('contain', '26');
    cy.get('[data-cy=show-text]').should('contain', 'true');
    cy.get('[data-cy=show-title]').should('contain', 'true');
    cy.get('[data-cy=vertical-placement]').should('contain', '50');
  });
});
