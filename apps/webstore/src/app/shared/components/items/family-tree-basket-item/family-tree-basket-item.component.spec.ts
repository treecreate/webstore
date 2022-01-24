import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TreeDesignEnum } from '@assets';
import { DesignDimensionEnum, DesignTypeEnum, FamilyTreeFontEnum, ITransactionItem, IUser } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars, UserRoles } from '@models';
import { FamilyTreeBasketItemComponent } from './family-tree-basket-item.component';

describe('BasketItemComponent', () => {
  let component: FamilyTreeBasketItemComponent;
  let fixture: ComponentFixture<FamilyTreeBasketItemComponent>;
  let localStorage: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [FamilyTreeBasketItemComponent],
      providers: [LocalStorageService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeBasketItemComponent);
    localStorage = TestBed.inject(LocalStorageService);
    component = fixture.componentInstance;

    //mock the transaction item
    const mockUser: IUser = {
      userId: '1',
      email: 'mock@hotdeals.dev',
      roles: [UserRoles.user],
    };

    const mockTransactionItem: ITransactionItem = {
      design: {
        designId: '1',
        designProperties: {
          title: 'Mock 1',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree1,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.small,
      quantity: 1,
      orderId: '123',
      transactionItemId: '1',
    };
    localStorage.setItem(LocalStorageVars.transactionItems, [mockTransactionItem]);
    component.item = mockTransactionItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase the Dimension', () => {
    expect(component.item.dimension).toEqual(DesignDimensionEnum.small);
    component.increaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.medium);
    component.increaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
    component.increaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
  });

  it('should decrease the Dimension', () => {
    component.item.dimension = DesignDimensionEnum.large;
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
    component.decreaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.medium);
    component.decreaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.small);
    component.decreaseDimension();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.small);
  });

  it('should increase quantity', () => {
    expect(component.item.quantity).toEqual(1);
    component.increaseQuantity();
    expect(component.item.quantity).toEqual(2);
    component.increaseQuantity();
    expect(component.item.quantity).toEqual(3);
    component.increaseQuantity();
  });

  it('should decrease quantity', () => {
    component.item.quantity = 3;
    expect(component.item.quantity).toEqual(3);
    component.decreaseQuantity();
    expect(component.item.quantity).toEqual(2);
    component.decreaseQuantity();
    expect(component.item.quantity).toEqual(1);
    component.decreaseQuantity();
    expect(component.item.quantity).toEqual(1);
  });
});
