import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  CurrencyEnum,
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTreeBanner,
  IOrder,
  ITransactionItem,
  IUser,
  PaymentStateEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { UserRoles } from '@models';
import { OrderService } from '../../../shared/services/order/order.service';

@Component({
  selector: 'webstore-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  mockUser: IUser = {
    userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    email: 'e2e@test.com',
    roles: [UserRoles.user, UserRoles.admin, UserRoles.developer],
    isVerified: true,
    name: 'teodor jonasson',
    phoneNumber: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    country: '',
  };
  mockDraggableBoxOne: IDraggableBox = {
    x: 400,
    y: 400,
    previousX: 0,
    previousY: 0,
    dragging: false,
    boxDesign: BoxDesignEnum.box1,
    text: 'teo',
  };
  mockDraggableBoxTwo: IDraggableBox = {
    x: 200,
    y: 200,
    previousX: 100,
    previousY: 100,
    dragging: false,
    boxDesign: BoxDesignEnum.box2,
    text: 'dor',
  };
  mockBanner: IFamilyTreeBanner = {
    text: 'my tree 1',
    style: 'first',
  };
  mockDesign: IDesign = {
    designId: 'c0a80868-7ce1-1ed0-817c-f9f1e8850001',
    designProperties: {
      title: 'title1',
      font: FamilyTreeFontEnum.roboto,
      backgroundTreeDesign: TreeDesignEnum.tree1,
      boxSize: 20,
      banner: this.mockBanner,
      largeFont: false,
      boxes: [this.mockDraggableBoxOne, this.mockDraggableBoxTwo],
    },
    designType: DesignTypeEnum.familyTree,
    user: this.mockUser,
    mutable: true,
  };
  mockDesign2: IDesign = {
    designId: 'c0a80868-7ce1-1ed0-817c-f9f1e8850001',
    designProperties: {
      title: 'title2',
      font: FamilyTreeFontEnum.georgia,
      backgroundTreeDesign: TreeDesignEnum.tree2,
      boxSize: 20,
      banner: this.mockBanner,
      largeFont: false,
      boxes: [this.mockDraggableBoxOne, this.mockDraggableBoxTwo],
    },
    designType: DesignTypeEnum.familyTree,
    user: this.mockUser,
    mutable: true,
  };
  mockTransactionItem: ITransactionItem = {
    transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    dimension: DesignDimensionEnum.small,
    quantity: 1,
    design: this.mockDesign2,
  };
  mockTransactionItemTwo: ITransactionItem = {
    transactionItemId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    orderId: 'c0a80121-7ac0-190b-817a-c08ab0a12345',
    dimension: DesignDimensionEnum.medium,
    quantity: 2,
    design: this.mockDesign,
  };
  mockOrder: IOrder = {
    paymentState: PaymentStateEnum.pending,
    billingInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    contactInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    createdAt: new Date(),
    currency: CurrencyEnum.dkk,
    discount: {
      discountCode: 'suck it',
      type: DiscountType.amount,
      amount: 100,
      remainingUses: 1,
      totalUses: 2,
    },
    orderId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    plantedTrees: 1,
    shippingMethod: ShippingMethodEnum.homeDelivery,
    //State    -- not implemented
    subtotal: 1000,
    total: 900,
    transactionItems: [this.mockTransactionItemTwo, this.mockTransactionItem],
    userID: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  };

  isLoading = false;
  orderCollection: IOrder[] = [];

  constructor(private orderService: OrderService) {}

  getOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe(
      (orderCollection: IOrder[]) => {
        this.orderCollection = orderCollection;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  ngOnInit(): void {
    // this.getOrders();
    this.orderCollection = [this.mockOrder];
  }
}
