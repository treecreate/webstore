describe('Localization', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('do be localized', () => {
    cy.get('[data-cy=cookie-prompt-modal-accept-cookies-btn]').click();

    cy.get('[data-cy=navbar-localization]').then(() => {
      cy.get('.language-icon').then(($icon) => {
        if ($icon.attr('data-cy') === 'dk') {
          cy.get('[data-cy=dk]');
          cy.get('[ng-reflect-ng-class=en]');
        } else {
          cy.get('[ng-reflect-ng-class=dk]');
        }
      });
    });
  });
});
