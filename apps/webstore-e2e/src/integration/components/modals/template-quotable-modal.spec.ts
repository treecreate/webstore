import { LocalStorageVars, CookieStatus } from '@models';

describe('Template selection modal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/products/quotable');
  });

  it('opens when clicking select a template', () => {
    cy.get('[data-cy=quotable-template-button]');
  });

  it('closes when clicking the x button', () => {});

  it('selects the correct template', () => {});
});
