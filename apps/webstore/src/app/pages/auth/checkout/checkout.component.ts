import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  ContactInfo,
  ErrorlogPriorityEnum,
  IAuthUser,
  IDiscount,
  IPaymentLink,
  IPricing,
  ITransactionItem,
  IUser,
  ShippingMethodEnum,
} from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { TermsOfSaleModalComponent } from '../../../shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { ErrorlogsService } from '../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../shared/services/events/events.service';
import { OrderService } from '../../../shared/services/order/order.service';
import { TransactionItemService } from '../../../shared/services/transaction-item/transaction-item.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css', '../../../../assets/styles/tc-input-field.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: UntypedFormGroup;
  billingAddressForm: UntypedFormGroup;

  currentUser: IUser;
  authUser$: BehaviorSubject<IAuthUser>;
  public localeCode: LocaleType;

  isLoggedIn = false;
  isHomeDelivery = false;
  plantedTrees = 1;
  isSubscribed = false;
  subscribeToNewsletter = false;
  billingAddressIsTheSame = true;
  isLoading = false;
  isTermsAndConditionsAccepted = false;
  locale;
  goToPaymentClicked = false;

  @ViewChild('checkoutNameInput') checkoutNameInput: ElementRef;
  @ViewChild('checkoutEmailInput') checkoutEmailInput: ElementRef;
  @ViewChild('checkoutStreetAddressInput') checkoutStreetAddressInput: ElementRef;
  @ViewChild('checkoutCityInput') checkoutCityInput: ElementRef;
  @ViewChild('checkoutPostcodeInput') checkoutPostcodeInput: ElementRef;

  @ViewChild('billingNameInput') billingNameInput: ElementRef;
  @ViewChild('billingStreetAddressInput') billingStreetAddressInput: ElementRef;
  @ViewChild('billingCityInput') billingCityInput: ElementRef;
  @ViewChild('billingPostcodeInput') billingPostcodeInput: ElementRef;

  priceInfo: IPricing = {
    fullPrice: 0,
    discountedPrice: 0,
    finalPrice: 0,
    discountAmount: 0,
    deliveryPrice: 0,
    extraTreesPrice: 0,
    vat: 0,
  };
  discount: IDiscount = null;

  itemList: ITransactionItem[] = [];

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private modalService: NgbModal,
    private calculatePriceService: CalculatePriceService,
    private transactionItemService: TransactionItemService,
    private authService: AuthService,
    private orderService: OrderService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService,
    private toastService: ToastService
  ) {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
    // Get discount from localstorage
    this.discount = this.localStorageService.getItem<IDiscount>(LocalStorageVars.discount).value;
    // Get planted trees from localstorage
    this.plantedTrees = this.localStorageService.getItem<number>(LocalStorageVars.plantedTrees).value;
  }

  ngOnInit(): void {
    this.initForms();
    if (this.plantedTrees === null) {
      this.plantedTrees = 1;
    }
    if (this.isLoggedIn) {
      //Get user and update form
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        this.updateFormValues();
      });
    }
    this.loadTransactionItems();
  }

  initForms() {
    this.checkoutForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      phoneNumber: new UntypedFormControl('', [
        Validators.maxLength(11),
        Validators.minLength(8),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      streetAddress: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      streetAddress2: new UntypedFormControl('', [Validators.maxLength(50)]),
      city: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      postcode: new UntypedFormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]),
    });

    this.billingAddressForm = new UntypedFormGroup({
      billingName: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      billingStreetAddress: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      billingStreetAddress2: new UntypedFormControl('', [Validators.maxLength(50)]),
      billingCity: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      billingPostcode: new UntypedFormControl('', [
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
      this.itemList = this.localStorageService.getItem<ITransactionItem[]>(LocalStorageVars.transactionItems).value;
      this.updatePrices();
      this.isLoading = false;
    }
  }

  async loadTransactionItemsFromDB() {
    await this.transactionItemService
      .getTransactionItems()
      .toPromise()
      .then((itemList) => {
        this.isLoading = false;
        this.itemList = itemList;
        this.updatePrices();
      })
      .catch((error) => {
        console.error(error);
        this.errorlogsService.create('webstore.checkout.fetch-transaction-items-failed');
        this.alert = {
          message: 'Failed to get a list of items',
          type: 'danger',
          dismissible: false,
        };
        this.isLoading = false;
      });
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

  isDanish() {
    return this.localeCode === 'en-US';
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
    this.goToPaymentClicked = true;
    // check checkout form and if terms are accepted
    this.checkFormValidity();

    if (this.isLoggedIn) {
      this.createOrder();
    } else {
      this.createOrderWithNewUser();
    }
  }

  checkFormValidity(): void {
    if (!this.checkoutForm.valid || !this.isTermsAndConditionsAccepted) {
      this.checkShippingInputFields();
      if (!this.billingAddressIsTheSame && !this.billingAddressForm.valid) {
        this.checkBillingInputFields();
        return;
      }
      return;
    }

    // check if billing address is the same
    if (!this.billingAddressIsTheSame) {
      if (!this.billingAddressForm.valid) {
        this.checkBillingInputFields();
        return;
      }
    }
  }

  checkShippingInputFields(): void {
    const fieldNames = ['name', 'email', 'streetAddress', 'city', 'postcode'];
    for (const field in fieldNames) {
      if (this.checkoutForm.get(fieldNames[field]).invalid) {
        switch (fieldNames[field]) {
          case 'name':
            this.checkoutNameInput.nativeElement.focus();
            return;
          case 'email':
            this.checkoutEmailInput.nativeElement.focus();
            return;
          case 'streetAddress':
            this.checkoutStreetAddressInput.nativeElement.focus();
            return;
          case 'city':
            this.checkoutCityInput.nativeElement.focus();
            return;
          case 'postcode':
          default:
            this.checkoutPostcodeInput.nativeElement.focus();
        }
      }
    }
  }

  checkBillingInputFields(): void {
    const fieldNames = ['billingName', 'billingStreetAddress', 'billingCity', 'billingPostcode'];
    for (const field in fieldNames) {
      if (this.billingAddressForm.get(fieldNames[field]).invalid) {
        switch (fieldNames[field]) {
          case 'billingName':
            this.billingNameInput.nativeElement.focus();
            return;
          case 'billingStreetAddress':
            this.billingStreetAddressInput.nativeElement.focus();
            return;
          case 'billingCity':
            this.billingCityInput.nativeElement.focus();
            return;
          case 'billingPostcode':
          default:
            this.billingPostcodeInput.nativeElement.focus();
        }
      }
    }
  }

  shippingInputErrorMessageCheck(fieldName: string): string {
    const isDanish = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value === LocaleType.da;
    if (this.checkoutForm.get(fieldName).invalid) {
      switch (fieldName) {
        case 'name':
          if (this.checkoutForm.get(fieldName).value === null || this.checkoutForm.get(fieldName).value === '') {
            return isDanish ? 'Navn påkrævet' : 'Name is required';
          } else if (this.checkoutForm.get(fieldName).value.length < 3) {
            return isDanish ? 'Navn er for kort' : 'Name is too short';
          } else if (this.checkoutForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Navn er for langt' : 'Name is too long';
          } else if (this.checkoutForm.get(fieldName).value.match('^[0-9+]*')) {
            return isDanish ? 'Navn indeholder ugyldige tegn' : 'Name contains an invalid character(s)';
          }
          return;
        case 'phoneNumber':
          if (this.checkoutForm.get(fieldName).value.match('^[^0-9]*')) {
            return isDanish ? 'Ugyldigt telefonnummer' : 'Please provide a valid phone number';
          }
          return;
        case 'email':
          if (this.checkoutForm.get(fieldName).value === null || this.checkoutForm.get(fieldName).value === '') {
            return isDanish ? 'Email er påkrævet' : 'Email is required';
          } else if (!this.checkoutForm.get(fieldName).value.email) {
            return isDanish ? 'Ugyldig email' : 'Please provide a valid email';
          }
          return;
        case 'streetAddress':
          if (this.checkoutForm.get(fieldName).value === null || this.checkoutForm.get(fieldName).value === '') {
            return isDanish ? 'Adresse er påkrævet' : 'Address is required';
          } else if (this.checkoutForm.get(fieldName).value.length < 3) {
            return isDanish ? 'Adressen er for kort' : 'Address is too short';
          } else if (this.checkoutForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Adressen er for lang' : 'Address is too long';
          }
          return;
        case 'city':
          if (this.checkoutForm.get(fieldName).value === null || this.checkoutForm.get(fieldName).value === '') {
            return isDanish ? 'By er påkrævet' : 'City is required';
          } else if (this.checkoutForm.get(fieldName).value.length < 2) {
            return isDanish ? 'Bynavn er for kort' : 'City is too short';
          } else if (this.checkoutForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Bynavn er for lang' : 'City is too long';
          } else if (this.checkoutForm.get(fieldName).value.match('^[0-9+]*')) {
            return isDanish ? 'Bynavn indeholder ugyldige tegn' : 'City contains an invalid character(s)';
          }
          return;
        case 'postcode':
          if (this.checkoutForm.get(fieldName).value === null || this.checkoutForm.get(fieldName).value === '') {
            return isDanish ? 'Postnummer er påkrævet' : 'Postcode is required';
          } else if (this.checkoutForm.get(fieldName).value < 555) {
            return isDanish
              ? 'Ugyldig dansk postnummer (tal for lavt). Prøv venligst igen'
              : 'Not a valid danish postcode (too low). Please try again';
          } else if (this.checkoutForm.get(fieldName).value > 9999) {
            return isDanish
              ? 'Ugyldig dansk postnummer (tal for højt). Prøv venligst igen'
              : 'Not a valid danish postcode (too high). Please try again';
          } else if (this.checkoutForm.get(fieldName).value.match('^[^0-9]*')) {
            return isDanish ? 'Postnummer indeholder ugyldige tegn' : 'Postcode contains invalid character(s)';
          }
          return;
        default:
          break;
      }
    }
  }

  billingInputErrorMessageCheck(fieldName: string): string {
    const isDanish = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).value === LocaleType.da;
    if (this.billingAddressForm.get(fieldName).invalid) {
      switch (fieldName) {
        case 'billingName':
          if (
            this.billingAddressForm.get(fieldName).value === null ||
            this.billingAddressForm.get(fieldName).value === ''
          ) {
            return isDanish ? 'Navn påkrævet' : 'Name is required';
          } else if (this.billingAddressForm.get(fieldName).value.length < 3) {
            return isDanish ? 'Navn er for kort' : 'Name is too short';
          } else if (this.billingAddressForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Navn er for langt' : 'Name is too long';
          } else if (this.billingAddressForm.get(fieldName).value.match('^[0-9+]*')) {
            return isDanish ? 'Navn indeholder ugyldige tegn' : 'Name contains an invalid character(s)';
          }
          return;
        case 'billingStreetAddress':
          if (
            this.billingAddressForm.get(fieldName).value === null ||
            this.billingAddressForm.get(fieldName).value === ''
          ) {
            return isDanish ? 'Adresse er påkrævet' : 'Address is required';
          } else if (this.billingAddressForm.get(fieldName).value.length < 3) {
            return isDanish ? 'Adressen er for kort' : 'Address is too short';
          } else if (this.billingAddressForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Adressen er for lang' : 'Address is too long';
          }
          return;
        case 'billingCity':
          if (
            this.billingAddressForm.get(fieldName).value === null ||
            this.billingAddressForm.get(fieldName).value === ''
          ) {
            return isDanish ? 'By er påkrævet' : 'City is required';
          } else if (this.billingAddressForm.get(fieldName).value.length < 2) {
            return isDanish ? 'Bynavn er for kort' : 'City is too short';
          } else if (this.billingAddressForm.get(fieldName).value.length > 50) {
            return isDanish ? 'Bynavn er for lang' : 'City is too long';
          } else if (this.billingAddressForm.get(fieldName).value.match('^[0-9+]*')) {
            return isDanish ? 'Bynavn indeholder ugyldige tegn' : 'City contains an invalid character(s)';
          }
          return;
        case 'billingPostcode':
          if (
            this.billingAddressForm.get(fieldName).value === null ||
            this.billingAddressForm.get(fieldName).value === ''
          ) {
            return isDanish ? 'Postnummer er påkrævet' : 'Postcode is required';
          } else if (this.billingAddressForm.get(fieldName).value < 555) {
            return isDanish
              ? 'Ugyldig dansk postnummer (tal for lavt). Prøv venligst igen'
              : 'Not a valid danish postcode (too low). Please try again';
          } else if (this.billingAddressForm.get(fieldName).value > 9999) {
            return isDanish
              ? 'Ugyldig dansk postnummer (tal for højt). Prøv venligst igen'
              : 'Not a valid danish postcode (too high). Please try again';
          } else if (this.billingAddressForm.get(fieldName).value.match('^[^0-9]*')) {
            return isDanish ? 'Postnummer indeholder ugyldige tegn' : 'Postcode contains invalid character(s)';
          }
          return;
        default:
          break;
      }
    }
  }

  async createOrderWithNewUser() {
    if (!this.isDisabled()) {
      this.errorlogsService.create('webstore.checkout.create-order-new-user-attempted-with-invalid-data');
      console.warn('You are not able to add an order without valid information');
      return;
    }
    this.isLoading = true;
    // generate password
    let passwordGen = '';
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      passwordGen += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    // register a new user, upload the items and designs from local storage and create an order
    try {
      const user = await this.authService
        .registerOnOrder({
          email: this.checkoutForm.get('email').value,
          password: passwordGen,
        })
        .toPromise()
        .catch((error) => {
          console.warn(error);
          this.errorlogsService.create('webstore.about-us.newsletter-signup-failed', ErrorlogPriorityEnum.high, error);
          this.toastService.showAlert('Invalid email', 'Ugyldig email', 'danger', 5000);
          this.isLoading = false;
        });

      if (!user) {
        return;
      }

      this.eventsService.create('webstore.checkout.registered-on-order');

      // set the new user logged in data
      this.authService.saveAuthUser(user);
      await this.transactionItemService.createBulkTransactionItem({ transactionItems: this.itemList }).toPromise();

      this.localStorageService.removeItem(LocalStorageVars.transactionItems);

      // TODO: Create "welcome to treecreate, set your password to enter your account" email for new users
      this.userService.sendResetUserPassword(this.checkoutForm.get('email').value);

      await this.loadTransactionItemsFromDB();
      this.createOrder();
    } catch (error) {
      console.warn(error);
      if (error.error.message === 'Error: Email is already in use!') {
        this.errorlogsService.create(
          'webstore.checkout.order-create-failed-email-in-use',
          ErrorlogPriorityEnum.low,
          null
        );
        this.alert = {
          message: this.isDanish()
            ? 'Failed to create your order, email is already in use. Please log in to finish your order.'
            : 'Fejl ved bestilling. Din email er allerede i brug. Log venligst ind for at gennemføre dit køb.',
          type: 'danger',
          dismissible: false,
        };
      } else {
        this.errorlogsService.create(
          'webstore.checkout.order-create-new-user-failed',
          ErrorlogPriorityEnum.critical,
          error
        );
        this.alert = {
          message: this.isDanish()
            ? 'Failed to create your order, please try again and if the issue persists contact us at info@treecreate.dk'
            : 'Fejl ved bestilling. Prøv venligst igen. Hvis fejlen fortsætter kan du kontakte os på info@treecreate.dk',
          type: 'danger',
          dismissible: false,
        };
      }
      this.isLoading = false;
    }
  }

  isDisabled() {
    if (this.billingAddressIsTheSame) {
      return this.isTermsAndConditionsAccepted && this.checkoutForm.valid;
    } else {
      return this.isTermsAndConditionsAccepted && this.checkoutForm.valid && this.billingAddressForm.valid;
    }
  }

  createOrder() {
    if (!this.isDisabled()) {
      this.errorlogsService.create('webstore.checkout.create-order-attempted-with-invalid-data');
      console.warn('You are not able to add an order without valid information');
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
        shippingMethod: this.isHomeDelivery ? ShippingMethodEnum.homeDelivery : ShippingMethodEnum.pickUpPoint,
        discountId: this.discount !== null ? this.discount.discountId : null,
        contactInfo: contactInfo,
        billingInfo: billingInfo,
        transactionItemIds: itemIds,
      })
      .subscribe({
        next: (paymentLink: IPaymentLink) => {
          this.localStorageService.removeItem(LocalStorageVars.discount);
          this.localStorageService.removeItem(LocalStorageVars.plantedTrees);
          this.eventsService.create('webstore.checkout.payment-initiated');
          // Go to payment link
          window.location.href = paymentLink.url;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorlogsService.create('webstore.checkout.order-create-failed', ErrorlogPriorityEnum.critical, error);
          this.alert = {
            message: 'Failed to create an order. Try again later',
            type: 'danger',
            dismissible: false,
          };

          this.isLoading = false;
        },
      });
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg' });
  }

  getParcelshopDeliveryPrice(): number {
    if (this.priceInfo !== undefined && this.priceInfo.discountedPrice > 350) return 0;
    else return 45;
  }

  getHomeDeliveryPrice(): number {
    if (this.priceInfo !== undefined && this.priceInfo.discountedPrice > 350) return 25;
    else return 65;
  }
}
