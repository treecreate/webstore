import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ContactInfo,
  CreateTransactionItemRequest,
  IAuthUser,
  IDiscount,
  INewsletter,
  IPaymentLink,
  IPricing,
  IRegisterResponse,
  ITransactionItem,
  IUser,
  ShippingMethodEnum,
} from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { TermsOfSaleModalComponent } from '../../../shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { NewsletterService } from '../../../shared/services/order/newsletter/newsletter.service';
import { OrderService } from '../../../shared/services/order/order.service';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';
import { UserService } from '../../../shared/services/user/user.service';

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
  authUser$: BehaviorSubject<IAuthUser>;

  isLoggedIn = false;
  isHomeDelivery = false;
  plantedTrees = 1;
  isSubscribed = false;
  subscribeToNewsletter = false;
  billingAddressIsTheSame = true;
  isLoading = false;
  createNewUser = false;
  isTermsAndConditionsAccepted = false;

  priceInfo: IPricing;
  discount: IDiscount = null;

  itemList: ITransactionItem[] = [];

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private userService: UserService,
    private modalService: NgbModal,
    private calculatePriceService: CalculatePriceService,
    private newsletterService: NewsletterService,
    private transactionItemService: TransactionItemService,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(
      LocalStorageVars.authUser
    );
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
    // Get discount from localstorage
    this.discount = this.localStorageService.getItem<IDiscount>(
      LocalStorageVars.discount
    ).value;
  }

  ngOnInit(): void {
    // Get discount from localstorgae
    this.discount = this.localStorageService.getItem<IDiscount>(
      LocalStorageVars.discount
    ).value;
    // Get planted trees from localstorage
    this.plantedTrees = this.localStorageService.getItem<number>(
      LocalStorageVars.plantedTrees
    ).value;

    if (this.plantedTrees === null) {
      this.plantedTrees = 1;
    }

    try {
      if (this.isLoggedIn) {
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
      }
    } catch (err) {
      console.log(err);
      // TODO: handle failed fetching data
    }

    this.initForms();
    this.loadTransactionItems();
  }

  initForms() {
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
  }

  loadTransactionItems() {
    this.isLoading = true;
    if (this.isLoggedIn) {
      // Get items from DB
      this.loadTransactionItemsFromDB();
    } else {
      // Get items from local storage
      this.itemList = this.localStorageService.getItem<ITransactionItem[]>(
        LocalStorageVars.transactionItems
      ).value;
      this.updatePrices();
      this.isLoading = false;
    }
  }

  loadTransactionItemsFromDB() {
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

  changeDelivery() {
    this.isHomeDelivery = !this.isHomeDelivery;
    this.updatePrices();
  }

  updatePrices() {
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

    if (this.isLoggedIn) {
      this.createOrder();
    } else {
      // TODO: check if
      if (this.createNewUser) {
        this.createOrderWithNewUser();
      } else {
        this.createOrderWithoutUser();
      }
    }
  }

  createOrderWithNewUser() {
    // generate password
    let passwordGen = '';
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      passwordGen += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    alert(passwordGen);
    // create user
    this.authService
      .register({
        email: this.checkoutForm.get('email').value,
        password: passwordGen,
      })
      .subscribe(
        (data: IRegisterResponse) => {
          this.toastService.showAlert(
            'Welcome to Treecreate, you have successfully been registered!',
            'Velkommen til Treecreate, du er nu bleven registreret!',
            'success',
            3500
          );
          this.authService.saveAuthUser(data);

          // TODO: Finish this method
          // Update transactionItems designs to contain userId
          // Get user id and email
          const newUserId = this.authUser$.value.userId;
          const newUserEmail = this.authUser$.value.email;
          // Go through list of transactionItems
          for (let i; i < this.itemList.length; i++) {
            // Update the transactionItem object
            this.itemList[i].design.user.email = newUserEmail;
            this.itemList[i].design.user.userId = newUserId;
            // Create the transactionItem in the DB
            const transactionItemRequest: CreateTransactionItemRequest = {
              designId: this.itemList[i].design.designId,
              dimension: this.itemList[i].dimension,
              quantity: this.itemList[i].quantity,
            };
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          if (error.error.message === 'Error: Email is already in use!') {
            this.toastService.showAlert(
              'E-mail is already in use. Please log in to complete your purchase.',
              'E-mail er allerede i brug. Log ind for at gennemfører dit køb.',
              'danger',
              10000
            );
          } else {
            this.toastService.showAlert(
              'Failed at creating a profile',
              'Fejl ved profil oprettelse',
              'danger',
              10000
            );
          }
        }
      );
    // TODO: Send reset password email to user
    this.userService.sendResetUserPassword(
      this.checkoutForm.get('email').value
    );

    // TODO: update order to contain userId
    //this.createOrder();
  }

  createOrderWithoutUser() {
    // TODO: Create order with userId = null
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
          this.localStorageService.removeItem(LocalStorageVars.discount);
          this.localStorageService.removeItem(LocalStorageVars.plantedTrees);
          // TODO: Should remove transaction items
          // this.localStorageService.removeItem(LocalStorageVars.transactionItems);
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

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }
}
