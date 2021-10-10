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
const mockTransactionItemTwo: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a1',
  order: mockOrder,
  dimension: DesignDimensionEnum.small,
  quantity: 3,
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
  quantity: 2,
};
const mockCreateTransactionItemRequestUpdatedDimension: CreateTransactionItemRequest = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.large,
  quantity: 1,
};

it('should add an transaction item to basket', () => {
  localStorage.setItem(
    LocalStorageVars.cookiesAccepted,
    `"${CookieStatus.accepted}"`
  );
  localStorage.setItem(
    LocalStorageVars.authUser,
    JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
  );
  cy.intercept('GET', '/transaction-items/me', {
    body: [mockTransactionItem, mockTransactionItemTwo],
    statusCode: 200,
  });
  //Add new item to basket
  cy.visit('/product');
  cy.get('[data-cy=family-tree-canvas]').click();
  cy.get('[data-cy=add-family-tree-to-basket-button]').click();
  cy.get('[data-cy=add-to-basket-modal]').should('exist');
  cy.get('[data-cy=add-to-basket-title-input]').type('TestItem01');
  cy.get('[data-cy=add-to-basket-add-to-basket-button]').click();
  cy.url().should('contain', '/product');

  //Check that the new item has been added
  cy.visit('/basket');
  cy.get('[data-cy=basket-item]').then((items) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(items[0]).exist;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(items[1]).exist;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(items[2]).not.exist;
  });
});

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

  it('should display the transaction items in the basket', () => {
    cy.get('[data-cy=basket-item]').first().should('exist');
  });

  it('should increase / decrease amount of trees donated', () => {
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

  it('should apply discount', () => {
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

  it('should go to checkout', () => {
    cy.get('[data-cy=basket-checkout-button]').click();
    cy.url().should('contain', '/checkout');
  });

  it('should update price when changing dimention of a product', () => {
    cy.intercept(
      'PUT',
      '/transaction-items/me/' + mockCreateTransactionItemRequest.designId,
      {
        body: mockCreateTransactionItemRequestUpdatedDimension,
        statusCode: 200,
      }
    );
    cy.get('[data-cy=basket-final-price]').should('contain', '695');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-decrese-dimension-button]').should(
          'not.be.disabled'
        );
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-dimension-button]').click({
          force: true,
        });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '995');
        cy.get('[data-cy=basket-final-price]').should('contain', '995');
      });
  });

  it('should update price when changing quantity of a product', () => {
    cy.intercept(
      'PUT',
      '/transaction-items/me/' + mockCreateTransactionItemRequest.designId,
      {
        body: mockCreateTransactionItemRequestUpdatedQuantity,
        statusCode: 200,
      }
    );
    cy.get('[data-cy=basket-final-price]').should('contain', '695');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-quantity-button]').click({
          force: true,
        });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '1390');
        cy.get('[data-cy=basket-final-price]').should('contain', '1390');
      });
  });

  it('should remove the product from basket when pressing delete', () => {
    cy.intercept(
      'DELETE',
      '/transaction-items/me/' + mockCreateTransactionItemRequest.designId,
      {
        statusCode: 204,
      }
    );
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-delete-button]').click({ force: true });
      })
      .then(() => {
        cy.get('[data-cy=basket-item]').should('not.exist');
      });
  });

  it('should show a viewOnly version of the design', () => {
    cy.intercept('GET', '/designs/me/' + mockDesign.designId, {
      body: mockDesign,
      statusCode: 204,
    });
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-view-button]').click({ force: true });
      })
      .then(() => {
        cy.url().should('contain', '/product?designId=' + mockDesign.designId);
        cy.get('[data-cy=product-options]').should('not.exist');
        cy.get('[data-cy=view-only-back-button]').should('exist');
        cy.get('[data-cy=view-only-back-button]').click({ force: true });
        cy.url().should('contain', '/basket');
      });
  });
});

describe('AddToBasketModal', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
    cy.visit('/product');
  });

  it('should open add-to-basket modal when user is logged in', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
  });

  it('should have the title written if it is in the product page', () => {
    cy.get('[data-cy=design-title-input]').clear({ force: true });
    cy.get('[data-cy=design-title-input]').type('family tree', {
      force: true,
    });
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-title-input]').should(
      'have.value',
      'family tree'
    );
  });

  it('should be able to change title', () => {
    cy.get('[data-cy=design-title-input]').type('family tree', { force: true });
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-title-input]').should(
      'have.value',
      'family tree'
    );
    cy.get('[data-cy=add-to-basket-title-input]').clear();
    cy.get('[data-cy=add-to-basket-title-input]').type('familietræ');
    cy.get('[data-cy=add-to-basket-title-input]').should(
      'have.value',
      'familietræ'
    );
  });

  it('it should not be able to add to basket without a title', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-add-to-basket-button]').should(
      'be.disabled'
    );
  });

  it('should increase / decrease quantity', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '1');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should(
      'not.be.disabled'
    );
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '2');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '3');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '4');
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '3');
  });

  it('should increase / decrease dimensions', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', 'SMALL');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should(
      'not.be.disabled'
    );
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', 'MEDIUM');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', 'LARGE');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', 'MEDIUM');
  });
});
