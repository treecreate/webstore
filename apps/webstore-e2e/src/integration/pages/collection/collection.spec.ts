import { BoxDesignEnum, TreeDesignEnum } from '@assets';
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
import { LocalStorageVars, CookieStatus, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('CollectionPage', () => {
  const authMockService = new AuthenticationService();
  const mockUser: IUser = {
    userId: '1c1ca614-6600-4e61-aec5-8e6143b1',
    email: 'suckmeoff@test.com',
    roles: [UserRoles.user],
    isVerified: true,
    name: 'macSackMyD*ck',
    phoneNumber: '+4512345678',
    streetAddress: 'Yo mammas house 69, 3rd floor',
    streetAddress2: 'more details: suck it',
    city: 'Copenhagen',
    postcode: '1234',
    country: 'DK what u think',
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
  const mockDesign1: IDesign = {
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
  const mockDesign2: IDesign = {
    designId: 'c0a121-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title2',
      font: FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxTwo],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  const mockDesign3: IDesign = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title3',
      font: FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxOne],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  const mockDesign4: IDesign = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title3',
      font: FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxOne],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: false,
  };
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
  const mockTransactionItem: ITransactionItem = {
    transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    order: mockOrder,
    dimension: DesignDimensionEnum.medium,
    quantity: 1,
    design: mockDesign4,
  };

  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.intercept('GET', '/transaction-items/me', {
      body: [mockTransactionItem],
      statusCode: 200,
    });
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    cy.visit('/profile');
  });

  it('should display the no-designs page if the list is empty', () => {
    //TODO: Create intercept
    //TODO: Check presense of no-designs
  });

  it('Should display all deisgns properly', () => {
    //TODO: Create intercept
    //TODO: Check itemList length
  });

  it('should remove an item from the list when delete is clicked', () => {
    //TODO: Create intercept
    //TODO: Check itemList length
    //TODO: Click delete
    //TODO: Check itemList length
  });

  it('should go into edit mode when clicking edit', () => {
    //TODO: Click edit
    //TODO: Check url
  });

  it('should open the addToBasket modal with the correct design', () => {
    //TODO: Open addToBasket modal
    //TODO: Check for the correct title
  });

  it('should redirect to profile', () => {
    //TODO: Click profile
    //TODO: Check url
  });

  it('should redirect to product', () => {
    //TODO: Click create new
    //TODO: Check url
  });
});
