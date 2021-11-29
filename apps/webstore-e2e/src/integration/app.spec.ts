describe('webstore', () => {
  beforeEach(() => cy.visit('/'));

  it('have Treecreate as a title', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.title().should('contain', 'Treecreate');
  });
});
