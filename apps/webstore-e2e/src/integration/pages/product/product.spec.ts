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

  /* TODO: Write the following tests (some of them may already exist. Mock all API calls):
   * - should not be able to access the products page as an unauthenticated user (test via navbar button, and via changing the url)
   * - should not get to fetch design based on the id when accessing the products page as an unauthenticated user (access with `designId` param in the url, validate via local storage)
   * - should be able to see the page as an authenticated user (all of the tests below are for authenticated users)
   * - should be able to change the title, font, design, box size, banner, large font, and save (check local storage for updated value)
   * - should be able to click on the canvas and create a new box (click within canvas element, count inputs on page) (check saved data)
   * - should be able to change the fonts (check saved data)
   * - should be able to change the design (check saved data)
   * - should be able to change the box size (verify min and max) (check saved data)
   * - should be able to change the banner (click checkbox, type in the input) (check saved data)
   * - should be able to change large font (check saved data)
   * - should be able to load a design via url (change designId, mock API call Validate that all settings got applied)
   */

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
