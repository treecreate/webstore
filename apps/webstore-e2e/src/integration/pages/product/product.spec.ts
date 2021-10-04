import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum, IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';
describe('ProductPage', () => {
  const authMockService = new AuthenticationService();
  const mockDesign = {
    title: 'title',
    font: FamilyTreeFontEnum.roboto,
    backgroundTreeDesign: TreeDesignEnum.tree1,
    boxSize: 20,
    banner: {
      text: 'my tree',
      style: 'first',
    },
    largeFont: false,
    boxes: [
      {
        x: 400,
        y: 400,
        previousX: 0,
        previousY: 0,
        dragging: false,
        boxDesign: BoxDesignEnum.box1,
        text: 'teo',
      },
      {
        x: 200,
        y: 200,
        previousX: 91,
        previousY: 91,
        dragging: false,
        boxDesign: BoxDesignEnum.box2,
        text: 'teodor',
      },
    ],
  };

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"` // localStorage saves the data differently from our LocalStorageService
    );
    cy.visit('/product');
  });

  it.skip('It should display the notSignedIn page when user isnt logged in', () => {
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.url().should('contain', '/notSignedIn');
    cy.get('[data-cy=not-signed-in-product-button]').click();
    cy.url().should('contain', '/product');
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.get('[data-cy=not-signed-in-login-button]').click();
  });

  it.skip('It should not display notSignedIn page when user is logged in', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.url().should('contain', '/product');
  });

  it.skip('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
    //TODO: set unauthenticated user in localstorage
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserInvalid))
    );
    //TODO: try fetching a design based on id with an intercept
  });

  describe('DesignOptions', () => {
    let localStorageDesign;

    beforeEach(() => {
      cy.visit('/home');
      localStorage.setItem(
        LocalStorageVars.designFamilyTree,
        JSON.stringify(mockDesign)
      );
      localStorageDesign = JSON.parse(
        localStorage.getItem(LocalStorageVars.designFamilyTree)
      );
      cy.visit('/product');
    });

    it.skip('should be able to click on the canvas and create a new box', () => {
      cy.wrap(localStorageDesign).its('boxes').should('have.length', 2);
      cy.get('[data-cy=family-tree-canvas]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        console.warn('After design: ', localStorageDesignAfter);
        cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 3);
      });
    });

    it.skip('should be able to change the fonts', () => {
      cy.wrap(localStorageDesign).its('font').should('equal', 'Roboto');
      cy.get('[data-cy=font-next-btn]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('font').should('equal', 'Georgia');
      });
    });

    it.skip('should be able to change the design', () => {
      cy.wrap(localStorageDesign)
        .its('backgroundTreeDesign')
        .should('equal', TreeDesignEnum.tree1);
      cy.get('[data-cy=design-arrow-left]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter)
          .its('backgroundTreeDesign')
          .should('equal', TreeDesignEnum.tree2);
      });
    });

    it.skip('should increase box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 22);
      });
    });

    it.skip('should decrease box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 18);
      });
    });

    it.skip('should be able to change the banner', () => {
      cy.wrap(localStorageDesign).its('banner.text').should('equal', 'my tree');
      cy.get('[data-cy=design-banner-input]').clear();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter)
          .its('banner.text')
          .should('equal', 'test');
      });
    });
    it.skip('should be able to change large font', () => {
      cy.wrap(localStorageDesign).its('largeFont').should('equal', false);
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('largeFont').should('equal', true);
      });
    });

    it('should have add to basket button disabled when not logged in', () => {
      cy.get('[data-cy=add-to-basket-button]').should('be.disabled');
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/product');
      cy.get('[data-cy=add-to-basket-button]').should('not.be.disabled');
    });

    it('should have save button disabled when not logged in', () => {
      cy.get('[data-cy=save-family-tree-button]').should('be.disabled');
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/product');
      cy.get('[data-cy=save-family-tree-button]').should('not.be.disabled');
    });
    it.skip('should be able to load a design via url', () => {
      //TODO: intercept loading a design with url
    });
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
    it.skip('should contain a navbar and footer', () => {
      cy.get('[data-cy=navbar]').should('exist');
      cy.get('[data-cy=footer]').should('exist');
    });

    it.skip('should have a box-size of 20', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
    });

    it.skip('should increase box size when + is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '21');
    });

    it.skip('should decrease box size when - is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '19');
    });

    it.skip('should not increase box size above 40', () => {
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

    it.skip('should not decrease box size below 10', () => {
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
    it.skip('should change the font', () => {
      cy.get('[data-cy=font]').should('have.text', 'Times new roman');
      cy.get('[data-cy=font-next-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Roboto');
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Sansita');
    });

    // Banner
    it.skip('should show/remove banner', () => {
      // for some reason, cypress reads the value with extra spaces
      cy.get('[data-cy=banner]').should('have.text', '  ');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=banner]').should('have.text', ' test ');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=banner]').should('have.text', '  ');
    });

    // Big font
    it.skip('should show/remove large-font', () => {
      cy.get('[data-cy=large-font]').should('have.text', 'false');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'true');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'false');
    });
  });
});
