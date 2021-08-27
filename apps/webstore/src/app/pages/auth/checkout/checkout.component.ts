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
  currentUser: IUser;
  isHomeDelivery = false;
  isSubscribed: boolean;
  subscribeToNewsletter = true;
  moneySaved = 1;
  public isVerified: boolean;

  // TODO: get itemList from basket
  checkoutItems = [
    {
      title: 'First design',
      size: 'small',
      amount: 2,
      price: 990,
      type: 'Family tree',
    },
    {
      title: 'Second design',
      size: 'large',
      amount: 1,
      price: 995,
      type: 'Family tree',
    },
    {
      title: 'Last design',
      size: 'medium',
      amount: 2,
      price: 1390,
      type: 'Family tree',
    },
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
  }

  showTermsOfSale() {
    this.modalService.open(TermsOfSaleModalComponent, { size: 'lg'} )
  }
}
