import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import { FamilyTreeFontEnum, IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
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

const mockDesign = {
  title: 'title',
  font: FamilyTreeFontEnum.roboto,
  backgroundTreeDesign: TreeDesignEnum.tree1,
  boxSize: 20,
  banner: {
    text: 'my tree',
    style: 'first',
  },
  largeFont: false,
  boxes: [
    {
      x: 400,
      y: 400,
      previousX: 0,
      previousY: 0,
      dragging: false,
      boxDesign: BoxDesignEnum.box1,
      text: 'teo',
    },
    {
      x: 200,
      y: 200,
      previousX: 91,
      previousY: 91,
      dragging: false,
      boxDesign: BoxDesignEnum.box2,
      text: 'teodor',
    },
  ],
};

describe('ProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(
      LocalStorageVars.cookiesAccepted,
      `"${CookieStatus.accepted}"`
    );
    cy.visit('/product');
  });

  it.skip('It should display the notSignedIn page when user isnt logged in', () => {
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.url().should('contain', '/notSignedIn');
    cy.get('[data-cy=not-signed-in-product-button]').click();
    cy.url().should('contain', '/product');
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.get('[data-cy=not-signed-in-login-button]').click();
  });

  it.skip('It should not display notSignedIn page when user is logged in', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
    );
    cy.visit('/home');
    cy.get('[data-cy=navbar-product-page-button]').click();
    cy.url().should('contain', '/product');
  });

  it.skip('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
    localStorage.setItem(
      LocalStorageVars.authUser,
      JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserInvalid))
    );
    cy.visit('/product');

    cy.intercept('GET', '/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345', {
      statusCode: 401,
    });

    //cy.request('/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345');
    //TODO: try fetching a design based on id with an intercept
  });

  describe('DesignOptions', () => {
    let localStorageDesign;

    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      localStorage.setItem(
        LocalStorageVars.designFamilyTree,
        JSON.stringify(mockDesign)
      );
      localStorageDesign = JSON.parse(
        localStorage.getItem(LocalStorageVars.designFamilyTree)
      );
      cy.visit('/product');

      cy.intercept('POST', '/designs', {
        statusCode: 200,
      });
    });

    it.skip('should be able to click on the canvas and create a new box', () => {
      cy.wrap(localStorageDesign).its('boxes').should('have.length', 2);
      cy.get('[data-cy=family-tree-canvas]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        console.warn('After design: ', localStorageDesignAfter);
        cy.wrap(localStorageDesignAfter).its('boxes').should('have.length', 3);
      });
    });

    it.skip('should be able to change the fonts', () => {
      cy.wrap(localStorageDesign).its('font').should('equal', 'Roboto');
      cy.get('[data-cy=font-next-btn]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('font').should('equal', 'Georgia');
      });
    });

    it.skip('should be able to change the design', () => {
      cy.wrap(localStorageDesign)
        .its('backgroundTreeDesign')
        .should('equal', TreeDesignEnum.tree1);
      cy.get('[data-cy=design-arrow-left]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter)
          .its('backgroundTreeDesign')
          .should('equal', TreeDesignEnum.tree2);
      });
    });

    it.skip('should increase box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 22);
      });
    });

    it.skip('should decrease box size and save it', () => {
      cy.wrap(localStorageDesign).its('boxSize').should('equal', 20);
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('boxSize').should('equal', 18);
      });
    });

    it.skip('should be able to change the banner', () => {
      cy.wrap(localStorageDesign).its('banner.text').should('equal', 'my tree');
      cy.get('[data-cy=design-banner-input]').clear();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter)
          .its('banner.text')
          .should('equal', 'test');
      });
    });
    it.skip('should be able to change large font', () => {
      cy.wrap(localStorageDesign).its('largeFont').should('equal', false);
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=save-family-tree-button]').click();
      cy.visit('/product').then(() => {
        const localStorageDesignAfter = JSON.parse(
          localStorage.getItem(LocalStorageVars.designFamilyTree)
        );
        cy.wrap(localStorageDesignAfter).its('largeFont').should('equal', true);
      });
    });

    it.skip('should be able to load a design via url', () => {
      //TODO: intercept loading a design with url
      // cy.intercept('GET', '/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345', {
      //   body: {
      //     designId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
      //     designProperties: mockDesign,
      //     designType: 'FAMILY_TREE',
      //     user: mockUser,
      //   },
      //   statusCode: 200,
      // });
      // cy.visit('/product');
      // cy.request('/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345');
    });
  });
  describe('AddToBasketModal', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
      cy.visit('/product');
    })
    it.skip('should have add-to-basket button redirect to login when not logged in', () => {
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

    it.skip('should open add-to-basket modal when user is logged in', () => {
      cy.get('[data-cy=add-to-basket-button]').click();
      cy.get('[data-cy=add-to-basket-modal]').should('exist');
    });

    it('should have the title written if it is in the product page', () => {
      cy.get('[data-cy=design-title-input]').clear({force: true}); 
      cy.get('[data-cy=design-title-input]').type('family tree', { force: true });
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

  describe.skip('Unauthorised', () => {
    // box-size buttons
    it('should contain a navbar and footer', () => {
      cy.get('[data-cy=navbar]').should('exist');
      cy.get('[data-cy=footer]').should('exist');
    });

    it('should have a box-size of 20', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
    });

    it('should increase box size when + is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-plus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '21');
    });

    it('should decrease box size when - is pressed in options', () => {
      cy.get('[data-cy=box-size]').should('have.text', '20');
      cy.get('[data-cy=box-size-minus]').click();
      cy.get('[data-cy=box-size]').should('have.text', '19');
    });

    it('should not increase box size above 40', () => {
      cy.get('[data-cy=box-size-plus]').should('not.be.disabled');
      for (let i = 0; i < 20; i++) {
        cy.get('[data-cy=box-size-plus]').click();
      }
      cy.get('[data-cy=box-size]')
        .invoke('text')
        .then(parseFloat)
        .should('not.be.above', 40);
      cy.get('[data-cy=box-size-plus]').should('be.disabled');
    });

    it('should not decrease box size below 10', () => {
      cy.get('[data-cy=box-size-minus]').should('not.be.disabled');
      for (let i = 0; i < 10; i++) {
        cy.get('[data-cy=box-size-minus]').click();
      }
      cy.get('[data-cy=box-size]')
        .invoke('text')
        .then(parseFloat)
        .should('not.be.lt', 10);
      cy.get('[data-cy=box-size-minus]').should('be.disabled');
    });

    // Font change
    it('should change the font', () => {
      cy.get('[data-cy=font]').should('have.text', 'Times new roman');
      cy.get('[data-cy=font-next-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Roboto');
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font-prev-btn]').click();
      cy.get('[data-cy=font]').should('have.text', 'Sansita');
    });

    // Banner
    it('should show/remove banner', () => {
      // for some reason, cypress reads the value with extra spaces
      cy.get('[data-cy=banner]').should('have.text', '  ');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=design-banner-input]').type('test');
      cy.get('[data-cy=banner]').should('have.text', ' test ');
      cy.get('[data-cy=checkbox-banner]').click();
      cy.get('[data-cy=banner]').should('have.text', '  ');
    });

    // Big font
    it('should show/remove large-font', () => {
      cy.get('[data-cy=large-font]').should('have.text', 'false');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'true');
      cy.get('[data-cy=checkbox-large-font]').click();
      cy.get('[data-cy=large-font]').should('have.text', 'false');
    });
  });
});
