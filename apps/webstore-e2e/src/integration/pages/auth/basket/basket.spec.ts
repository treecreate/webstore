import { TreeDesignEnum, BoxDesignEnum } from '@assets';
import {
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
  roles: [UserRoles.user],
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
    cy.intercept('GET', '/transaction-items/me', {
      body: mockTransactionItem,
      statusCode: 200,
    });
    cy.visit('/basket');
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

  it.skip('should apply discount', () => {});

  it.skip('should go to checkout', () => {});

  describe.skip('AddToBasketModal', () => {
    it('should save design and direct to login if user is not logged in', () => {});

    it('should have the title written if it is in the product page', () => {});

    it('should be able to change title', () => {});

    it('it should set the title to untitled if there is no title', () => {});

    it('should increase quantity', () => {});

    it('should decrease quantity', () => {});

    it('should increase dimensions', () => {});

    it('should decrease dimensions', () => {});
  });
});
