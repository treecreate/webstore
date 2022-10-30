import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxOptionsDesignEnum } from '@assets';
import {
  DesignFontEnum,
  DesignTypeEnum,
  ErrorlogPriorityEnum,
  IAuthUser,
  IDesign,
  IPetSign,
  IPetSignFrameInfo,
  IQoutable,
  ITransactionItem,
  petSignFrames,
} from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { PetSignDesignComponent } from '../../../../shared/components/products/pet-sign-design/pet-sign-design.component';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { DesignService } from '../../../../shared/services/design/design.service';
import { ErrorlogsService } from '../../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../../shared/services/events/events.service';

@Component({
  selector: 'webstore-pet-sign',
  templateUrl: './pet-sign.component.html',
  styleUrls: [
    './pet-sign.component.scss',
    './pet-sign.component.mobile.scss',
    '../../../../../assets/styles/tc-input-field.scss',
    '../../../../../assets/styles/product-options.scss',
  ],
})
export class PetSignComponent implements OnInit {
  productSpecificFrames: IPetSignFrameInfo[];

  @ViewChild('petSignDesign', { static: false })
  petSignDesign: PetSignDesignComponent;
  toggleUserOptionsIcon = BoxOptionsDesignEnum.boxOptionsVisible;

  isDesignValid = false;

  isMutable = false;
  isMobileOptionOpen = false;
  showInputFieldOptions = true;
  hasLoadedDesign = false;

  defaultFont = DesignFontEnum[Object.keys(DesignFontEnum)[3]];
  displayFont = this.defaultFont;
  fontOptions = [];
  fontSize = 40;
  currentDesign = 1;
  design: IPetSign;

  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public localeCode: LocaleType;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private authService: AuthService,
    private eventsService: EventsService,
    private errorlogService: ErrorlogsService,
    private metaTitle: Title,
    private meta: Meta
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });

    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();

    // Set product frames dependent on product type
    this.productSpecificFrames = petSignFrames;

    // Set default design
    this.setDefaultDesign();
  }

  ngOnInit(): void {
    this.getFontList();
    this.loadDesign();
    this.setMetaData();
  }

  toggleUserOptions(): void {
    this.showInputFieldOptions = !this.showInputFieldOptions;
    this.toggleUserOptionsIcon = this.showInputFieldOptions
      ? BoxOptionsDesignEnum.boxOptionsVisible
      : BoxOptionsDesignEnum.boxOptionsHidden;
  }

  setMetaData(): void {
    this.metaTitle.setTitle('Hunde elskeren - Den perfekte gave');
    this.meta.updateTag({
      name: 'description',
      content:
        'Den perfekte gave til hunde elskeren. Et smult hunde skilt til at forevige minderne med menneskets bedste ven.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'hund, hundeelsker, hundeejer, kæledyr, golden retriever, gave, kæledyr, bedste ven',
    });
  }

  getFontList(): void {
    Object.entries(DesignFontEnum).forEach(([key, value]) => {
      this.fontOptions.push({ key, value });
    });
  }

  changeFont(font: { key: string; value: string }): void {
    this.design.font = DesignFontEnum[font.key];
    this.displayFont = font.value;
  }

  getDesignName(): string {
    // Update currentDesign before getting name
    this.currentDesign = this.productSpecificFrames.findIndex((frame) => this.design.designSrc === frame.src);
    const allFramesIndex = petSignFrames.findIndex((frame) => this.design.designSrc === frame.src);

    // Check that frame exists on product type || take it from the full list
    const currentFrame = this.productSpecificFrames[this.currentDesign] ?? petSignFrames[allFramesIndex];

    return this.isEnglish() ? currentFrame.nameEn : currentFrame.nameEn;
  }

  changeDesign(direction: string): void {
    switch (direction) {
      case 'next':
        if (this.currentDesign < this.productSpecificFrames.length - 1) {
          this.currentDesign = this.currentDesign + 1;
        } else {
          this.currentDesign = 0;
        }
        break;
      case 'prev':
        if (this.currentDesign > 0) {
          this.currentDesign = this.currentDesign - 1;
        } else {
          this.currentDesign = this.productSpecificFrames.length - 1;
        }
    }
    this.design.designSrc = this.productSpecificFrames[this.currentDesign].src;
  }

  loadDesign(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams.designId !== undefined) {
      if (this.isLoggedIn) {
        // Load the design from database
        this.loadDesignFromDB(queryParams);
      } else {
        // Load the design from localstorage
        this.loadDesignFromLocalStorage(queryParams.designId);
      }
    } else {
      // Load design  from local storage
      this.design = this.localStorageService.getItem<IPetSign>(LocalStorageVars.designPetSign).value;

      // apply the design
      if (this.design === null || this.design === undefined) {
        this.setDefaultDesign();
      }
      this.isMutable = true;
      setTimeout(() => {
        this.hasLoadedDesign = true;
      }, 200);
    }
  }

  loadDesignFromLocalStorage(designId: string): void {
    // Get transactionItems from localstorage
    const itemList: ITransactionItem[] = this.localStorageService.getItem<ITransactionItem[]>(
      LocalStorageVars.transactionItems
    ).value;

    // Check if id is a number and if number is in transactionItems
    const id = Number(designId);
    if (isNaN(id) || id < 0 || id > itemList.length) {
      this.errorlogService.create('webstore.pet-sign.design-load-local-storage-failed', ErrorlogPriorityEnum.high);
      this.toastService.showAlert('Failed to load design', 'Kunne ikke loade dit design', 'danger', 10000);
      this.router.navigate(['/products/pet-sign']);
      return;
    }
    // Load design
    this.design = itemList[designId].design.designProperties;
    setTimeout(() => {
      this.hasLoadedDesign = true;
    }, 200);
  }

  loadDesignFromDB(queryParams): void {
    const designId = queryParams.designId;
    this.designService.getDesign(designId).subscribe(
      (result: IDesign) => {
        if (result.designType !== DesignTypeEnum.petSign) {
          console.warn('The requested design is not a Pet Sign product!');
          return;
        }
        this.design = <IPetSign>result.designProperties;

        // for deprecated designs
        this.design.showText = this.design.showText ?? true;
        this.design.showTitle = this.design.showTitle ?? false;

        if (result.designProperties === undefined) {
          console.warn('Fetched data was invalid!');
        } else {
          this.setProductInLocal();
          // apply the design
          this.isMutable = result.mutable;
        }
        setTimeout(() => {
          this.hasLoadedDesign = true;
        }, 200);
      },
      (err: HttpErrorResponse) => {
        console.error('Failed to fetch the', err);
        this.errorlogService.create('webstore.pet-sign.design-load-database-failed', ErrorlogPriorityEnum.medium, err);
        this.toastService.showAlert('Failed to load your design', 'Vi kunne ikke loade dit design', 'danger', 10000);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { designId: null },
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
        return;
      }
    );
  }

  saveDesign(params: { persist?: boolean }, withAlert?: boolean): void {
    // If mutable, return
    if (!this.isMutable) {
      console.warn('This design cannot be updated');
      return;
    }
    // get params
    const persist = { params };

    // Save design
    this.petSignDesign.saveDesign();

    // Update this.design with localstorage design
    this.design = this.localStorageService.getItem<IPetSign>(LocalStorageVars.designPetSign).value;

    // don't persist the design if the user is not logged in
    if (!this.isLoggedIn) {
      if (!withAlert) {
        this.toastService.showAlert(
          'Your design has been temporarily saved. Log in or create an account if you want to have access to your own Collection.',
          'Dit design er blevet midlertidigt gemt. Log ind eller lav en konto hvis du vil gemme den til din egen samling.',
          'success',
          7000
        );
      }
      this.eventsService.create(`webstore.pet-sign.design-updated.local-storage`);
      return;
    }
    // Don't save the design to the collection/database. Used in combination with the addToBasketModal
    if (!persist) {
      return;
    }

    // Get id if set in URL
    const queryParams = this.route.snapshot.queryParams;

    // If id is set, update the design
    if (queryParams.designId !== undefined) {
      // design exists, save using the designId
      this.designService
        .updateDesign({
          designId: queryParams.designId,
          designType: DesignTypeEnum.petSign,
          designProperties: this.design,
        })
        .subscribe(
          () => {
            this.toastService.showAlert(
              'Your design has been updated',
              'Dit design er blevet opdateret',
              'success',
              5000
            );
            this.eventsService.create(`webstore.pet-sign.design-updated.db`);
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.errorlogService.create('webstore.pet-sign.design-update-db-failed', ErrorlogPriorityEnum.high, error);
            this.toastService.showAlert(
              'Failed to update your design',
              'Der skete en fejl ved opdateringen af dit design',
              'danger',
              10000
            );
          }
        );
    } else {
      // design is not persisted yet, create it instead
      this.designService
        .createDesign({
          designType: DesignTypeEnum.petSign,
          designProperties: this.design,
          mutable: true,
        })
        .subscribe({
          next: (result) => {
            this.toastService.showAlert('Your design has been saved', 'Dit design er blevet gemt', 'success', 5000);
            this.eventsService.create(`webstore.pet-sign.design-created.db`);
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { designId: result.designId },
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.errorlogService.create('webstore.pet-sign.design-save-db-failed', ErrorlogPriorityEnum.high, error);
            this.toastService.showAlert(
              'Failed to save your design, please try again',
              'Der skete en fejl, prøv venligst igen',
              'danger',
              10000
            );
          },
        });
    }
  }

  clearDesign(): void {
    this.removeProductFromLocal();

    if (this.route.snapshot.queryParams.designId === undefined) {
      this.setDefaultDesign();
    } else {
      // clear the designId param, triggering refetching of data
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { designId: null },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    }
    this.eventsService.create(`webstore.pet-sign.design-cleared`);
  }

  setDefaultDesign(): void {
    this.currentDesign = 1;
    this.fontSize = 40;
    this.displayFont = this.defaultFont;

    // Set default design
    this.design = {
      font: this.defaultFont,
      fontSize: this.fontSize,
      designSrc: this.productSpecificFrames[1].src,
      title: '',
      showTitle: true,
      text: '',
      showText: true,
      verticalPlacement: 50,
    };
  }

  setProductInLocal(): void {
    this.localStorageService.setItem<IPetSign>(LocalStorageVars.designPetSign, this.design);
  }

  removeProductFromLocal(): void {
    this.localStorageService.removeItem(LocalStorageVars.designPetSign);
  }

  @HostListener('window:resize')
  closeOptionsOnScreenResize(): void {
    if (window.innerWidth > 1130) {
      this.isMobileOptionOpen = false;
    }
  }

  showOptions(): void {
    this.isMobileOptionOpen = !this.isMobileOptionOpen;
  }

  openAddToBasketModal(): void {
    this.saveDesign({ persist: false }, true);
    const modalRef = this.modalService.open(AddToBasketModalComponent);
    modalRef.componentInstance.designType = DesignTypeEnum.petSign;
  }

  onIsDesignValidEvent($event): void {
    console.warn('Design state has changed. Valid:', $event);
    this.isDesignValid = $event;
    this.cdr.detectChanges();
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }
}
