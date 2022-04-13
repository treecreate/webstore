import { BoxDesignEnum, QuotableDesignEnum, TreeDesignEnum } from '@assets';
import { DesignFontEnum, DesignTypeEnum, IDesign, IFamilyTree, IQoutable } from '@interfaces';
import { CookieStatus, LocalStorageVars } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();
const quotableDesing: IQoutable = {
  font: DesignFontEnum.archaMedium,
  fontSize: 40,
  designSrc: QuotableDesignEnum.frame1,
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
    cy.visit('/catalog/quotable');
  });

  it('should not get to fetch design based on the id when accessing the products page as an unauthenticated user', () => {
    localStorage.setItem(LocalStorageVars.designQuotable, JSON.stringify(quotableDesing));
    cy.visit('/catalog/quotable');
  });
});
