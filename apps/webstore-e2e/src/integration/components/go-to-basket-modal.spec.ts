import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DesignFontEnum,
  IDraggableBox,
  IFamilyTreeBanner,
  CreateDesignRequest,
} from '@interfaces';
import { LocalStorageVars, CookieStatus } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('go to basket modal', () => {
  const authMockService = new AuthenticationService();
  const mockDraggableBoxOne: IDraggableBox = {
    x: 400,
    y: 400,
    previousX: 0,
    previousY: 0,
    dragging: false,
    boxDesign: BoxDesignEnum.box1,
    text: 'teo',
  };
  const mockDraggableBoxTwo: IDraggableBox = {
    x: 200,
    y: 200,
    previousX: 100,
    previousY: 100,
    dragging: false,
    boxDesign: BoxDesignEnum.box2,
    text: 'dor',
  };
  const mockBanner: IFamilyTreeBanner = {
    text: 'my tree 1',
    style: 'first',
  };
  const mockCreateDesignRequest: CreateDesignRequest = {
    designProperties: {
      font: DesignFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
    },
    designType: DesignTypeEnum.familyTree,
    mutable: false,
  };

  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('POST', '/designs', {
      body: mockCreateDesignRequest,
      statusCode: 200,
    });
    cy.intercept('POST', '/transaction-items/me', {
      body: {
        designId: '123',
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
      },
      statusCode: 200,
    });
    cy.visit('/product');
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-add-to-basket-button]').click();
  });

  it('should open goToBasket modal', () => {
    cy.get('[data-cy=go-to-basket-modal]').should('exist');
  });

  it('should redirect to basket', () => {
    cy.get('[data-cy=go-to-basket-go-to-basket-button]').click();
    cy.url().should('contain', '/basket');
  });

  it('should redirect to product page with a reset design', () => {
    cy.get('[data-cy=go-to-basket-create-new-button]').click();
    cy.url().should('contain', '/product');
    cy.url().should('not.contain', '?designId=');
    //Check the localstorage to be cleared
    const localStorageDesignAfter = JSON.parse(localStorage.getItem(LocalStorageVars.designFamilyTree));
  });
});
