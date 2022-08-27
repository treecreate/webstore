describe('Localization', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();
  });

  it('change localized to danish', () => {
    // activate dropdownmenu with languages
    cy.get('[data-cy=navbar-localization]').trigger('mouseenter');
    cy.get('[data-cy=navbar-localization-dk]').click();

    // check url to contain language
    cy.url().should('include', '/da');
  });

  it('change localized to english', () => {
    // activate dropdownmenu with languages
    cy.get('[data-cy=navbar-localization]').trigger('mouseenter');
    cy.get('[data-cy=navbar-localization-en]').click();

    // check url to contain language
    cy.url().should('include', '/en-US');
  });
});
