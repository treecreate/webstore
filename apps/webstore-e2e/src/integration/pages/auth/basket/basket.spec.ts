/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ITransactionItem,
  IUser,
  UpdateTransactionItemRequest,
} from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const mockUser: IUser = {
  userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  email: 'e2e@test.com',
  roles: [UserRoles.user, UserRoles.admin, UserRoles.developer],
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
const mockDiscount = {
  discountId: '123',
  discountCode: 'yeet10percent',
  amount: 10,
  type: DiscountType.percent,
  remainingUses: 2,
  totalUses: 1,
};
const mockCreateTransactionItemRequest: CreateTransactionItemRequest = {
  designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
};
const mockCreateTransactionItemRequestUpdatedQuantity: UpdateTransactionItemRequest = {
  dimension: DesignDimensionEnum.medium,
  quantity: 2,
};
const mockCreateTransactionItemRequestUpdatedDimension: UpdateTransactionItemRequest = {
  dimension: DesignDimensionEnum.large,
  quantity: 1,
};
const mockContact = {
  name: 'teodor jonasson',
  email: 'test@test.test',
  phoneNumber: '12341234',
  streetAddress: 'yeeting anus 69',
  city: 'lolcity',
  postcode: '6969',
  country: 'DisSonBitch',
};

// Dimension change
const mockTransactionItem: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
  design: mockDesign,
};
const mockTransactionItemMedium: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a1',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
  design: mockDesign,
};
const mockTransactionItemLarge: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-08ab0a1',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.large,
  quantity: 1,
  design: mockDesign,
};
// Quantity change
const mockTransactionItemOne: ITransactionItem = {
  transactionItemId: 'c0a80121-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 1,
  design: mockDesign,
};
const mockTransactionItemTwo: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 2,
  design: mockDesign,
};

describe('BasketPage using localstorage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
    localStorage.setItem(
      LocalStorageVars.transactionItems,
      JSON.stringify([mockTransactionItem, mockTransactionItemLarge])
    );
  });

  it('should add an transaction item to basket', () => {
    cy.visit('/product');
    // Create design
    cy.get('[data-cy=family-tree-intro-close-button').click();
    cy.get('[data-cy=family-tree-canvas]').click();
    // Open add to basket modal
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
    // Give title
    cy.get('[data-cy=add-to-basket-title-input]').type('TestItem01');
    // Change attributes
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    // Add to basket
    cy.get('[data-cy=add-to-basket-add-to-basket-button]').click();
    cy.url().should('contain', '/product');

    //Check that the new item has been added
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]').should('have.length', 3);

    // Check the new items attributes
    cy.get('[data-cy=basket-item]')
      .last()
      .within(() => {
        cy.get('[data-cy=basket-item-decrease-dimension-button]').should(
          'not.be.disabled'
        );
        cy.get('[data-cy=basket-item-price]').should('contain', '1390');
        cy.get('[data-cy=basket-item-title]').should('contain', 'TestItem01');
      });
  });

  /*TODO: add localstorage tests to basket
   * remove item from basket
   * increase / decrease dimension
   * increase / decreate quantity
   * view design
   */

  it.skip('should increase / decrease amount of trees planted', () => {
    cy.visit('/basket');
    cy.get('[data-cy=basket-decrease-planted-trees-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=basket-planted-trees]').should('contain', '1');
    cy.get('[data-cy=basket-increase-planted-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-planted-trees]').should('contain', '2');
    cy.get('[data-cy=basket-increase-planted-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-planted-trees]').should('contain', '3');
    cy.get('[data-cy=basket-decrease-planted-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-planted-trees]').should('contain', '2');
    cy.get('[data-cy=basket-decrease-planted-trees-button]').click({
      force: true,
    });
    cy.get('[data-cy=basket-planted-trees]').should('contain', '1');
    cy.get('[data-cy=basket-decrease-planted-trees-button]').should(
      'be.disabled'
    );
  });

  it.skip('should apply discount', () => {
    cy.intercept('GET', '/discounts/yeet10percent', {
      statusCode: 200,
      body: mockDiscount,
    });
    cy.visit('/basket');
    cy.get('[data-cy=discount-amount-basket]').should('not.exist');
    cy.get('[data-cy=subtotal-price-basket]').should('contain', '1690');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-apply-discount-input]').type('yeet10percent', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    cy.get('[data-cy=discount-price-amount-basket]').should('contain', '169');
    cy.get('[data-cy=total-price-basket]').should('contain', '1521');
  });

  it.skip('should remove the product from basket when pressing delete', () => {
    //TODO: create should remove test
  });

  it('should show a viewOnly version of the design', () => {
    cy.visit('/basket');
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

describe.skip('BasketPage with a logged in user', () => {
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
  });

  it.skip('should display the transaction items in the basket', () => {
    cy.intercept(
      'PUT',
      '/transaction-items/me/' + mockTransactionItem.transactionItemId,
      {
        body: [mockTransactionItem],
        statusCode: 200,
      }
    );
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.get('[data-cy=basket-item]').first().should('exist');
  });

  it.skip('should go to checkout', () => {
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.get('[data-cy=basket-checkout-button]').click();
    cy.url().should('contain', '/checkout');
  });

  it.skip('should update price when changing dimention of a product', () => {
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
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

  it.skip('should update price when changing quantity of a product', () => {
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
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

  it.skip('should remove the product from basket when pressing delete', () => {
    //TODO: create should remove test
  });
});

describe.skip('AddToBasketModal', () => {
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
    cy.get('[data-cy=add-to-basket-dimension]').should(
      'contain',
      '20cm x 20cm'
    );
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should(
      'not.be.disabled'
    );
    cy.get('[data-cy=add-to-basket-dimension]').should(
      'contain',
      '25cm x 25cm'
    );
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should(
      'contain',
      '30cm x 30cm'
    );
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').should(
      'be.disabled'
    );
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should(
      'contain',
      '25cm x 25cm'
    );
  });
});
