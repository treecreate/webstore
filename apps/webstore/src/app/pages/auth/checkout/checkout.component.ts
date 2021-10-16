import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ContactInfo,
  DiscountType,
  IAuthUser,
  IDiscount,
  INewsletter,
  IPaymentLink,
  IPricing,
  ITransactionItem,
  IUser,
  ShippingMethodEnum,
} from '@interfaces';
import { LocalStorageVars, UserRoles } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfSaleModalComponent } from '../../../shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { NewsletterService } from '../../../shared/services/newsletter/newsletter.service';
import { OrderService } from '../../../shared/services/order/order.service';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';
import { UserService } from '../../../shared/services/user/user.service';
import { VerifyService } from '../../../shared/services/verify/verify.service';

@Component({
  selector: 'webstore-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: [
    './checkout.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  billingAddressForm: FormGroup;

  currentUser: IUser;

  isHomeDelivery = false;
  plantedTrees = 1;
  isSubscribed: boolean;

  subscribeToNewsletter = false;
  billingAddressIsTheSame = true;

  priceInfo: IPricing;
  discount: IDiscount = null;

  isTermsAndConditionsAccepted = false;
  public isVerified: boolean;

  // TODO: get itemList from basket
  mockUser: IUser = {
    userId: '1',
    email: 'mock@hotdeals.dev',
    roles: [UserRoles.user],
    isVerified: true,
  };

  itemList: ITransactionItem[] = [];
  isLoading = false;

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private userService: UserService,
    private verifyService: VerifyService,
    private modalService: NgbModal,
    private calculatePriceService: CalculatePriceService,
    private newsletterService: NewsletterService,
    private transactionItemService: TransactionItemService,
    private orderService: OrderService
  ) {
    this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .subscribe(() => {
        this.isVerified = this.verifyService.getIsVerified();
      });
    this.discount = this.localStorageService.getItem<IDiscount>(
      LocalStorageVars.discount
    ).value;
    this.plantedTrees = this.localStorageService.getItem<number>(
      LocalStorageVars.plantedTrees
    ).value;
    if (this.plantedTrees === null) {
      this.plantedTrees = 1;
    }
  }

  ngOnInit(): void {
    this.updatePrices();

    try {
      //Get user and update form
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        this.updateFormValues();
      });
      // Check if user isSubscribed
      this.newsletterService.isSubscribed().subscribe(
        () => {
          this.isSubscribed = true;
        },
        (error) => {
          this.isSubscribed = false;
          this.subscribeToNewsletter = true;
          if (error.error.status !== 404) {
            console.error(error);
          }
        }
      );
    } catch (err) {
      console.log(err);
      // TODO: handle failed fetching data
    }

    this.checkoutForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.minLength(8),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      streetAddress2: new FormControl('', [Validators.maxLength(50)]),
      city: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]),
    });

    this.billingAddressForm = new FormGroup({
      billingName: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      billingStreetAddress: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      billingStreetAddress2: new FormControl('', [Validators.maxLength(50)]),
      billingCity: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      billingPostcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]),
    });

    this.loadTransactionItems();
  }

  changeDelivery() {
    this.isHomeDelivery = !this.isHomeDelivery;
    this.updatePrices();
  }

  updatePrices() {
    let totalItems = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      totalItems += this.itemList[i].quantity;
    }
    if (4 <= totalItems) {
      this.discount = {
        discountCode: 'ismorethan3=true',
        type: DiscountType.percent,
        amount: 25,
        remainingUses: 9999,
        totalUses: 1,
      };
      console.warn('discount changed to: ', this.discount);
    }
    this.priceInfo = this.calculatePriceService.calculatePrices(
      this.itemList,
      this.discount,
      this.isHomeDelivery,
      this.plantedTrees
    );
  }

  subscribeUserToNewsletter() {
    this.newsletterService
      .registerNewsletterEmail(this.checkoutForm.get('email').value)
      .subscribe(
        (data: INewsletter) => {
          //TODO: Add event for them to receive a 25% off email in 2 weeks
          this.toastService.showAlert(
            `Thank you for subscribing: ${data.email}`,
            `Tak for din tilmelding: ${data.email}`,
            'success',
            3000
          );
        },
        (error) => {
          this.toastService.showAlert(
            error.error.message,
            error.error.message,
            'danger',
            100000
          );
          console.error(error);
        }
      );
  }

  updateFormValues() {
    this.checkoutForm.setValue({
      name: this.currentUser.name,
      phoneNumber: this.currentUser.phoneNumber,
      email: this.currentUser.email,
      streetAddress: this.currentUser.streetAddress,
      streetAddress2: this.currentUser.streetAddress2,
      city: this.currentUser.city,
      postcode: this.currentUser.postcode,
    });
  }

  submitCheckout() {
    if (this.subscribeToNewsletter) {
      this.subscribeUserToNewsletter();
    }

    console.log(
      this.checkoutForm.get('name').value,
      this.checkoutForm.get('phoneNumber').value,
      this.checkoutForm.get('email').value,
      this.checkoutForm.get('streetAddress').value,
      this.checkoutForm.get('streetAddress2').value,
      this.checkoutForm.get('city').value,
      this.checkoutForm.get('postcode').value,
      this.subscribeToNewsletter,
      this.isHomeDelivery
        ? 'I want home delivery'
        : 'I want parcelshop delivery'
    );

    this.createOrder();
  }

  isDisabled() {
    if (this.billingAddressIsTheSame) {
      return this.isTermsAndConditionsAccepted && this.checkoutForm.valid;
    } else {
      return (
        this.isTermsAndConditionsAccepted &&
        this.checkoutForm.valid &&
        this.billingAddressForm.valid
      );
    }
  }

  createOrder() {
    if (!this.isDisabled()) {
      console.warn(
        'You are not able to add an order without valid information'
      );
      return;
    }
    this.isLoading = true;

    const contactInfo: ContactInfo = {
      name: this.checkoutForm.get('name').value,
      phoneNumber: this.checkoutForm.get('phoneNumber').value,
      email: this.checkoutForm.get('email').value,
      streetAddress: this.checkoutForm.get('streetAddress').value,
      streetAddress2: this.checkoutForm.get('streetAddress2').value,
      city: this.checkoutForm.get('city').value,
      postcode: this.checkoutForm.get('postcode').value,
      country: 'DK',
    };

    let billingInfo: ContactInfo;
    if (this.billingAddressIsTheSame) {
      billingInfo = contactInfo;
    } else {
      billingInfo = {
        name: this.billingAddressForm.get('name').value,
        phoneNumber: this.billingAddressForm.get('phoneNumber').value,
        email: this.billingAddressForm.get('email').value,
        streetAddress: this.billingAddressForm.get('streetAddress').value,
        streetAddress2: this.billingAddressForm.get('streetAddress2').value,
        city: this.billingAddressForm.get('city').value,
        postcode: this.billingAddressForm.get('postcode').value,
        country: 'DK',
      };
    }

    const itemIds: string[] = [];
    this.itemList.forEach((item) => {
      itemIds.push(item.transactionItemId);
    });

    if (this.discount != null) {
      if (this.discount.discountCode === 'ismorethan3=true') {
        this.discount = null;
      }
    }

    this.orderService
      .createOrder({
        subtotal: this.priceInfo.fullPrice,
        total: this.priceInfo.finalPrice,
        plantedTrees: this.plantedTrees,
        shippingMethod: this.isHomeDelivery
          ? ShippingMethodEnum.homeDelivery
          : ShippingMethodEnum.pickUpPoint,
        discountId: this.discount !== null ? this.discount.discountId : null,
        contactInfo: contactInfo,
        billingInfo: billingInfo,
        transactionItemIds: itemIds,
      })
      .subscribe(
        (paymentLink: IPaymentLink) => {
          this.isLoading = false;
          console.log('Created order and got a payment link', paymentLink);
          window.open(paymentLink.url, '_blank');
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.alert = {
            message: 'Failed to create an order. Try again later',
            type: 'danger',
            dismissible: false,
          };

          this.isLoading = false;
        }
      );
  }

  notAllowedToChangeEmailAlert() {
    this.toastService.showAlert(
      'Your email must be verified for you to complete a purchase. If you want to change your email, you can do so in Account info.',
      'Din email skal verifiseres før du kan gennemfører et køb. Hvis du vil ændre din email kan du gøre det på Konto info',
      'danger',
      10000
    );
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }

  loadTransactionItems() {
    this.isLoading = true;
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        this.isLoading = false;
        this.itemList = itemList;
        console.log('Fetched transaction items', itemList);
        this.updatePrices();
      },
      (error: HttpErrorResponse) => {
        console.error(error);

        this.alert = {
          message: 'Failed to get a list of items',
          type: 'danger',
          dismissible: false,
        };

        this.isLoading = false;
      }
    );
  }
}
