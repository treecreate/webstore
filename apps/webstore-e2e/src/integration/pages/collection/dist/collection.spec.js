'use strict';
exports.__esModule = true;
var _assets_1 = require('@assets');
var _interfaces_1 = require('@interfaces');
var _models_1 = require('@models');
var mocks_1 = require('@webstore/mocks');
describe('CollectionPage', function () {
  var authMockService = new mocks_1.AuthenticationService();
  var mockUser = {
    userId: '1c1ca614-6600-4e61-aec5-8e6143b1',
    email: 'suckmeoff@test.com',
    roles: [_models_1.UserRoles.user],
    isVerified: true,
    name: 'macSackMyD*ck',
    phoneNumber: '+4512345678',
    streetAddress: 'Yo mammas house 69, 3rd floor',
    streetAddress2: 'more details: suck it',
    city: 'Copenhagen',
    postcode: '1234',
    country: 'DK what u think',
  };
  var mockDraggableBoxOne = {
    x: 400,
    y: 400,
    previousX: 0,
    previousY: 0,
    dragging: false,
    boxDesign: _assets_1.BoxDesignEnum.box1,
    text: 'teo',
  };
  var mockDraggableBoxTwo = {
    x: 200,
    y: 200,
    previousX: 100,
    previousY: 100,
    dragging: false,
    boxDesign: _assets_1.BoxDesignEnum.box2,
    text: 'dor',
  };
  var mockBanner = {
    text: 'my tree 1',
    style: 'first',
  };
  var mockDesign1 = {
    designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title1',
      font: _interfaces_1.FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: _assets_1.TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxOne, mockDraggableBoxTwo],
    },
    designType: _interfaces_1.DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  var mockDesign2 = {
    designId: 'c0a121-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title2',
      font: _interfaces_1.FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: _assets_1.TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxTwo],
    },
    designType: _interfaces_1.DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  var mockDesign3 = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title3',
      font: _interfaces_1.FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: _assets_1.TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxOne],
    },
    designType: _interfaces_1.DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  var mockDesign4 = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      title: 'title3',
      font: _interfaces_1.FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: _assets_1.TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      largeFont: false,
      boxes: [mockDraggableBoxOne],
    },
    designType: _interfaces_1.DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: false,
  };
  var mockOrder = {
    orderId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    purchaseStatus: '',
    discountCode: {
      amount: 100,
      type: _interfaces_1.DiscountType.amount,
    },
    initialPrice: 1000,
    finalPrice: 900,
    currency: 'DK',
    createdAt: 'today',
  };
  beforeEach(function () {
    localStorage.setItem(
      _models_1.LocalStorageVars.cookiesAccepted,
      '"' + _models_1.CookieStatus.accepted + '"'
    );
    localStorage.setItem(
      _models_1.LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(mocks_1.AuthUserEnum.authUser))
    );
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    cy.visit('/profile');
  });
  it('should display the no-designs page if the list is empty', function () {
    cy.intercept('GET', '/designs/me', {
      body: [],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-no-items]').should('exist');
    cy.get('[data-cy=collection-no-items-start-button]').click();
    cy.url().should('contain', '/product');
  });
  it('Should display all mutable deisgns properly', function () {
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-no-items]').should('not.exist');
    cy.get('[data-cy=family-tree-collection-item]').then(function (designs) {
      /* eslint-disable  @typescript-eslint/no-unused-expressions */
      expect(designs[0]).exist;
      expect(designs[1]).exist;
      expect(designs[2]).exist;
      expect(designs[3]).not.exist; //The un mutable item
    });
  });
  it('should remove an item from the list when delete is clicked', function () {
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.intercept('DELETE', '/designs/' + mockDesign1.designId, {
      statusCode: 204,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]').then(function (designs) {
      expect(designs[0]).exist;
      expect(designs[1]).exist;
      expect(designs[2]).exist;
    });
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(function () {
        cy.get('[data-cy=family-tree-collection-item-delete-button]').click();
      })
      .then(function () {
        cy.get('[data-cy=family-tree-collection-item]').then(function (
          designs
        ) {
          expect(designs[0]).exist;
          expect(designs[1]).exist;
          expect(designs[2]).not.exist;
        });
      });
  });
  it('should go into edit mode when clicking edit', function () {
    // For product
    cy.intercept('GET', '/designs/me/' + mockDesign1.designId, {
      body: mockDesign1,
      statusCode: 200,
    });
    // For collection
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(function () {
        cy.get('[data-cy=family-tree-collection-item-edit-button]').click();
      })
      .then(function () {
        cy.url().should('contain', '/product?designId=');
        cy.get('[data-cy=product-options]').should('exist');
      });
  });
  it('should open the addToBasket modal with the correct design', function () {
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(function () {
        cy.get(
          '[data-cy=family-tree-collection-item-add-to-basket-button]'
        ).click();
      })
      .then(function () {
        cy.get('[data-cy=add-to-basket-title-input]').should(
          'have.value',
          'title1'
        );
      });
  });
  it('should redirect to profile', function () {
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-profile-button]').click();
    cy.url().should('contain', '/profile');
  });
  it('should redirect to product', function () {
    cy.intercept('GET', '/designs/me', {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-create-new-button]').click();
    cy.url().should('contain', '/product');
  });
});
