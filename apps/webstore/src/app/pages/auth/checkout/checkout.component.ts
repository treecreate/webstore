import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeDesignEnum,
  FamilyTreeFontEnum,
  IAuthUser,
  IDiscount,
  IPricing,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { LocalStorageVars, UserRoles } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfSaleModalComponent } from '../../../shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { CalculatePriceService } from '../../../shared/services/calculate-price/calculate-price.service';
import { LocalStorageService } from '../../../shared/services/local-storage';
import { NewsletterService } from '../../../shared/services/newsletter/newsletter.service';
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
  extraDonatedTrees = 1;
  isSubscribed: boolean;

  subscribeToNewsletter = true;
  billingAddressIsTheSame = true;

  priceInfo: IPricing;
  discount: IDiscount = {
    amount: 0,
    type: DiscountType.percent,
  };

  isTermsAndConditionsAccepted = false;
  public isVerified: boolean;

  // TODO: get itemList from basket
  mockUser: IUser = {
    userId: '1',
    email: 'mock@hotdeals.dev',
    roles: [UserRoles.user],
    isVerified: true,
  };
  itemList: ITransactionItem[] = [
    {
      design: {
        designId: '1',
        designProperties: {
          properties: {
            title: 'Mock 1',
            font: FamilyTreeFontEnum.roboto,
            design: FamilyTreeDesignEnum.first,
            boxSize: 10,
            banner: false,
            largeFont: true,
            boxes: [],
          },
        },
        user: this.mockUser,
        designType: DesignTypeEnum.familyTree,
      },
      dimension: DesignDimensionEnum.small,
      quantity: 1,
      order: null,
      transactionItemId: '1',
    },
    {
      design: {
        designId: '2',
        designProperties: {
          properties: {
            title: 'Mock 2',
            font: FamilyTreeFontEnum.roboto,
            design: FamilyTreeDesignEnum.second,
            boxSize: 15,
            banner: false,
            largeFont: true,
            boxes: [],
          },
        },
        user: this.mockUser,
        designType: DesignTypeEnum.familyTree,
      },
      dimension: DesignDimensionEnum.small,
      quantity: 5,
      order: null,
      transactionItemId: '2',
    },
  ];
  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private userService: UserService,
    private verifyService: VerifyService,
    private modalService: NgbModal,
    private calculatePriceService: CalculatePriceService,
    private newsletterService: NewsletterService
  ) {
    this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .subscribe(() => {
        this.isVerified = this.verifyService.getIsVerified();
      });
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
        Validators.pattern("^[a-zA-Z-' ]*$"),
        Validators.required,
      ]),
      phoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [
        Validators.maxLength(50),
        Validators.required,
      ]),
      streetAddress2: new FormControl('', [Validators.maxLength(50)]),
      city: new FormControl('', [
        Validators.maxLength(50),
        Validators.required,
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
        Validators.pattern("^[a-zA-Z-' ]*$"),
      ]),
      billingPhoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      billingEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      billingStreetAddress: new FormControl('', [Validators.maxLength(50)]),
      billingStreetAddress2: new FormControl('', [Validators.maxLength(50)]),
      billingCity: new FormControl('', [Validators.maxLength(50)]),
      billingPostcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
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
      this.extraDonatedTrees
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
      // TODO: subscribe the user to the newsletter
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
  }

  isDisabled() {
    if (this.billingAddressIsTheSame) {
      return this.isTermsAndConditionsAccepted && this.checkoutForm.valid;
    } else {
      return (
        this.isTermsAndConditionsAccepted &&
        this.checkoutForm.get('name').valid &&
        this.checkoutForm.get('email').valid &&
        this.checkoutForm.get('streetAddress').valid &&
        this.checkoutForm.get('city').valid &&
        this.checkoutForm.get('postcode').valid &&
        this.billingAddressForm.get('billingName').valid &&
        this.billingAddressForm.get('billingEmail').valid &&
        this.billingAddressForm.get('billingStreetAddress').valid &&
        this.billingAddressForm.get('billingCity').valid &&
        this.billingAddressForm.get('billingPostcode').valid
      );
    }
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
}
