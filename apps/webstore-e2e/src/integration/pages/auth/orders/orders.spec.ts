import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  CurrencyEnum,
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  DesignFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTreeBanner,
  IOrder,
  ITransactionItem,
  IUser,
  OrderStatusDisplayNameEnum,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

const mockUser: IUser = {
  userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
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
  designId: 'c0a80868-7ce1-1ed0-817c-f9f1e8850001',
  designProperties: {
    font: DesignFontEnum.roboto,
    backgroundTreeDesign: TreeDesignEnum.tree1,
    boxSize: 20,
    banner: mockBanner,
    boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
  },
  designType: DesignTypeEnum.familyTree,
  user: mockUser,
  mutable: false,
};
const mockDesign2: IDesign = {
  designId: 'c0a80868-7ce1-1ed0-817c-f9f1e8850001',
  designProperties: {
    font: DesignFontEnum.georgia,
    backgroundTreeDesign: TreeDesignEnum.tree2,
    boxSize: 20,
    banner: mockBanner,
    boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
  },
  designType: DesignTypeEnum.familyTree,
  user: mockUser,
  mutable: false,
};
const mockTransactionItem: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.small,
  quantity: 1,
  design: mockDesign2,
};
const mockTransactionItemTwo: ITransactionItem = {
  transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
  dimension: DesignDimensionEnum.medium,
  quantity: 2,
  design: mockDesign,
};
const mockOrder: IOrder = {
  status: OrderStatusEnum.pending,
  billingInfo: {
    city: 'cph',
    country: 'Denmark',
    email: 'example@hotdeals.dev',
    name: 'John Doe',
    phoneNumber: '+4512345678',
    postcode: '9999',
    streetAddress: 'StreetGade 123',
  },
  contactInfo: {
    city: 'cph',
    country: 'Denmark',
    email: 'example@hotdeals.dev',
    name: 'John Doe',
    phoneNumber: '+4512345678',
    postcode: '9999',
    streetAddress: 'StreetGade 123',
  },
  createdAt: new Date(),
  currency: CurrencyEnum.dkk,
  discount: {
    discountCode: 'suck it',
    type: DiscountType.amount,
    amount: 100,
    remainingUses: 1,
    totalUses: 2,
    isEnabled: true,
  },
  orderId: 'MakeMeWantIt',
  paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  plantedTrees: 1,
  shippingMethod: ShippingMethodEnum.homeDelivery,
  //State    -- not implemented
  subtotal: 1914,
  total: 1814,
  transactionItems: [mockTransactionItemTwo, mockTransactionItem],
  userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
};
const mockOrderTwo: IOrder = {
  status: OrderStatusEnum.new,
  billingInfo: {
    city: 'LULS',
    country: 'Denmark',
    email: 'exampleMyBii@hotdeals.dev',
    name: 'John Doe',
    phoneNumber: '+4512345678',
    postcode: '9999',
    streetAddress: 'StreetGade 123',
  },
  contactInfo: {
    city: 'COOOPA',
    country: 'Denmark',
    email: 'example@hotdeals.dev',
    name: 'John Doe',
    phoneNumber: '+4512345678',
    postcode: '9999',
    streetAddress: 'StreetGade 123',
  },
  createdAt: new Date(),
  currency: CurrencyEnum.dkk,
  discount: {
    discountCode: 'suck it',
    type: DiscountType.amount,
    amount: 200,
    remainingUses: 1,
    totalUses: 2,
    isEnabled: true,
  },
  orderId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  plantedTrees: 1,
  shippingMethod: ShippingMethodEnum.homeDelivery,
  subtotal: 1914,
  total: 1814,
  transactionItems: [mockTransactionItemTwo, mockTransactionItem],
  userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
};

describe('ordersPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    cy.intercept('GET', '/orders/me', {
      body: [mockOrder, mockOrderTwo],
      statusCode: 200,
    });
    cy.visit('/orders');
  });

  it('should display the orders correctly', () => {
    cy.get('[data-cy=order-item]').should('have.length', 2);
    cy.get('[data-cy=order-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=order-item-id]').should('contain', 'MakeMeWantIt');
        cy.get('[data-cy=order-item-status]').should('contain', OrderStatusDisplayNameEnum.pending);
        cy.get('[data-cy=order-item-email]').should('contain', 'example@hotdeals.dev');
        cy.get('[data-cy=order-item-design-item]').should('have.length', 2);
        cy.get('[data-cy=order-item-design-item]')
          .first()
          .within(() => {
            cy.get('[data-cy=order-item-design-item-amount]').should('contain', '2');
          });
      });
  });
  it('should show design when clicking on the view button', () => {
    cy.intercept('GET', '/designs/me/' + mockDesign.designId, {
      body: mockDesign,
      statusCode: 200,
    });
    cy.get('[data-cy=order-item]').should('have.length', 2);
    cy.get('[data-cy=order-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=order-item-design-item]')
          .first()
          .within(() => {
            cy.get('[data-cy=order-item-view-button]').click({ force: true });
            cy.url().should('contain', '/product?designId=' + mockDesign.designId);
          });
      });
  });
  // TODO: add this test once the "complete payment" function has been implemented
  it('should contain complete payment button when state is unpayed/initial', () => {});
});
