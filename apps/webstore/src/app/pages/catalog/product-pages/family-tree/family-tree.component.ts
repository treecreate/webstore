import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxOptionsDesignEnum, TreeDesignEnum, TreeDesignNameDanishEnum, TreeDesignNameEnglishEnum } from '@assets';
import { DesignFontEnum, DesignTypeEnum, IAuthUser, IDesign, IFamilyTree, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { FamilyTreeIntroModalComponent } from '../../../../shared/components/modals/family-tree-intro-modal/family-tree-intro-modal.component';
import { FamilyTreeTemplateModalComponent } from '../../../../shared/components/modals/family-tree-template-modal/family-tree-template-modal.component';
import { FamilyTreeDesignComponent } from '../../../../shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { ToastService } from '../../../../shared/components/toast/toast-service';
import { AuthService } from '../../../../shared/services/authentication/auth.service';
import { DesignService } from '../../../../shared/services/design/design.service';
@Component({
  selector: 'webstore-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: [
    './family-tree.component.scss',
    './family-tree.component.mobile.scss',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeComponent implements OnInit {
  @ViewChild('familyTreeDesignCanvas', { static: false })
  designCanvas: FamilyTreeDesignComponent;

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
  boxSize = 70;
  maxSize = 70;
  minSize = 10;
  boxSizeOptions = {
    floor: this.minSize,
    ceil: this.maxSize,
  };
  design: IFamilyTree = {
    font: this.defaultFont,
    backgroundTreeDesign: this.defaultBackgroundTreeDesign,
    banner: { text: 'Familietræet', style: 'first' },
    boxSize: 40,
    boxes: [],
  };
  showOptionBoxButtons = true;
  isIphone = false;

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

    this.isIphone = this.iOS();
  }

  ngOnInit() {
    // The subscription will get triggered right away, loading the design
    this.route.queryParams.subscribe(() => {
      this.loadDesign();
    });
    this.showOptionBoxButtons = true;
    this.getFontList();

    setTimeout(() => {
      const firstVisit = this.localStorageService.getItem<boolean>(LocalStorageVars.firstVisit).value;
      if (firstVisit === null) {
        this.openTemplateModal();
        this.localStorageService.setItem<boolean>(LocalStorageVars.firstVisit, true);
      }
    }, 500);
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  openIntroModal() {
    this.modalService.open(FamilyTreeIntroModalComponent);
  }

  openTemplateModal() {
    this.modalService.open(FamilyTreeTemplateModalComponent);
  }

  getFontList() {
    Object.entries(DesignFontEnum).forEach(([key, value]) => {
      this.fontOptions.push({ key, value });
    });
  }

  changeFont(font: { key: string; value: string }) {
    this.design.font = DesignFontEnum[font.key];
    this.displayFont = font.value;
  }

  changeBoxSize(): void {
    this.design = {
      ...this.design,
    };
  }

  toggleBanner() {
    if (this.design.banner === undefined) {
      this.design = { ...this.design, banner: { text: '', style: 'first' } };
    } else {
      this.design = { ...this.design, banner: undefined };
    }
  }

  updateBannerText($event) {
    this.design = { ...this.design, banner: { style: this.design.banner.style, text: $event.target.value } };
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
      this.design = this.localStorageService.getItem<IFamilyTree>(LocalStorageVars.designFamilyTree).value;
      // apply the design
      if (this.design === null || this.design === undefined) {
        // set the defaults
        this.design = {
          font: this.defaultFont,
          backgroundTreeDesign: this.defaultBackgroundTreeDesign,
          banner: { text: 'Familietræet', style: 'first' },
          boxSize: 20,
          boxes: [],
        };
        this.boxSize = 20;
        this.maxSize = 70;
        this.minSize = 10;
      }
      this.isMutable = true;
      this.cdr.detectChanges();
      this.designCanvas.loadDesign();
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
      this.router.navigate(['/catalog/family-tree']);
      return;
    }
    // Load design
    this.design = itemList[designId].design.designProperties;
    this.boxSize = this.design.boxSize;
  }

  loadDesignFromDB(queryParams) {
    const designId = queryParams.designId;
    this.designService.getDesign(designId).subscribe(
      (result: IDesign) => {
        if (result.designType !== DesignTypeEnum.familyTree) {
          console.warn('The requested design is not a family tree!');
          return;
        }
        this.design = <IFamilyTree>result.designProperties;
        if (result.designProperties === undefined) {
          console.warn('Fetched data was invalid!');
        } else {
          this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, this.design);
          // apply the design
          this.isMutable = result.mutable;
          this.cdr.detectChanges();
          this.designCanvas.loadDesign();
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
    this.designCanvas.saveDesign();
    this.design = this.localStorageService.getItem<IFamilyTree>(LocalStorageVars.designFamilyTree).value;
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
    const design: IFamilyTree = this.localStorageService.getItem<IFamilyTree>(LocalStorageVars.designFamilyTree).value;
    if (queryParams.designId !== undefined) {
      // design exists, save using the designId
      this.designService
        .updateDesign({
          designId: queryParams.designId,
          designType: DesignTypeEnum.familyTree,
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
          designType: DesignTypeEnum.familyTree,
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

  clearDesignCanvas() {
    this.localStorageService.removeItem(LocalStorageVars.designFamilyTree);
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

  getDesignName(treeDesign: TreeDesignEnum): TreeDesignNameDanishEnum | TreeDesignNameEnglishEnum {
    switch (treeDesign) {
      case TreeDesignEnum.tree1:
        if (this.locale$.getValue() === LocaleType.dk) {
          return TreeDesignNameDanishEnum.tree1;
        } else {
          return TreeDesignNameEnglishEnum.tree1;
        }
      case TreeDesignEnum.tree2:
        if (this.locale$.getValue() === LocaleType.dk) {
          return TreeDesignNameDanishEnum.tree2;
        } else {
          return TreeDesignNameEnglishEnum.tree2;
        }
      case TreeDesignEnum.tree3:
        if (this.locale$.getValue() === LocaleType.dk) {
          return TreeDesignNameDanishEnum.tree3;
        } else {
          return TreeDesignNameEnglishEnum.tree3;
        }
      case TreeDesignEnum.tree4:
        if (this.locale$.getValue() === LocaleType.dk) {
          return TreeDesignNameDanishEnum.tree4;
        } else {
          return TreeDesignNameEnglishEnum.tree4;
        }
    }
  }

  nextDesign() {
    const currentDesignIndex = Object.values(TreeDesignEnum).indexOf(this.design.backgroundTreeDesign);
    const nextDesign = Object.keys(TreeDesignEnum)[currentDesignIndex + 1];
    if (nextDesign === undefined) {
      // set the first design in the enum
      this.design = {
        ...this.design,
        backgroundTreeDesign: TreeDesignEnum[Object.keys(TreeDesignEnum)[0]],
      };
    } else {
      this.design = {
        ...this.design,
        backgroundTreeDesign: TreeDesignEnum[nextDesign],
      };
    }
  }

  prevDesign() {
    const currentDesignIndex = Object.values(TreeDesignEnum).indexOf(this.design.backgroundTreeDesign);
    const previousDesign = Object.keys(TreeDesignEnum)[currentDesignIndex - 1];
    if (previousDesign === undefined) {
      // set the last design in the enum
      this.design = {
        ...this.design,
        backgroundTreeDesign: TreeDesignEnum[Object.keys(TreeDesignEnum)[Object.values(TreeDesignEnum).length - 1]],
      };
    } else {
      this.design = {
        ...this.design,
        backgroundTreeDesign: TreeDesignEnum[previousDesign],
      };
    }
  }

  openAddToBasketModal() {
    this.saveDesign({ persist: false });
    const modalRef = this.modalService.open(AddToBasketModalComponent);
    modalRef.componentInstance.designType = DesignTypeEnum.familyTree;
  }

  onIsDesignValidEvent($event) {
    console.warn('Design state has changed. Valid:', $event);
    this.isDesignValid = $event;
    this.cdr.detectChanges();
  }

  iOS() {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform
    );
  }

  /**
   * Toggles between whether or not the box options like drag and close buttons should be visible.
   * Changes the icon depending on the state.
   */
  toggleBoxOptions(): void {
    this.showOptionBoxButtons = !this.showOptionBoxButtons;
    if (this.showOptionBoxButtons) {
      this.toggleBoxOptionsIcon = BoxOptionsDesignEnum.boxOptionsVisible;
    } else {
      this.toggleBoxOptionsIcon = BoxOptionsDesignEnum.boxOptionsHidden;
    }
  }
}
