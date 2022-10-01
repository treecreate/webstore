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
    it.skip('has the correct default settings', () => {
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');
      cy.get('[data-cy=font-size]').should('contain', '40');
      cy.get('[data-cy=text]').should('contain', 'Din tekst');
    });

    it.skip('next design changes the design correctly', () => {
      // Assert
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');

      // Act
      cy.get('[data-cy=next-design-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame2.svg');
    });

    it.skip('previous design changes the design correctly', () => {
      // Assert
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');

      // Act
      cy.get('[data-cy=prev-design-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame0-no-design.svg');
    });

    it.skip('changes the font correctly', () => {
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

    it.skip('changes the font size correctly', () => {
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

    it.skip('should change the text correctly', () => {
      // Assert
      cy.get('[data-cy=text]').should('contain', 'Din tekst');

      // Act
      cy.get('[data-cy=text-input-field]').clear().type('skrt skrt skrt');

      // Expect
      cy.get('[data-cy=text]').should('contain', 'skrt skrt skrt');
    });
  });

  describe('Unauthenticated user actions', () => {
    it.skip('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
      cy.visit('/products/quotable?designId=c0a80121-7ac0-190b-817a-c08ab0a12345');
      cy.get('[data-cy=text]').should('contain', 'Din tekst');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');
    });

    it.skip('should get quotable design from localstorage', () => {
      localStorage.setItem(LocalStorageVars.designQuotable, JSON.stringify(quotableDesing));
      cy.visit('/products/quotable');
      cy.get('[data-cy=text]').should('contain', 'skrt skrt');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame2.svg');
    });

    it.skip('saves to localstorage properly', () => {
      // Assert
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');
      cy.get('[data-cy=font-size]').should('contain', '40');
      cy.get('[data-cy=text]').should('contain', 'Din tekst');

      // Act
      // Change design
      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });
      const arrows = '{rightarrow}'.repeat(20);
      cy.get('[data-cy=font-size-slider]').within(() => {
        cy.get('[role=slider]').focus().type(arrows);
      });
      cy.get('[data-cy=text-input-field]').clear().type('skrt skrt skrt');
      // Save to localstorage
      cy.get('[data-cy=save-button]').click({ force: true });
      // Leave page and return to page
      cy.visit('/basket');
      cy.visit('/products/quotable');

      // Expect
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame2.svg');
      cy.get('[data-cy=font-size]').should('contain', '60');
      cy.get('[data-cy=font]').should('have.text', 'calendas-italic');
      cy.get('[data-cy=text]').should('contain', 'skrt skrt skrt');
    });

    it.skip('resets design properly', () => {
      // Assert
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');

      // Act
      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });
      cy.get('[data-cy=font]').should('have.text', 'calendas-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame0-no-design.svg');
      cy.get('[data-cy=reset-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame1.svg');
    });
  });

  describe('Logged in user actions', () => {
    beforeEach(() => {
      localStorage.setItem(
        LocalStorageVars.authUser,
        JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUserRoleDeveloper))
      );
    });

    it.skip('Fetches design based of id in url', () => {
      cy.intercept('GET', '/designs/me/c0a80121-7ac0-190b-817a-c08ab0a12345', {
        body: mockQuotableDesign,
        statusCode: 200,
      });
      cy.visit('/products/quotable?designId=c0a80121-7ac0-190b-817a-c08ab0a12345');

      cy.get('[data-cy=font]').should('contain', 'archia-medium');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame2.svg');
    });

    it.skip('Fetches design from localstorage when there is no id in url', () => {
      localStorage.setItem(LocalStorageVars.designQuotable, JSON.stringify(quotableDesing));
      cy.visit('/products/quotable');
      cy.get('[data-cy=font]').should('contain', 'archia-medium');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/quotable/frame2.svg');
      cy.get('[data-cy=font-size]').should('contain', '40');
      cy.get('[data-cy=text]').should('contain', 'skrt skrt');
    });
  });
});
