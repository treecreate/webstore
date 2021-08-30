import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, IUser } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsOfSaleModalComponent } from '../../../shared/components/modals/terms-of-sale-modal/terms-of-sale-modal.component';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { LocalStorageService } from '../../../shared/services/local-storage';
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
  isSubscribed: boolean;
  subscribeToNewsletter = true;
  billingAddressIsTheSame = true;
  moneySaved = 1;
  isTermsAndConditionsAccepted = false;
  public isVerified: boolean;

  // TODO: get itemList from basket
  checkoutItems = [
    {
      title: 'First design',
      size: 'small',
      amount: 2,
      price: 495,
      type: 'Family tree',
    },
    // {
    //   title: 'Second design',
    //   size: 'large',
    //   amount: 1,
    //   price: 995,
    //   type: 'Family tree',
    // },
    // {
    //   title: 'Last design',
    //   size: 'medium',
    //   amount: 2,
    //   price: 695,
    //   type: 'Family tree',
    // },
  ];

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private userService: UserService,
    private verifyService: VerifyService,
    private modalService: NgbModal
  ) {
    this.localStorageService
      .getItem<IAuthUser>(LocalStorageVars.authUser)
      .subscribe(() => {
        this.isVerified = this.verifyService.getIsVerified();
      });
  }

  ngOnInit(): void {
    try {
      //Get user and update form
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        //Check for isVerified status change
        if (this.isVerified !== user.isVerified) {
          this.verifyService.setIsVerified(user.isVerified);
        }
        this.updateFormValues();
      });
    } catch (err) {
      console.log(err);
      // TODO: handle failed fetching data
    }

    // TODO: Check if user is already subscribed to newsletter
    // this.isSubscribed =

    this.checkoutForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z-' ]*$"),
      ]),
      phoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [Validators.maxLength(50)]),
      streetAddress2: new FormControl('', [Validators.maxLength(50)]),
      city: new FormControl('', [Validators.maxLength(50)]),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
    });

    this.billingAddressForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-Z-' ]*$"),
      ]),
      phoneNumber: new FormControl('', [
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [Validators.maxLength(50)]),
      streetAddress2: new FormControl('', [Validators.maxLength(50)]),
      city: new FormControl('', [Validators.maxLength(50)]),
      postcode: new FormControl('', [
        Validators.max(9999),
        Validators.min(555),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
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
      return (
        this.isTermsAndConditionsAccepted &&
        this.checkoutForm.get('name').valid &&
        this.checkoutForm.get('email').valid &&
        this.checkoutForm.get('streetAddress').valid &&
        this.checkoutForm.get('city').valid &&
        this.checkoutForm.get('postcode').valid
      );
    } else {
      return (
        this.isTermsAndConditionsAccepted &&
        this.checkoutForm.get('name').valid &&
        this.checkoutForm.get('email').valid &&
        this.checkoutForm.get('streetAddress').valid &&
        this.checkoutForm.get('city').valid &&
        this.checkoutForm.get('postcode').valid &&
        this.billingAddressForm.get('name').valid &&
        this.billingAddressForm.get('email').valid &&
        this.billingAddressForm.get('streetAddress').valid &&
        this.billingAddressForm.get('city').valid &&
        this.billingAddressForm.get('postcode').valid
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
