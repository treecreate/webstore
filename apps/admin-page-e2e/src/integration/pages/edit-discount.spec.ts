import { DiscountType, IDiscount } from '@interfaces';
import { LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const mockDiscount: IDiscount = {
  discountId: '123',
  discountCode: 'yeet10percent',
  amount: 10,
  type: DiscountType.percent,
  remainingUses: 2,
  isEnabled: true,
  totalUses: 1,
};

const authMockService = new AuthenticationService();

describe('editDiscountPage', () => {
  beforeEach(() => {
    localStorage.setItem(LocalStorageVars.authUser, JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser)));

    cy.intercept('GET', 'discounts/123/id', {
      body: mockDiscount,
      statusCode: 200,
    }).as('fetchDiscounts');

    cy.visit('/discounts/123');
  });

  it('should display the back button', () => {
    cy.get('[data-cy=back-btn]').should('exist');
  });

  it('should display the edit discount card', () => {
    cy.get('[data-cy=edit-discount-card]').should('exist');
  });

  it('should display the discount details card header', () => {
    cy.get('[data-cy=edit-discount-header]').should('exist');
    cy.get('[data-cy=edit-discount-header]').contains('Discount id: ' + mockDiscount.discountId);
  });

  describe('discount-info-section', () => {
    it('should display the discount information', () => {
      cy.get('[data-cy=edit-discount-info]').should('exist');
      cy.get('[data-cy=edit-discount-info]').contains('Discount code');
      cy.get('[data-cy=edit-discount-info]').contains('Uses left');
      cy.get('[data-cy=edit-discount-info]').contains('Expiration date');
      cy.get('[data-cy=edit-discount-info]').contains('Amount');
      cy.get('[data-cy=edit-discount-info]').contains('Type');
      cy.get('[data-cy=edit-discount-info]').contains('Start date for discount');

      cy.get('[data-cy=discount-code]').should('have.value', mockDiscount.discountCode);
      cy.get('[data-cy=discount-uses-left]').should('have.value', mockDiscount.remainingUses);
      cy.get('[data-cy=discount-amount]').should('have.value', mockDiscount.amount);
      if (mockDiscount.expiresAt) {
        cy.get('[data-cy=discount-expiration]').should(
          'have.value',
          new Date(mockDiscount.expiresAt).toLocaleDateString()
        );
      }
      if (mockDiscount.createdAt) {
        cy.get('[data-cy=discount-start-date]').should(
          'have.value',
          new Date(mockDiscount.createdAt).toLocaleDateString()
        );
      }
    });
  });

  describe('actions-section', () => {
    it('should display the actions', () => {
      cy.get('[data-cy=actions-section]').should('exist');
      cy.get('[data-cy=actions-section]').contains('Update');
      cy.get('[data-cy=actions-section]').contains('Active');
      cy.get('[data-cy=actions-section]').contains('Delete');
    });
  });

  describe.only('update discount', () => {
    it('update button should be disabled for unchanged discount information', () => {
      cy.get('[data-cy=update-discount-btn]').should('be.disabled');
    });

    it('update button should be disabled for invalid discount information', () => {
      cy.get('[data-cy=discount-amount]').type('-1');
      cy.get('[data-cy=update-discount-btn]').should('be.disabled');
    });

    it('should update discount information', () => {
      const updatedDiscountCode = 'Update Discount Code';
      cy.intercept('PATCH', 'discounts/123', {
        body: { ...mockDiscount, discountCode: updatedDiscountCode },
        statusCode: 200,
      }).as('updateDiscount');
      cy.get('[data-cy=update-discount-btn]').should('be.disabled');
      cy.get('[data-cy=discount-code]').clear().type(updatedDiscountCode);
      cy.get('[data-cy=update-discount-btn]').should('be.enabled').click();
      cy.get('[data-cy=discount-code]').invoke('val').should('eq', updatedDiscountCode);
      cy.get('[data-cy=update-discount-btn]').should('be.disabled');
      cy.get('simple-snack-bar').should('contain', 'updated');
    });

    it('should display a snackbar and keep update btn enabled on failed update', () => {
      const updatedDiscountCode = 'Update Discount Code';
      cy.intercept('PATCH', 'discounts/123', {
        body: { message: 'discount code is already used' },
        statusCode: 400,
      }).as('UpdateDiscountDuplicate');
      cy.get('[data-cy=update-discount-btn]').should('be.disabled');
      cy.get('[data-cy=discount-code]').clear().type(updatedDiscountCode);
      cy.get('[data-cy=update-discount-btn]').should('be.enabled').click();
      cy.get('[data-cy=discount-code]').invoke('val').should('eq', updatedDiscountCode);
      cy.get('[data-cy=update-discount-btn]').should('be.enabled');
      cy.get('simple-snack-bar').should('contain', 'discount code is already used');
    });

    it('should toggle discount status correctly', () => {
      cy.intercept('PATCH', 'discounts/123', {
        body: { ...mockDiscount, isEnabled: false },
        statusCode: 200,
        times: 1,
      }).as('updateDiscountStatusFalse');
      cy.get('[data-cy=toggle-discount-status-btn]').should('be.enabled').click();
      cy.get('[data-cy=toggle-discount-status-btn]').contains('Deactivated');
      cy.get('simple-snack-bar').should('contain', 'deactivated');
      cy.intercept('PATCH', 'discounts/123', {
        body: { ...mockDiscount, isEnabled: true },
        statusCode: 200,
        times: 1,
      });
      cy.get('[data-cy=toggle-discount-status-btn]').should('be.enabled').click();
      cy.get('[data-cy=toggle-discount-status-btn]').contains('Active');
      cy.get('simple-snack-bar').should('contain', 'activated');
    });

    it('should display a snackbar on failed toggle of discount status', () => {
      cy.intercept('PATCH', 'discounts/123', {
        body: {},
        statusCode: 400,
        times: 1,
      });
      cy.get('[data-cy=toggle-discount-status-btn]').should('be.enabled').click();
      cy.get('[data-cy=toggle-discount-status-btn]').contains('Active');
      cy.get('simple-snack-bar').should('contain', 'Failed');
      cy.get('[data-cy=toggle-discount-status-btn]').should('be.enabled');
    });
  });
});
