import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';
describe('ProductPage', () => {
  const authMockService = new AuthenticationService();

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
  });
  describe('Authenticated', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/product');
    });

    // box-size buttons
    it('should contain a navbar and footer', () => {
      cy.get('[data-cy=navbar]').should('exist');
      cy.get('[data-cy=footer]').should('exist');
    });

    it('should have a box-size of 20', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
    });

    it('should increase box size when + is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '21');
    });

    it('should decrease box size when - is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '19');
    });

    it('should not increase box size above 40', () => {
      cy.get('[data-cy=box-size-plus]').should('not.be.disabled');
      for (let i = 0; i < 20; i++) {
        cy.get('[data-cy=box-size-plus]').click();
      }
      cy.get('[data-cy=box-size]')
        .invoke('text')
        .then(parseFloat)
        .should('not.be.above', 40);
      cy.get('[data-cy=box-size-plus]').should('be.disabled');
    });

    it('should not decrease box size below 10', () => {
      cy.get('[data-cy=box-size-minus]').should('not.be.disabled');
      for (let i = 0; i < 10; i++) {
        cy.get('[data-cy=box-size-minus]').click();
      }
      cy.get('[data-cy=box-size]')
        .invoke('text')
        .then(parseFloat)
        .should('not.be.lt', 10);
      cy.get('[data-cy=box-size-minus]').should('be.disabled');
    });

    // Font change
    it('should change the font', () => {
      cy.get('[data-cy=font]').should('have.text', 'Times new roman');
      cy.get('[data-cy=font-next-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Roboto');
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Sansita');
    });

    // Banner
    it('should show/remove banner', () => {
      cy.get('[data-cy=banner]').should('have.text', '');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=banner]').should('have.text', 'test');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=banner]').should('have.text', '');
    });

    // Big font
    it('should show/remove large-font', () => {
      cy.get('[data-cy=large-font]').should('have.text', 'false');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'true');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'false');
    });
  });
});
