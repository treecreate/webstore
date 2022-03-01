import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum } from '@interfaces';
import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockDesign = {
  font: FamilyTreeFontEnum.roboto,
  backgroundTreeDesign: TreeDesignEnum.tree1,
  boxSize: 20,
  banner: {
    text: 'my tree',
    style: 'first',
  },
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

describe('ProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    cy.visit('/product');
  });

  it('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserInvalid))
    );
    cy.visit('/product');

    cy.intercept('GET', '/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345', {
      statusCode: 401,
    });

    //TODO: try fetching a design based on id with an intercept
  });

  describe('DesignOptions', () => {
    let localStorageDesign;

    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify(mockDesign));
      localStorageDesign = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
      cy.visit('/product');

      cy.intercept('POST', '/designs', {
        statusCode: 200,
      });
    });

    it('should be able to click on the canvas and create a new box', () => {
      cy.wrap(localStorageDesign).its('boxes').should('have.length', 2);
      cy.get('[data-cy=family-tree-canvas]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        console.warn('After design: ', localStorageDesignAfter);
        cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 3);
      });
    });

    it('should be able to change the fonts', () => {
      cy.wrap(localStorageDesign).its('font').should('equal', 'roboto');
      cy.get('[data-cy=font]').should('have.text', 'roboto');
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('font').should('equal', 'calendas-italic');
      });
    });

    it('should be able to change the design', () => {
      cy.wrap(localStorageDesign).its('backgroundTreeDesign').should('equal', TreeDesignEnum.tree1);
      cy.get('[data-cy=design-arrow-left]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('backgroundTreeDesign').should('equal', TreeDesignEnum.tree2);
      });
    });

    //  it('should increase box size and save it', () => {
    //   cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
    //   cy.get('[data-cy=box-size-plus]').click();
    //   cy.get('[data-cy=box-size-plus]').click();
    //   cy.get('[data-cy=save-family-tree-button]').click();
    //   cy.visit('/product').then(() => {
    //     const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
    //     cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 22);
    //   });
    // });

    //  it('should decrease box size and save it', () => {
    //   cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
    //   cy.get('[data-cy=box-size-minus]').click();
    //   cy.get('[data-cy=box-size-minus]').click();
    //   cy.get('[data-cy=save-family-tree-button]').click();
    //   cy.visit('/product').then(() => {
    //     const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
    //     cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 18);
    //   });
    // });

    it('should be able to change the banner', () => {
      cy.wrap(localStorageDesign).its('banner.text').should('equal', 'my tree');
      cy.get('[data-cy=design-banner-input]').clear();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('banner.text').should('equal', 'test');
      });
    });

    it('should be able to load a design via url', () => {
      //TODO: intercept loading a design with url
      // cy.intercept('GET', '/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345', {
      //   body: {
      //     designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
      //     designProperties: mockDesign,
      //     designType: 'FAMILY_TREE',
      //     user: mockUser,
      //   },
      //   statusCode: 200,
      // });
      // cy.visit('/product');
      // cy.request('/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345');
    });
  });

  describe('Unauthorised', () => {
    // box-size buttons
    it('should contain a navbar and footer', () => {
      cy.get('[data-cy=navbar]').should('exist');
    });

    // TODO: Create tests for the boxSize slider

    // Font change
    it('should change the font', () => {
      cy.get('[data-cy=font]').should('have.text', 'bairol-bold-italic');
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });
      cy.get('[data-cy=font]').should('not.have.text', 'bairol-bold-italic');
      cy.get('[data-cy=font]').should('have.text', 'calendas-italic');
    });

    // Banner
    it('should show/remove banner', () => {
      // for some reason, cypress reads the value with extra spaces
      cy.get('[data-cy=banner]').should('have.text', ' Familietræet ');
      cy.get('[data-cy=design-banner-input]').clear().type('test');
      cy.get('[data-cy=banner]').should('have.text', ' test ');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=banner]').should('have.text', '  ');
    });
  });
});
