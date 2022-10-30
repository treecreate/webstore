import { CookieStatus, LocalStorageVars } from '@models';

describe('PetSignProductPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.cookiesAccepted, `"${CookieStatus.accepted}"`);
    localStorage.setItem(LocalStorageVars.firstVisit, 'true');
    cy.visit('/products/pet-sign');
  });

  describe('Pet Sign product page', () => {
    it('has the correct default settings', () => {
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');
      cy.get('[data-cy=text]').should('contain', '');
      cy.get('[data-cy=title]').should('contain', '');
    });

    it('changes the frame correctly', () => {
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame0-no-design.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame3.svg');

      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame2.svg');
    });

    it('goes to the right frame when pressing next', () => {
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame2.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame3.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame0-no-design.svg');

      cy.get('[data-cy=next-design-button]').click({ force: true });
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');
    });

    it('resets to the correct values', () => {
      // Assert
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');

      // Act
      cy.get('[data-cy=prev-design-button]').click({ force: true });
      cy.get('[data-cy=font-select-option]')
        .click()
        .then(() => {
          cy.get('button').contains('calendasItalic').click();
        });
      cy.get('[data-cy=font]').should('have.text', 'calendas-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame0-no-design.svg');
      cy.get('[data-cy=reset-button]').click({ force: true });

      // Expect
      cy.get('[data-cy=font]').should('contain', 'bairol-bold-italic');
      cy.get('[data-cy=design]').should('contain', 'assets/pet-sign/frame-design/frame1.svg');
    });
  });
});
