import { CookieStatus, LocalStorageVars } from '@models';
describe('ProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/product');
  });

  it('should contain a navbar and footer', () => {
    cy.get('[data-cy=navbar]').should('exist');
    cy.get('[data-cy=footer]').should('exist');
  });

  it('should have a boxsize of 10', () => {
    cy.get('[data-cy=boxSize]').should('have.text', '10')
  })

  it('should increase box size when + is pressed in options', () => {
    cy.get('[data-cy=boxSize]').should('have.text', '10')
    cy.get('[data-cy=box-size-plus]').click()
    cy.get('[data-cy=boxSize]').should('have.text', '11')
  })

  it('should decrease box size when - is pressed in options', () => {
    cy.get('[data-cy=boxSize]').should('have.text', '10')
    cy.get('[data-cy=box-size-minus]').click()
    cy.get('[data-cy=boxSize]').should('have.text', '9')
  })

  it('should not increase above 30', () => {
    cy.get('[data-cy=box-size-plus]').should('not.be.disabled');
    for (let i = 0; i < 20; i++){
      cy.get('[data-cy=box-size-plus]').click();
    }
    cy.get('[data-cy=boxSize]').invoke('text').then(parseFloat).should('be.lt', 31);
    cy.get('[data-cy=box-size-plus]').should('be.disabled');
  })
});
