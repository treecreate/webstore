import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeDesignEnum } from '@assets';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  FamilyTreeFontEnum,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { UserRoles } from '@models';
import { BasketItemComponent } from './basket-item.component';

describe('BasketItemComponent', () => {
  let component: BasketItemComponent;
  let fixture: ComponentFixture<BasketItemComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [BasketItemComponent],
      //   imports: [CalculatePriceService]
    }); // .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketItemComponent);
    component = fixture.componentInstance;

    //mock the transaction item
    const mockUser: IUser = {
      userId: '1',
      email: 'mock@hotdeals.dev',
      roles: [UserRoles.user],
      isVerified: true,
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
      order: null,
      transactionItemId: '1',
    };

    component.item = mockTransactionItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase the size', () => {
    expect(component.item.dimension).toEqual(DesignDimensionEnum.small);
    component.increaseSize();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.medium);
    component.increaseSize();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
    component.increaseSize();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
  });

  it('should decrease the size', () => {
    component.item.dimension = DesignDimensionEnum.large;
    expect(component.item.dimension).toEqual(DesignDimensionEnum.large);
    component.decreaseSize();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.medium);
    component.decreaseSize();
    expect(component.item.dimension).toEqual(DesignDimensionEnum.small);
    component.decreaseSize();
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
