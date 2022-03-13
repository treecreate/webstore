import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { DesignTypeEnum, DesignFontEnum, IDesign } from '@interfaces';
import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockDesign: IDesign = {
  designId: 'MOCK_ID',
  designProperties: {
    font: DesignFontEnum.roboto,
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
  },
  mutable: true,
  user: null,
  designType: DesignTypeEnum.familyTree,
};

describe('ProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
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
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify(mockDesign.designProperties));
      localStorageDesign = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
      cy.visit('/product');

      cy.intercept('POST', '/designs', {
        statusCode: 200,
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

    it('should be unable to increase box size since default is max', () => {
      const arrows = '{rightarrow}'.repeat(50);
      cy.get('[data-cy=box-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 40);
      });
    });

    it('should be unable to decrease box size below the minimum', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      const arrows = '{leftarrow}'.repeat(10);
      cy.get('[data-cy=box-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 15);
      });
    });

    it('should increase box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      const defaultValue = 20;
      const newValue = 30;
      const arrows = '{rightarrow}'.repeat(newValue - defaultValue);
      cy.get('[data-cy=box-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', newValue);
      });
    });

    it('should decrease box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      const defaultValue = 20;
      const newValue = 18;
      const arrows = '{leftarrow}'.repeat(defaultValue - newValue);
      cy.get('[data-cy=box-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', newValue);
      });
    });

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
  });

  describe('Draggable boxes', () => {
    it('should be able to click on the canvas and create a new box in mutable view', () => {
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify(mockDesign.designProperties));
      cy.visit('/product');
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=family-tree-canvas]').click();
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length + 1);
      // persist in local storage to double check the creation
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
        console.warn('After design: ', localStorageDesignAfter);
        cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 3);
      });
    });

    it('should not be able to click on the canvas and create a new box in immutable view', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.intercept('GET', '/designs/me/IMMUTABLE_DESIGN_ID', {
        statusCode: 200,
        body: { ...mockDesign, designId: 'IMMUTABLE_DESIGN_ID', mutable: false },
      });
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify({ ...mockDesign.designProperties }));
      cy.visit('/product?designId=IMMUTABLE_DESIGN_ID');
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=family-tree-canvas]').click();
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
    });

    it('should display two boxes with text and drag/close icons when in mutable view', () => {
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify(mockDesign.designProperties));
      cy.visit('/product');
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-input]').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-close-button]').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-drag-button]').should('have.length', mockDesign.designProperties.boxes.length);
    });

    it('should display two boxes with text but no drag/close icons when in immutable view', () => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.intercept('GET', '/designs/me/IMMUTABLE_DESIGN_ID', {
        statusCode: 200,
        body: { ...mockDesign, designId: 'IMMUTABLE_DESIGN_ID', mutable: false },
      });
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify({ ...mockDesign.designProperties }));
      cy.visit('/product?designId=IMMUTABLE_DESIGN_ID');
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-input]').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-close-button]').should('not.exist');
      cy.get('[data-cy=draggable-box-drag-button]').should('not.exist');
    });

    it('should remove a box when user click on the close icon', () => {
      localStorage.setItem(LocalStorageVars.designFamilyTree, JSON.stringify(mockDesign.designProperties));
      cy.visit('/product');
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length);
      cy.get('[data-cy=draggable-box-close-button]').first().click();
      cy.get('webstore-draggable-box').should('have.length', mockDesign.designProperties.boxes.length - 1);
    });
  });

  describe('Unauthorised', () => {
    beforeEach(() => {
      cy.visit('/product');
    });
    // box-size buttons
    it('should contain a navbar and footer', () => {
      cy.get('[data-cy=navbar]').should('exist');
    });

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
