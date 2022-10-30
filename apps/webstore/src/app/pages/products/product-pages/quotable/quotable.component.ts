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
  IQoutable,
  IQuotableFrameInfo,
  ITransactionItem,
  quotableFrames,
  QuotableTypeEnum,
} from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { QuotableTemplateModalComponent } from '../../../../shared/components/modals/quotable-template-modal/quotable-template-modal.component';
import { QuotableDesignComponent } from '../../../../shared/components/products/quotable-design/quotable-design.component';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { DesignService } from '../../../../shared/services/design/design.service';
import { ErrorlogsService } from '../../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../../shared/services/events/events.service';

@Component({
  selector: 'webstore-quotable',
  templateUrl: './quotable.component.html',
  styleUrls: [
    './quotable.component.scss',
    './quotable.component.mobile.scss',
    '../../../../../assets/styles/tc-input-field.scss',
    '../../../../../assets/styles/product-options.scss',
  ],
})
export class QuotableComponent implements OnInit {
  productSpecificFrames: IQuotableFrameInfo[];

  @ViewChild('quotableDesign', { static: false })
  quotableDesign: QuotableDesignComponent;
  toggleUserOptionsIcon = BoxOptionsDesignEnum.boxOptionsVisible;
  quotableType: QuotableTypeEnum;

  isDesignValid = false;

  isMutable = false;
  isMobileOptionOpen = false;
  showInputFieldOptions = true;
  hasLoadedDesign = false;

  defaultFont = DesignFontEnum[Object.keys(DesignFontEnum)[3]];
  displayFont = this.defaultFont;
  fontOptions = [];
  fontSize = 40;
  fontSizeOptions = {
    floor: 10,
    ceil: 70,
  };
  currentDesign = 1;
  design: IQoutable;

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
    public eventsService: EventsService,
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

    // Get product type
    this.route.queryParams.subscribe((params) => {
      this.quotableType = params.productType;
    });

    // Set product frames dependent on product type
    this.productSpecificFrames = this.quotableType
      ? quotableFrames.filter((frame) => frame.productType.includes(this.quotableType))
      : quotableFrames;

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
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.metaTitle.setTitle('Fødselsminde indgraveret i træ');
        this.meta.updateTag({
          name: 'description',
          content:
            'Foreviggør livets mirakel med Baby Skiltet fra Treecreate. Få dit barns navn, fødselsdag og størrelse indgraveret i egetræ.',
        });
        this.meta.updateTag({
          name: 'keywords',
          content: 'Spædbarn, baby, barn, børneminder, fødsel, nybagt forælder, forældre, gave til forældre',
        });
        break;
      case QuotableTypeEnum.loveLetter:
        this.metaTitle.setTitle('Personlig og unik kærlighedserklæring i træ');
        this.meta.updateTag({
          name: 'description',
          content:
            'Giv din kæreste eller livspartner en gave for livet. Med Treecreate kan du give en unik og personlig gave til den du elsker.',
        });
        this.meta.updateTag({
          name: 'keywords',
          content:
            'unik og personlig gave, kærlighed, kæreste, gave til kæreste, gave til partner, kærlighedserklæring',
        });
        break;
      case QuotableTypeEnum.quotable:
      default:
        this.metaTitle.setTitle('Citat eller minde skåret i træ');
        this.meta.updateTag({
          name: 'description',
          content:
            'Få skåret dit yndlingscitat, et lykkeligt minde, en besked til kæresten eller bare et lækkert navneskilt i træ.',
        });
        this.meta.updateTag({
          name: 'keywords',
          content: 'Minder, ferieminder, ferie, citat, quote, livsmotto, liv, gave',
        });
    }
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
    const allFramesIndex = quotableFrames.findIndex((frame) => this.design.designSrc === frame.src);

    // Check that frame exists on product type || take it from the full list
    const currentFrame = this.productSpecificFrames[this.currentDesign] ?? quotableFrames[allFramesIndex];

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
      // Load quotable design specific to type
      this.loadTypeSpecificDesign();

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
      this.errorlogService.create('webstore.quotable.design-load-local-storage-failed', ErrorlogPriorityEnum.high);
      this.toastService.showAlert('Failed to load design', 'Kunne ikke loade dit design', 'danger', 10000);
      this.router.navigate(['/products/quotable']);
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
        if (result.designType !== DesignTypeEnum.quotable) {
          console.warn('The requested design is not a Quotable product!');
          return;
        }
        this.design = <IQoutable>result.designProperties;

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
        this.errorlogService.create('webstore.quotable.design-load-database-failed', ErrorlogPriorityEnum.medium, err);
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
    this.quotableDesign.saveDesign();

    // Update this.design with localstorage design
    this.loadTypeSpecificDesign();

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
      this.eventsService.create(`webstore.quotable.design-updated.local-storage`);
      return;
    }
    // Don't save the quotable to the collection/database. Used in combindation with the addToBasketModal
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
          designType: DesignTypeEnum.quotable,
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
            this.eventsService.create(`webstore.quotable.design-updated.db`);
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.errorlogService.create('webstore.quotable.design-update-db-failed', ErrorlogPriorityEnum.high, error);
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
          designType: DesignTypeEnum.quotable,
          designProperties: this.design,
          mutable: true,
        })
        .subscribe({
          next: (result) => {
            this.toastService.showAlert('Your design has been saved', 'Dit design er blevet gemt', 'success', 5000);
            this.eventsService.create(`webstore.quotable.design-created.db`);
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { designId: result.designId },
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.errorlogService.create('webstore.quotable.design-save-db-failed', ErrorlogPriorityEnum.high, error);
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
    this.eventsService.create(`webstore.quotable.design-cleared`);
  }

  /**
   * Recreates the design object so it gets detected by ngOnChanges in the design component
   */
  changeFontSize(): void {
    this.design = {
      ...this.design,
    };
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
      // If baby sign, set to 35, otherwise center to 50
      verticalPlacement: this.quotableType === QuotableTypeEnum.babySign ? 35 : 50,
    };
  }

  loadTypeSpecificDesign(): void {
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designBabySign).value;
        break;
      case QuotableTypeEnum.loveLetter:
        this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designLoveLetter).value;
        break;
      case QuotableTypeEnum.quotable:
      default:
        this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
    }
  }

  setProductInLocal(): void {
    // Get the correct design type
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designBabySign, this.design);
        break;
      case QuotableTypeEnum.loveLetter:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designLoveLetter, this.design);
        break;
      case QuotableTypeEnum.quotable:
      default:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, this.design);
    }
  }

  removeProductFromLocal(): void {
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.localStorageService.removeItem(LocalStorageVars.designBabySign);
        break;
      case QuotableTypeEnum.loveLetter:
        this.localStorageService.removeItem(LocalStorageVars.designLoveLetter);
        break;
      case QuotableTypeEnum.quotable:
      default:
        this.localStorageService.removeItem(LocalStorageVars.designQuotable);
    }
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
    modalRef.componentInstance.designType = DesignTypeEnum.quotable;
    modalRef.componentInstance.quotableType = this.quotableType;
  }

  onIsDesignValidEvent($event): void {
    console.warn('Design state has changed. Valid:', $event);
    this.isDesignValid = $event;
    this.cdr.detectChanges();
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  openQuotableTemplateModal(): void {
    const modalRef = this.modalService.open(QuotableTemplateModalComponent);
    modalRef.componentInstance.designType = DesignTypeEnum.quotable;
    modalRef.componentInstance.quotableType = this.quotableType ?? QuotableTypeEnum.quotable;
  }
}
