import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum, IAuthUser, IUser } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { CustomOrderExampleType } from '../../../../shared/components/items/custom-order-display/CustomOrderExampleType';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { ErrorlogsService } from '../../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../../shared/services/events/events.service';
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
        'A unique display of the Penneo logo combined with the Nasdaq name in celebration of being listed on the main market.',
      descriptionDk:
        'Et unik plade med Penneos logo på, combineret med Nasdaq navnet. Lavet i en fejring af at blive en del af main market.',
      price: 700,
      altText: '',
      imgSrc: '/assets/img/custom-order-example/custom-order-img-2.png',
    },
    {
      customer: 'We Do Agency',
      descriptionEn: '4 unique prices at a BMW event, where the prises gifted to the winners.',
      descriptionDk: '4 personlige præmier til et BMW event, hvor prierne blev uddelt til vinderne. ',
      price: 1400,
      altText: '',
      imgSrc: '/assets/img/custom-order-example/custom-order-img-3.png',
    },
    {
      customer: 'Jakobsen',
      descriptionEn: "A beautiful display in the memory of the family's golden retriever named Bella.",
      descriptionDk: 'En flot tavle i minde om familiens golden retriever ved navn Bella.',
      price: 400,
      altText: '',
      imgSrc: '/assets/img/custom-order-example/custom-order-img-1.png',
    },
    {
      customer: 'Helene',
      descriptionEn: 'A gift from Helene to her boyfriend for their 2 year anniversary.',
      descriptionDk: 'En gave fra Helene til hendes kæreste til deres 2 års dag sammen.',
      price: 700,
      altText: '',
      imgSrc: '/assets/img/custom-order-example/custom-order-img-4.png',
    },
    {
      customer: 'Sara',
      descriptionEn: 'A display for Saras dog named Buster, with the addition of some puppy paws by the name.',
      descriptionDk: 'En smuk tavle for Saras hund ved navn Buster. Navnet buster fik nogle hundepoter over sit navn.',
      price: 400,
      altText: '',
      imgSrc: '/assets/img/custom-order-example/custom-order-img-5.png',
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
  maxFileSize = 20971520; // in bytes

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
    private toastService: ToastService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
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
      customerEmail: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl('', [Validators.maxLength(1000), Validators.minLength(1), Validators.required]),
    });
    this.uploadedFiles = [];
  }

  updateFormValues() {
    this.customOrderForm.setValue({
      customerEmail: this.currentUser.email,
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
      this.uploadedFiles.length !== 0 &&
      this.getTotalFileSize() <= this.maxFileSize
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
        email: this.customOrderForm.get('customerEmail').value,
        description: this.customOrderForm.get('description').value,
        files: this.uploadedFiles,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.showAlert('Custom order registered', 'Special bestilling regristreret', 'success', 10000);
          this.eventsService.create(
            `webstore.custom-order.custom-order-request-submitted.${
              this.customOrderForm.get('name').value.length <= 20
                ? this.customOrderForm.get('name').value
                : this.customOrderForm.get('name').value.substring(0, 20) + '...'
            }`
          );
          this.initForms();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Failed to submit custom order request', error);
          this.errorlogsService.create(
            'webstore.custom-order.create-custom-order-failed',
            ErrorlogPriorityEnum.critical,
            error
          );
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

  /**
   * Calculates the total file size of the uploaded images
   */
  getTotalFileSize(): number {
    let size = 0;
    this.uploadedFiles.forEach((file) => {
      size += file.size;
    });
    return size;
  }
}
