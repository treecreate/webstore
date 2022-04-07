/* eslint-disable @typescript-eslint/no-unused-vars */
import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  CreateTransactionItemRequest,
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  DesignFontEnum,
  IDesign,
  IDiscount,
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
  userId: '7f000001-7b0d-19bf-817b-0d0a8ec40000',
  email: 'e2e@test.com',
  roles: [
    { name: UserRoles.user, roleId: '' },
    { name: UserRoles.developer, roleId: '' },
    { name: UserRoles.admin, roleId: '' },
  ],
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
    font: DesignFontEnum.roboto,
    backgroundTreeDesign: TreeDesignEnum.tree1,
    boxSize: 20,
    banner: mockBanner,
    boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
  },
  designType: DesignTypeEnum.familyTree,
  user: mockUser,
  mutable: true,
};
const mockDiscount: IDiscount = {
  discountId: '123',
  discountCode: 'yeet10percent',
  amount: 10,
  type: DiscountType.percent,
  remainingUses: 2,
  totalUses: 1,
  isEnabled: true,
  expiresAt: new Date('2029-11-20T00:00:00'),
};
const mockDiscountNoUsesLeft: IDiscount = {
  discountId: '1234',
  discountCode: 'yeet20percent',
  amount: 20,
  type: DiscountType.percent,
  remainingUses: 0,
  totalUses: 1,
  isEnabled: true,
  expiresAt: new Date('2029-11-20T00:00:00'),
};
const mockDiscountExpired: IDiscount = {
  discountId: '12345',
  discountCode: 'yeet30percent',
  amount: 30,
  type: DiscountType.percent,
  remainingUses: 10,
  totalUses: 1,
  isEnabled: true,
  expiresAt: new Date('2021-11-20T00:00:00'),
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

describe('BasketPage using localstorage (not logged in)', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    localStorage.setItem(
      LocalStorageVars.transactionItems,
      JSON.stringify([mockTransactionItem, mockTransactionItemLarge])
    );
  });

  it('should add an transaction item to basket', () => {
    cy.visit('/catalog/family-tree');
    // Create design
    cy.get('[data-cy=family-tree-canvas]').click();
    // Open add to basket modal
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
    // Change attributes
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    // Add to basket
    cy.get('[data-cy=add-to-basket-add-to-basket-button]').click();
    cy.url().should('contain', '/catalog/family-tree');

    //Check that the new item has been added
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]').should('have.length', 3);

    // Check the new items attributes
    cy.get('[data-cy=basket-item]')
      .last()
      .within(() => {
        cy.get('[data-cy=basket-item-decrease-dimension-button]').should('not.be.disabled');
        cy.get('[data-cy=basket-item-price]').should('contain', '1390');
      });
  });

  it('should increase / decrease amount of trees planted', () => {
    cy.visit('/basket');
    cy.get('[data-cy=basket-decrease-planted-trees-button]').should('be.disabled');
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
    cy.get('[data-cy=basket-decrease-planted-trees-button]').should('be.disabled');
  });

  it('should apply discount', () => {
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

  it('should not apply discount with no remaining uses', () => {
    cy.intercept('GET', '/discounts/yeet20percent', {
      statusCode: 200,
      body: mockDiscountNoUsesLeft,
    });
    cy.visit('/basket');
    cy.get('[data-cy=discount-amount-basket]').should('not.exist');
    cy.get('[data-cy=subtotal-price-basket]').should('contain', '1690');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-apply-discount-input]').type('yeet20percent', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    cy.get('[data-cy=discount-price-amount-basket]').should('not.exist');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
  });

  it('should not apply discount that has expired', () => {
    cy.intercept('GET', '/discounts/yeet30percent', {
      statusCode: 200,
      body: mockDiscountExpired,
    });
    cy.visit('/basket');
    cy.get('[data-cy=discount-amount-basket]').should('not.exist');
    cy.get('[data-cy=subtotal-price-basket]').should('contain', '1690');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-apply-discount-input]').type('yeet30percent', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    cy.get('[data-cy=discount-price-amount-basket]').should('not.exist');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
  });

  it('should not apply discount that is not enabled', () => {
    cy.intercept('GET', '/discounts/yeet30percent', {
      statusCode: 200,
      body: { ...mockDiscount, isEnabled: false },
    });
    cy.visit('/basket');
    cy.get('[data-cy=discount-amount-basket]').should('not.exist');
    cy.get('[data-cy=subtotal-price-basket]').should('contain', '1690');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-apply-discount-input]').type('yeet30percent', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    cy.get('[data-cy=discount-price-amount-basket]').should('not.exist');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
  });

  it('should not apply discount that has not started yet', () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    cy.intercept('GET', '/discounts/yeet30percent', {
      statusCode: 200,
      body: { ...mockDiscount, startsAt: date },
    });
    cy.visit('/basket');
    cy.get('[data-cy=discount-amount-basket]').should('not.exist');
    cy.get('[data-cy=subtotal-price-basket]').should('contain', '1690');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-apply-discount-input]').type('yeet30percent', {
      force: true,
    });
    cy.get('[data-cy=basket-apply-discount-button]').click({ force: true });
    cy.get('[data-cy=discount-price-amount-basket]').should('not.exist');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
  });

  it('should remove the product from basket when pressing delete', () => {
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-delete-button]').click({ force: true });
      })
      .then(() => {
        cy.get('[data-cy=basket-item]').should('have.length', 1);
      });
  });
  it('should show a viewOnly version of the design', () => {
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-view-button]').click({ force: true });
      })
      .then(() => {
        cy.url().should('contain', '/catalog/family-tree?designId=0');
        cy.get('[data-cy=product-options]').should('not.exist');
        cy.get('[data-cy=view-only-back-button]').should('exist');
        cy.get('[data-cy=view-only-back-button]').click({ force: true });
        cy.url().should('contain', '/basket');
      });
  });

  it('should update price when changing dimention of a product', () => {
    cy.visit('/basket');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-decrease-dimension-button]').should('not.be.disabled');
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-dimension-button]').click({
          force: true,
        });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '995');
        cy.get('[data-cy=total-price-basket]').should('contain', '1990');
      });
  });

  it('should update price when changing quantity of a product', () => {
    cy.visit('/basket');
    cy.get('[data-cy=total-price-basket]').should('contain', '1690');
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
        cy.get('[data-cy=total-price-basket]').should('contain', '2385');
      });
  });
});

describe('BasketPage with a logged in user', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
  });

  it('should display the transaction items in the basket', () => {
    cy.intercept('PUT', '/transaction-items/me/' + mockTransactionItem.transactionItemId, {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]').first().should('exist');
  });

  it('should go to checkout', () => {
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
    cy.get('[data-cy=basket-checkout-button]').click();
    cy.url().should('contain', '/checkout');
  });

  // TODO: Fix this test intercept
  it.skip('should update price when changing dimention of a product', () => {
    //Retrieve all transaction items LIST
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.intercept('PUT', '/transaction-items/me/' + mockTransactionItem.transactionItemId, {
      body: [mockTransactionItemLarge],
      statusCode: 200,
    });
    cy.visit('/basket');
    cy.get('[data-cy=total-price-basket]').should('contain', '695');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-decrease-dimension-button]').should('not.be.disabled');
        cy.get('[data-cy=basket-item-price]').should('contain', '695');
        cy.get('[data-cy=basket-item-increase-dimension-button]').click({
          force: true,
        });
      })
      .then(() => {
        cy.get('[data-cy=basket-item-price]').should('contain', '995');
        cy.get('[data-cy=total-price-basket]').should('contain', '995');
      });
  });

  // TODO: Fix this test intercept
  it.skip('should update price when changing quantity of a product', () => {
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
    cy.get('[data-cy=total-price-basket]').should('contain', '695');
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
        cy.get('[data-cy=total-price-basket]').should('contain', '1390');
      });
  });

  // TODO: Fix this basket delete intercept
  it.skip('should remove the product from basket when pressing delete', () => {
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.intercept('PUT', '/transaction-items/me/' + mockTransactionItem.transactionItemId, {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.visit('/basket');
    cy.get('[data-cy=basket-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=basket-item-delete-button]').click({
          force: true,
        });
      })
      .then(() => {
        cy.get('[data-cy=no-items-in-basket]').should('exist');
      });
  });
});

describe('AddToBasketModal', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.visit('/catalog/family-tree');
  });

  it('should open add-to-basket modal when user is logged in', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-modal]').should('exist');
  });

  it('should increase / decrease quantity', () => {
    cy.get('[data-cy=add-family-tree-to-basket-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-quantity]').should('contain', '1');
    cy.get('[data-cy=add-to-basket-increase-quantity-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-quantity-button]').should('not.be.disabled');
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
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '20cm x 20cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').should('not.be.disabled');
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '25cm x 25cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '30cm x 30cm');
    cy.get('[data-cy=add-to-basket-increase-dimension-button]').should('be.disabled');
    cy.get('[data-cy=add-to-basket-decrease-dimension-button]').click();
    cy.get('[data-cy=add-to-basket-dimension]').should('contain', '25cm x 25cm');
  });
});
