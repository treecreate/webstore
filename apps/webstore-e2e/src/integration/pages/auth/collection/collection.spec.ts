import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { DesignTypeEnum, DesignFontEnum, IDesign, IDraggableBox, IFamilyTreeBanner, IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

describe('CollectionPage', () => {
  const authMockService = new AuthenticationService();
  const mockUser: IUser = {
    userId: '1c1ca614-6600-4e61-aec5-8e6143b1',
    email: 'suckmeoff@test.com',
    roles: [{ name: UserRoles.user, roleId: '' }],
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
  const mockDesign2: IDesign = {
    designId: 'c0a121-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      font: DesignFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      boxes: [mockDraggableBoxTwo],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  const mockDesign3: IDesign = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      font: DesignFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      boxes: [mockDraggableBoxOne],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: true,
  };
  const mockDesign4: IDesign = {
    designId: 'c0a1-7ac0-190b-817a-c08ab0a12345',
    designProperties: {
      font: DesignFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: mockBanner,
      boxes: [mockDraggableBoxOne],
    },
    designType: DesignTypeEnum.familyTree,
    user: mockUser,
    mutable: false,
  };

  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));
    cy.intercept('GET', '/users/me', {
      body: mockUser,
      statusCode: 200,
    });
    cy.visit('/profile');
  });

  it('should display the no-designs page if the list is empty', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-no-items]').should('exist');
    cy.get('[data-cy=collection-no-items-start-button]').click();
    cy.url().should('contain', '/product');
  });

  it('Should display all mutable deisgns properly', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-no-items]').should('not.exist');
    cy.get('[data-cy=family-tree-collection-item]').then((designs) => {
      /* eslint-disable  @typescript-eslint/no-unused-expressions */
      expect(designs[0]).exist;
      expect(designs[1]).exist;
      expect(designs[2]).exist;
      expect(designs[3]).not.exist; // The un mutable item
    });
  });

  it('should remove an item from the list when delete is clicked', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.intercept('DELETE', `/designs/${mockDesign1.designId}`, {
      statusCode: 204,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]').should('have.length', 3);
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=family-tree-collection-item-delete-button]').click();
      })
      .then(() => {
        cy.get('[data-cy=family-tree-collection-item]').should('have.length', 2);
      });
  });

  it('should go into edit mode when clicking edit', () => {
    // For product
    cy.intercept('GET', `/designs/me/${mockDesign1.designId}`, {
      body: mockDesign1,
      statusCode: 200,
    });
    // For collection
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=family-tree-collection-item-edit-button]').click();
      })
      .then(() => {
        cy.url().should('contain', '/product?designId=');
        cy.get('[data-cy=product-options]').should('exist');
      });
  });

  it('should open the addToBasket modal with the correct design', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=family-tree-collection-item]')
      .first()
      .within(() => {
        cy.get('[data-cy=family-tree-collection-item-add-to-basket-button]').click();
      });
  });

  it('should redirect to profile', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-profile-button]').click();
    cy.url().should('contain', '/profile');
  });

  it('should redirect to product', () => {
    cy.intercept('GET', `/designs/me`, {
      body: [mockDesign1, mockDesign2, mockDesign3, mockDesign4],
      statusCode: 200,
    });
    cy.visit('/collection');
    cy.get('[data-cy=collection-create-new-button]').click();
    cy.url().should('contain', '/product');
  });
});
