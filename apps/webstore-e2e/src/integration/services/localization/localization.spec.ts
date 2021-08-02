describe('Localization', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('do be localized', () => {
    cy.get('[data-cy=icon]')
      .invoke('attr', 'alt')
      .should('contain', 'Language');
  });
});
