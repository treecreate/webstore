import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxOptionsDesignEnum, QuotableDesignEnum, quotableFrames, TreeDesignEnum } from '@assets';
import { DesignFontEnum, DesignTypeEnum, IAuthUser, IDesign, IQoutable, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { QuotableDesignComponent } from '../../../../shared/components/products/quotable-design/quotable-design.component';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { DesignService } from '../../../../shared/services/design/design.service';

@Component({
  selector: 'webstore-quotable',
  templateUrl: './quotable.component.html',
  styleUrls: ['./quotable.component.scss', '../../../../../assets/styles/tc-input-field.scss'],
})
export class QuotableComponent implements OnInit {
  @ViewChild('quotableDesign', { static: false })
  quotableDesign: QuotableDesignComponent;
  toggleBoxOptionsIcon = BoxOptionsDesignEnum.boxOptionsVisible;

  isDesignValid = false;
  isMutable = false;
  isMobileOptionOpen = false;
  showSuggestion = true;
  // set the default font
  defaultFont = DesignFontEnum[Object.keys(DesignFontEnum)[3]];
  displayFont = this.defaultFont;
  fontOptions = [];
  defaultBackgroundTreeDesign = TreeDesignEnum.tree1;
  fontSize = 40;
  fontSizeOptions = {
    floor: 10,
    ceil: 70,
  };
  currentDesign: number = 1;
  design: IQoutable;

  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
  }

  ngOnInit() {
    this.getFontList();
    this.loadDesign();
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
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
    return this.isEnglish() ? quotableFrames[this.currentDesign].nameEn : quotableFrames[this.currentDesign].nameDk;
  }

  changeDesign(direction: string): void {
    switch (direction) {
      case 'next':
        if (this.currentDesign < 12) {
          this.currentDesign = this.currentDesign + 1;
        } else {
          this.currentDesign = 0;
        }
        break;
      case 'prev':
        if (this.currentDesign > 0) {
          this.currentDesign = this.currentDesign - 1;
        } else {
          this.currentDesign = 12;
        }
    }
    this.design.designSrc = quotableFrames[this.currentDesign].src;
  }

  loadDesign() {
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
      this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
      // apply the design
      if (this.design === null || this.design === undefined) {
        // set the defaults
        this.design = {
          font: this.defaultFont,
          fontSize: this.fontSize,
          designSrc: quotableFrames[this.currentDesign].src,
          text: 'Lorem Ipsum',
        };
      }
      this.isMutable = true;
    }
  }

  loadDesignFromLocalStorage(designId: string) {
    // Get transactionItems from localstorage
    const itemList: ITransactionItem[] = this.localStorageService.getItem<ITransactionItem[]>(
      LocalStorageVars.transactionItems
    ).value;

    // Check if id is a number and if number is in transactionItems
    const id = Number(designId);
    if (isNaN(id) || id < 0 || id > itemList.length) {
      this.toastService.showAlert('Failed to load design', 'Kunne ikke loade dit design', 'danger', 10000);
      this.router.navigate(['/products/family-tree']);
      return;
    }
    // Load design
    this.design = itemList[designId].design.designProperties;
  }

  loadDesignFromDB(queryParams) {
    const designId = queryParams.designId;
    this.designService.getDesign(designId).subscribe(
      (result: IDesign) => {
        if (result.designType !== DesignTypeEnum.quotable) {
          console.warn('The requested design is not a family tree!');
          return;
        }
        this.design = <IQoutable>result.designProperties;
        if (result.designProperties === undefined) {
          console.warn('Fetched data was invalid!');
        } else {
          this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, this.design);
          // apply the design
          this.isMutable = result.mutable;
        }
      },
      (err: HttpErrorResponse) => {
        console.error('Failed to fetch the', err);
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

  saveDesign(params: { persist?: boolean }) {
    if (!this.isMutable) {
      console.warn('This design cannot be updated');
      return;
    }
    const persist = { params };
    this.quotableDesign.saveDesign();
    this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
    // don't persist the design if the user is not logged in
    if (!this.isLoggedIn) {
      this.toastService.showAlert(
        'Your design has been temporarily saved. Log in or create an account if you want to have access to your own Collection.',
        'Dit design er bleven midlertidigt gemt. Log ind eller lav en konto hvis du vil gemme den til din egen samling.',
        'success',
        10000
      );
      return;
    }
    // Don't save the tree to the collection/database. Used in combindation with the addToBasketModal
    if (!persist) {
      return;
    }
    const queryParams = this.route.snapshot.queryParams;
    const design: IQoutable = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
    if (queryParams.designId !== undefined) {
      // design exists, save using the designId
      this.designService
        .updateDesign({
          designId: queryParams.designId,
          designType: DesignTypeEnum.quotable,
          designProperties: design,
        })
        .subscribe(
          () => {
            this.toastService.showAlert(
              'Your design has been updated',
              'Dit design er bleven opdateret',
              'success',
              5000
            );
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
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
          designProperties: design,
          mutable: true,
        })
        .subscribe(
          (result) => {
            this.toastService.showAlert('Your design has been saved', 'Dit design er bleven gemt', 'success', 5000);
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { designId: result.designId },
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.toastService.showAlert(
              'Failed to save your design, please try again',
              'Der skete en fejl, prøv venligst igen',
              'danger',
              10000
            );
          }
        );
    }
  }

  clearDesign() {
    this.localStorageService.removeItem(LocalStorageVars.designQuotable);
    if (this.route.snapshot.queryParams.designId === undefined) {
      // trigger reload of the page by switching to another page and back
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    } else {
      // clear the designId param, triggering refetching of data
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { designId: null },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    }
  }

  @HostListener('window:resize')
  closeOptionsOnScreenResize() {
    if (window.innerWidth > 1130) {
      this.isMobileOptionOpen = false;
    }
  }

  showOptions() {
    this.isMobileOptionOpen = !this.isMobileOptionOpen;
  }

  // TODO - either make addToBasket modal recognize designType or create a new modal for quotable
  openAddToBasketModal() {
    this.saveDesign({ persist: false });
    const modalRef = this.modalService.open(AddToBasketModalComponent);
    modalRef.componentInstance.designType = DesignTypeEnum.quotable;
  }

  onIsDesignValidEvent($event) {
    console.warn('Design state has changed. Valid:', $event);
    this.isDesignValid = $event;
    this.cdr.detectChanges();
  }
}
