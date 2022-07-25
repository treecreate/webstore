import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, IUser } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { OrderService } from '../../../../shared/services/order/order.service';
import { UserService } from '../../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-custom-order',
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.css', '../../../../../assets/styles/tc-input-field.scss'],
})
export class CustomOrderComponent implements OnInit {
  customOrderForm: FormGroup;

  currentUser: IUser;
  authUser$: BehaviorSubject<IAuthUser>;

  isLoggedIn = false;
  isLoading = false;
  isImageRequirementsRead = false;

  uploadedFiles;

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
  }

  ngOnInit(): void {
    this.initForms();
    if (this.isLoggedIn) {
      //Get user and update form
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        this.updateFormValues();
      });
    }
  }

  initForms() {
    this.customOrderForm = new FormGroup({
      name: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl('', [Validators.maxLength(1000), Validators.minLength(1), Validators.required]),
    });
  }

  updateFormValues() {
    this.customOrderForm.setValue({
      email: this.currentUser.email,
    });
  }

  uploadImage($event) {
    console.log('Image stuff', $event.target.files);
    this.uploadedFiles = Object.values($event.target.files);
    console.log(this.uploadedFiles);
  }

  submitCustomOrder() {
    this.createCustomOrder();
  }

  isDisabled() {
    return (
      this.isImageRequirementsRead &&
      this.customOrderForm.valid &&
      this.uploadedFiles &&
      this.uploadedFiles.length !== 0
    );
  }

  createCustomOrder() {
    if (!this.isDisabled()) {
      console.warn('You are not able to create a custom order without valid information');
      return;
    }
    this.isLoading = true;
    // TODO Add the API call via ordersService
    console.log('Request submitted');
  }
}
