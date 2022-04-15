import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, DesignTypeEnum, IDesign, IQoutable } from '@interfaces';
import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const quotableDesing: IQoutable = {
  font: DesignFontEnum.archaMedium,
  fontSize: 40,
  designSrc: QuotableDesignEnum.frame2,
  text: 'skrt skrt',
};
const mockQuotableDesign: IDesign = {
  designId: 'MOCK_ID',
  designProperties: quotableDesing,
  mutable: true,
  user: null,
  designType: DesignTypeEnum.quotable,
};

describe('QuotableProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.visit('/products/quotable');
  });

  describe('Option settings', () => {
    it('has the correct default settings', () => {
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame1.svg');
      cy.get('[data-cy=font-size]').should('contain', '40');
      cy.get('[data-cy=text]').should('contain', 'Lorem Ipsum');
    });

    it('next design changes the design correctly', () => {
      // Assert
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame1.svg');

      // Act
      cy.get('[data-cy=next-design-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame2.svg');
    });

    it('previous design changes the design correctly', () => {
      // Assert
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame1.svg');

      // Act
      cy.get('[data-cy=prev-design-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame0-no-design.svg');
    });

    it('changes the font correctly', () => {
      // Assert
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');

      // Act
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });

      // Expect
      cy.get('[data-cy=font]').should('not.have.text', 'bairol-bold-italic');
      cy.get('[data-cy=font]').should('have.text', 'calendas-italic');
    });

    it('changes the font size correctly', () => {
      // Assert
      cy.get('[data-cy=font-size]').should('contain', '40');

      // Act
      const arrows = '{rightarrow}'.repeat(20);
      cy.get('[data-cy=font-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });

      // Assert
      cy.get('[data-cy=font-size]').should('contain', '60');
    });

    it('should change the text correctly', () => {
      // Assert
      cy.get('[data-cy=text]').should('contain', 'Lorem Ipsum');

      // Act
      cy.get('[data-cy=text-input-field]').clear().type('skrt skrt skrt');

      // Expect
      cy.get('[data-cy=text]').should('contain', 'skrt skrt skrt');
    });
  });

  describe('Unauthenticated user actions', () => {
    it('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
      cy.visit('/products/quotable?designId=c0a80121-7ac0-190b-817a-c08ab0a12345');
      cy.get('[data-cy=text]').should('contain', 'Lorem Ipsum');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame1.svg');
    });

    it('should get quotable design from localstorage', () => {
      localStorage.setItem(LocalStorageVars.designQuotable, JSON.stringify(quotableDesing));
      cy.visit('/products/quotable');
      cy.get('[data-cy=text]').should('contain', 'skrt skrt');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame2.svg');
    });
  });

  describe('Option settings', () => {});

  describe.skip('Logged in user actions', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
      );
    });

    it('Fetches design based of id in url', () => {
      // TODO: Create intercept with id
      // TODO: Check that the desing is set
    });

    it('Fetches design from localstorage when there is no id in url', () => {
      localStorage.setItem(LocalStorageVars.designQuotable, JSON.stringify(quotableDesing));
      // TODO: Check that the design is set
    });

    it('Saves design to user account and localstorage when logged in', () => {
      // TODO: Create intercept for saving design
      // TODO: Go to collection page
      // TODO: Check that design has been saved properly
    });
  });
});
