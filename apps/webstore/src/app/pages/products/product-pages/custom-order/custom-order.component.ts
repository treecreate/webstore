import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthUser, IUser } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { CustomOrderExampleType } from 'apps/webstore/src/app/custom-order-display/CustomOrderExampleType';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { OrderService } from '../../../../shared/services/order/order.service';
import { UserService } from '../../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-custom-order',
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.css', '../../../../../assets/styles/tc-input-field.scss'],
})
export class CustomOrderComponent implements OnInit {
  customOrderExampleList: CustomOrderExampleType[] = [
    {
      customer: 'Penneo',
      descriptionEn:
        'Create your own unique family tree by adding the names of your family. Give a completely unique present to the one you care about.',
      descriptionDk:
        'Lav dit personlige stamtræ ved at skrive din families navne ind. Giv en helt unik gave til den du holder af.',
      price: 123,
      altText: '',
      imgSrc: '/assets/img/family-tree/family-tree-display-img/family-tree-02.jpg',
    },
    {
      customer: 'Penneo',
      descriptionEn:
        'Create your own unique family tree by adding the names of your family. Give a completely unique present to the one you care about.',
      descriptionDk:
        'Lav dit personlige stamtræ ved at skrive din families navne ind. Giv en helt unik gave til den du holder af.',
      price: 123,
      altText: '',
      imgSrc: '/assets/img/family-tree/family-tree-display-img/family-tree-02.jpg',
    },
    {
      customer: 'Penneo',
      descriptionEn:
        'Create your own unique family tree by adding the names of your family. Give a completely unique present to the one you care about.',
      descriptionDk:
        'Lav dit personlige stamtræ ved at skrive din families navne ind. Giv en helt unik gave til den du holder af.',
      price: 123,
      altText: '',
      imgSrc: '/assets/img/family-tree/family-tree-display-img/family-tree-02.jpg',
    },
  ];
  customOrderForm: FormGroup;

  currentUser: IUser;
  authUser$: BehaviorSubject<IAuthUser>;
  localeCode: LocaleType;

  isLoggedIn = false;
  isLoading = false;
  isImageRequirementsRead = false;

  uploadedFiles: File[] = [];

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
  }

  isEnglish(): boolean {
    return this.localeCode === LocaleType.en;
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
        Validators.maxLength(100),
        Validators.minLength(1),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl('', [Validators.maxLength(1000), Validators.minLength(1), Validators.required]),
    });
    this.uploadedFiles = [];
  }

  updateFormValues() {
    this.customOrderForm.setValue({
      email: this.currentUser.email,
    });
  }

  /**
   * Sets the uploaded files to a variable. Does not send them to the API yet
   * @param $event
   */
  uploadImages($event) {
    this.uploadedFiles = this.uploadedFiles.concat(this.convertFileListToArray($event.target.files));
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
    this.orderService
      .createCustomOrder({
        name: this.customOrderForm.get('name').value,
        email: this.customOrderForm.get('email').value,
        description: this.customOrderForm.get('description').value,
        files: this.uploadedFiles,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.showAlert('Custom order registered', 'Special bestilling regristreret', 'success', 10000);
          this.initForms();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Failed to submit custom order request', error);
          this.toastService.showAlert(
            'Failed to submit your custom order, please try again',
            'Der skete en fejl, prøv venligst igen.',
            'danger',
            20000
          );
        },
      });
  }

  /** Converts the object obtained from the file input and converts it into an array
   * that then can be used to display the selected files */
  convertFileListToArray(files: FileList): File[] {
    return Object.values(files);
  }

  removeUploadedFile(fileToRemove: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((file) => file !== fileToRemove);
  }
}
