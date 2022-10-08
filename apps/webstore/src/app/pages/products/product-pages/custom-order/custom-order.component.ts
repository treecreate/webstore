import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
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
import { customOrderExamples } from './custom-order-examples.constant';

@Component({
  selector: 'webstore-custom-order',
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.css', '../../../../../assets/styles/tc-input-field.scss'],
})
export class CustomOrderComponent implements OnInit {
  customOrderExampleList: CustomOrderExampleType[] = customOrderExamples;
  customOrderForm: UntypedFormGroup;

  currentUser: IUser;
  authUser$: BehaviorSubject<IAuthUser>;
  localeCode: LocaleType;

  isLoggedIn = false;
  isLoading = false;
  isImageRequirementsRead = false;
  sendCustomOrderClicked = false;

  uploadedFiles: File[] = [];
  maxFileSize = 20971520; // in bytes

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('descriptionInput') descriptionInput: ElementRef;

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService,
    private metaTitle: Title,
    private meta: Meta
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
    this.setMetaData();

    this.initForms();
    if (this.isLoggedIn) {
      //Get user and update form
      this.userService.getUser().subscribe((user: IUser) => {
        this.currentUser = user;
        this.updateFormValues();
      });
    }
  }

  setMetaData() {
    this.metaTitle.setTitle('Lav dit helt eget design og få det skåret ud i træ');
    this.meta.updateTag({
      name: 'description',
      content:
        'Med Treecreates specialbestilling kan du helt selv designe dit eget træskilt, eller uploade et billede der skal laserskæres.',
    });
    this.meta.updateTag({ name: 'keywords', content: 'Design, trædesign, laserskærer, indgravering, gave' });
  }

  initForms() {
    this.customOrderForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.maxLength(100),
        Validators.minLength(1),
        Validators.required,
        Validators.pattern('^[^0-9]+$'),
      ]),
      customerEmail: new UntypedFormControl('', [Validators.required, Validators.email]),
      description: new UntypedFormControl('', [
        Validators.maxLength(1000),
        Validators.minLength(1),
        Validators.required,
      ]),
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
    this.sendCustomOrderClicked = true;

    if (!this.customOrderForm.valid || !this.isImageRequirementsRead) {
      // Go to earliest occurence of invalid input
      if (this.customOrderForm.get('name').invalid) {
        this.nameInput.nativeElement.focus();
      } else if (this.customOrderForm.get('customerEmail').invalid) {
        this.emailInput.nativeElement.focus();
      } else if (this.customOrderForm.get('description').invalid) {
        this.descriptionInput.nativeElement.focus();
      }
    } else {
      this.createCustomOrder();
    }
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
          this.toastService.showAlert('Custom order registered', 'Specialbestilling regristreret', 'success', 10000);
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
