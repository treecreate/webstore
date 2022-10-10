import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, DesignTypeEnum, IDesign, IQoutable } from '@interfaces';
import { CookieStatus, LocalStorageVars } from '@models';

const quotableDesing: IQoutable = {
  font: DesignFontEnum.archaMedium,
  fontSize: 40,
  designSrc: QuotableDesignEnum.frame2,
  text: 'skrt skrt',
  title: 'wow',
  showText: true,
  showTitle: true,
};
const mockQuotableDesign: IDesign = {
  designId: 'MOCK_ID',
  designProperties: quotableDesing,
  mutable: true,
  user: null,
  designType: DesignTypeEnum.quotable,
};

describe('BabySignProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.visit('/products/quotable?productType=BABY_SIGN');
  });

  describe('Baby sign product page', () => {
    it('has the correct default settings', () => {
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame19.svg');
      cy.get('[data-cy=font-size]').should('contain', '40');
      cy.get('[data-cy=text]').should('contain', '');
      cy.get('[data-cy=title]').should('contain', '');
      cy.get('[data-cy=show-text]').should('contain', 'true');
      cy.get('[data-cy=show-title]').should('contain', 'true');
    });

    it('changes the frame correctly', () => {
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame19.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame0-no-design.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame22.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame21.svg');
    });

    it('goes to the right frame when pressing next', () => {
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame19.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame18.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame20.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame21.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame22.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/frame0-no-design.svg');
    });

    it('resets to the correct values', () => {
      // Assert
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame19.svg');

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
      cy.get('[data-cy=design]').should('contain', 'assets/quotable/frame-design/baby-sign/frame19.svg');
    });
  });
});
