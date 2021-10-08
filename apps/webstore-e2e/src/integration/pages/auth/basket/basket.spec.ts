import { TreeDesignEnum, BoxDesignEnum } from '@assets';
import {
  CreateTransactionItemRequest,
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTreeBanner,
  IOrder,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockOrder: IOrder = {
  orderId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  purchaseStatus: '',
  discountCode: {
    amount: 100,
    type: DiscountType.amount,
  },
  initialPrice: 1000,
  finalPrice: 900,
  currency: 'DK',
  createdAt: 'today',
};
const mockUser: IUser = {
  userId: '1',
  email: 'e2e@test.com',
  roles: [UserRoles.user, UserRoles.admin, UserRoles.developer],
  isVerified: true,
  name: 'teodor jonasson',
  phoneNumber: '',
  streetAddress: '',
  streetAddress2: '',
  city: '',
  postcode: '',
  country: '',
};
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
const mockDesign: IDesign = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  designProperties: {
    title: 'title1',
    font: FamilyTreeFontEnum.roboto,
    backgroundTreeDesign: TreeDesignEnum.tree1,
    boxSize: 20,
    banner: mockBanner,
    largeFont: false,
    boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
  },
  designType: DesignTypeEnum.familyTree,
  user: mockUser,
  mutable: true,
};
const mockTransactionItem: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  order: mockOrder,
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
  design: mockDesign,
};
const mockCreateTransactionItemRequest: CreateTransactionItemRequest = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
};
const mockCreateTransactionItemRequestUpdatedQuantity: CreateTransactionItemRequest = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 2
}
const mockCreateTransactionItemRequestUpdatedDimension: CreateTransactionItemRequest = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.large,
  quantity: 1
}

describe('BasketPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
  });

  it.skip('should display the transaction items in the basket', () => {
    cy.get('[data-cy=basket-item]').first().should('exist');
  });

  it.skip('should increase / decrease amount of trees donated', () => {
    cy.get('[data-cy=basket-decrease-donated-trees-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=basket-donated-trees]').should('contain', '1');
    cy.get('[data-cy=basket-increase-donated-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-donated-trees]').should('contain', '2');
    cy.get('[data-cy=basket-increase-donated-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-donated-trees]').should('contain', '3');
    cy.get('[data-cy=basket-decrease-donated-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-donated-trees]').should('contain', '2');
    cy.get('[data-cy=basket-decrease-donated-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-donated-trees]').should('contain', '1');
    cy.get('[data-cy=basket-decrease-donated-trees-button]').should(
      'be.disabled'
    );
  });

  it.skip('should apply discount', () => {
    cy.intercept('GET', '/discount/testDISCOUNT123', {
      //TODO: get discount
    });
    cy.get('[data-cy=basket-apply-discount-input]').type('testDISCOUNT123', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    //TODO: check if discount is applied
    //TODO: check that discount button is disabled
  });

  it.skip('should go to checkout', () => {
    cy.get('[data-cy=basket-checkout-button]').click();
    cy.url().should('contain', '/checkout');
  });

  it.skip('should update price when changing dimention of a product', () => {
    //TODO: check with calli that this is correct 
    cy.intercept('PUT', '/transaction-items/me' + mockCreateTransactionItemRequest.designId, {
      body: mockCreateTransactionItemRequestUpdatedDimension,
      statusCode: 200,
    });
    cy.get('[data-cy=basket-final-price]').should('contain', '695'); 
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-decrese-dimension-button]').should('not.be.disabled');
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-dimension-button]').click({ force: true});
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '995');
        cy.get('[data-cy=basket-final-price]').should('contain', '995'); 
      });
  });

  it.skip('should update price when changing quantity of a product', () => {
    //TODO: check with calli that this is correct 
    cy.intercept('PUT', '/transaction-items/me' + mockCreateTransactionItemRequest.designId, {
      body: mockCreateTransactionItemRequestUpdatedQuantity,
      statusCode: 200,
    });
    cy.get('[data-cy=basket-final-price]').should('contain', '695'); 
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-quantity-button]').click({ force: true });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '1390');
        cy.get('[data-cy=basket-final-price]').should('contain', '1390'); 
      });
  });

  it('should remove the product from basket when pressing delete', () => {
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-increase-quantity-button]').click({ force: true });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '1390');
        cy.get('[data-cy=basket-final-price]').should('contain', '1390'); 
      });
  });

  it.skip('should show a viewOnly version of the design', () => {});

  it.skip('should update price when values are changed', () => {
    //Update the transaction item
    cy.intercept('PUT', '/transaction-items/me', {
      body: mockCreateTransactionItemRequest,
      statusCode: 200,
    });
  });

  it.skip('should add an transaction item to basket', () => {
    //For adding to basket
    cy.intercept('POST', '/transaction-items/me', {
      body: mockCreateTransactionItemRequest,
      statusCode: 200,
    });
  });
});

describe.skip('AddToBasketModal', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.visit('/product');
  });
  it('should have add-to-basket button redirect to login when not logged in', () => {
    cy.visit('/home');
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(
        authMockService.getMockUser(AuthUserEnum.authUserInvalid)
      )
    );
    cy.visit('/product');
    cy.get('[data-cy=add-to-basket-button]').click();
    cy.url().should('contain', '/login');
  });

  it('should open add-to-basket modal when user is logged in', () => {
    cy.get('[data-cy=add-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
  });

  it('should have the title written if it is in the product page', () => {
    cy.get('[data-cy=design-title-input]').clear({ force: true });
    cy.get('[data-cy=design-title-input]').type('family tree', {
      force: true,
    });
    cy.get('[data-cy=add-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-title-input]').should(
      'conatin',
      'family tree'
    );
  });

  it('should be able to change title', () => {
    cy.get('[data-cy=design-title-input]').type('family tree');
    cy.get('[data-cy=add-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-title-input]').should(
      'conatin',
      'family tree'
    );
    cy.get('[data-cy=add-to-basket-title-inpu]').clear();
    cy.get('[data-cy=add-to-basket-title-inpu]').type('familietræ');
    cy.get('[data-cy=add-to-basket-title-inpu]').should(
      'conatin',
      'familietræ'
    );
  });

  it('it should set the title to untitled if there is no title', () => {});

  it('should increase quantity', () => {});

  it('should decrease quantity', () => {});

  it('should increase dimensions', () => {});

  it('should decrease dimensions', () => {});
});
