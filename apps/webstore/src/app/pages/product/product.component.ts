import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeDesignEnum, TreeDesignNameEnum } from '@assets';
import {
  DesignTypeEnum,
  FamilyTreeFontEnum,
  IAuthUser,
  IFamilyTree,
  IFamilyTreeBanner,
} from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AddToBasketModalComponent } from '../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { FamilyTreeDesignComponent } from '../../shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { ToastService } from '../../shared/components/toast/toast-service';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { DesignService } from '../../shared/services/design/design.service';
import { LocalStorageService } from '../../shared/services/local-storage';
@Component({
  selector: 'webstore-product',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
    './product.component.mobile.scss',
    '../../../assets/styles/tc-input-field.scss',
  ],
})
export class ProductComponent implements OnInit {
  @ViewChild('familyTreeDesignCanvas', { static: true })
  designCanvas: FamilyTreeDesignComponent;

  isDesignValid = false;

  isMobileOptionOpen = false;
  designTitle = 'Untitled-1';
  // set the default font
  font = FamilyTreeFontEnum[Object.keys(FamilyTreeFontEnum)[0]];
  backgroundTreeDesign = TreeDesignEnum.tree1;
  boxSize = 20;
  maxSize = 40;
  minSize = 10;
  banner: IFamilyTreeBanner = undefined;
  isLargeFont = false;

  public isLoggedIn: boolean;
  private authUser$: BehaviorSubject<IAuthUser>;

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
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(
      LocalStorageVars.authUser
    );
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
  }

  ngOnInit() {
    // The subscription will get triggered right away, loading the design
    this.route.queryParams.subscribe((p) => {
      console.warn('query paramas changed', p);
      this.loadDesign();
    });
    console.log('logged in', this.isLoggedIn);
  }

  // TODO: properly assign the banner
  loadDesign() {
    let design: IFamilyTree;
    const queryParams = this.route.snapshot.queryParams;
    console.log('queryParams', queryParams);
    if (queryParams.designId !== undefined) {
      const designId = queryParams.designId;
      console.warn('Fetching design from database', designId);
      this.designService.getDesign(designId).subscribe(
        (result) => {
          console.log('Result: ', result);
          if (result.designType !== DesignTypeEnum.familyTree) {
            console.warn('The requested design is not a family tree!');
            return;
          }
          design = result.designProperties;
          console.log('Fetched design: ', design);
          if (result.designProperties === undefined) {
            console.warn('Fetched data was invalid!');
          } else {
            this.localStorageService.setItem<IFamilyTree>(
              LocalStorageVars.designFamilyTree,
              design
            );
            // apply the design
            this.designTitle = design.title;
            this.backgroundTreeDesign = design.backgroundTreeDesign;
            this.font = design.font;
            this.banner = design.banner;
            this.boxSize = design.boxSize;
            this.isLargeFont = design.largeFont;
            this.cdr.detectChanges();
            this.designCanvas.loadDesign();
          }
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to fetch the', err);
          this.toastService.showAlert(
            'Failed to load your design',
            'TODO: danish',
            'danger',
            10000
          );
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { designId: null },
            queryParamsHandling: 'merge', // remove to replace all query params by provided
          });
          return;
        }
      );
    } else {
      console.log('Loading design from local storage');
      design = this.localStorageService.getItem<IFamilyTree>(
        LocalStorageVars.designFamilyTree
      ).value;
      console.log('loaded design', design);
      // apply the design
      if (design !== null && design !== undefined) {
        this.designTitle = design.title;
        this.font = design.font;
        this.banner = design.banner;
        this.boxSize = design.boxSize;
        this.isLargeFont = design.largeFont;
      } else {
        // set the defaults
        this.designTitle = 'Untitled-1';
        this.font = FamilyTreeFontEnum[Object.keys(FamilyTreeFontEnum)[0]];
        this.backgroundTreeDesign = TreeDesignEnum.tree1;
        this.boxSize = 20;
        this.maxSize = 40;
        this.minSize = 10;
        this.banner = undefined;
        this.isLargeFont = false;
      }
      this.cdr.detectChanges();
      this.designCanvas.loadDesign();
    }
  }

  saveDesign(params: { persist?: boolean }) {
    const persist = { params };
    this.designCanvas.saveDesign();
    // don't persist the design if the user is not logged in
    if (!this.isLoggedIn || !persist) {
      return;
    }
    const queryParams = this.route.snapshot.queryParams;
    const design: IFamilyTree = this.localStorageService.getItem<IFamilyTree>(
      LocalStorageVars.designFamilyTree
    ).value;
    if (queryParams.designId !== undefined) {
      // design exists, save using the designId
      this.designService
        .updateDesign({
          designId: queryParams.designId,
          designType: DesignTypeEnum.familyTree,
          designProperties: design,
        })
        .subscribe(
          (result) => {
            console.log('Design persisted', result);
            this.toastService.showAlert(
              'Your design has been saved',
              'TODO: danish',
              'success',
              2500
            );
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.toastService.showAlert(
              'Failed to save your design',
              'TODO: danish',
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
            console.log('Design created and persisted', result);
            this.toastService.showAlert(
              'Your design has been saved',
              'TODO: danish',
              'success',
              2500
            );
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { designId: result.designId },
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
          },
          (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.toastService.showAlert(
              'Failed to save your design',
              //TODO: Danish translation
              'TODO: danish',
              'danger',
              10000
            );
          }
        );
    }
  }

  clearDesignCanvas() {
    console.log('Clearing design canvas');
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

  showOptions() {
    this.isMobileOptionOpen = !this.isMobileOptionOpen;
  }

  getDesignName(treeDesign: TreeDesignEnum): TreeDesignNameEnum {
    switch (treeDesign) {
      case TreeDesignEnum.tree1:
        return TreeDesignNameEnum.tree1;
      case TreeDesignEnum.tree2:
        return TreeDesignNameEnum.tree2;
      case TreeDesignEnum.tree3:
        return TreeDesignNameEnum.tree3;
    }
  }

  nextDesign() {
    const currentDesignIndex = Object.values(TreeDesignEnum).indexOf(
      this.backgroundTreeDesign
    );
    const nextDesign = Object.keys(TreeDesignEnum)[currentDesignIndex + 1];
    if (nextDesign === undefined) {
      // set the first design in the enum
      this.backgroundTreeDesign =
        TreeDesignEnum[Object.keys(TreeDesignEnum)[0]];
    } else {
      this.backgroundTreeDesign = TreeDesignEnum[nextDesign];
    }
  }

  prevDesign() {
    const currentDesignIndex = Object.values(TreeDesignEnum).indexOf(
      this.backgroundTreeDesign
    );
    const previousDesign = Object.keys(TreeDesignEnum)[currentDesignIndex - 1];
    if (previousDesign === undefined) {
      // set the last design in the enum
      this.backgroundTreeDesign =
        TreeDesignEnum[
          Object.keys(TreeDesignEnum)[Object.values(TreeDesignEnum).length - 1]
        ];
    } else {
      this.backgroundTreeDesign = TreeDesignEnum[previousDesign];
    }
  }

  nextFont() {
    const currentFontIndex = Object.values(FamilyTreeFontEnum).indexOf(
      this.font
    );
    const nextFont = Object.keys(FamilyTreeFontEnum)[currentFontIndex + 1];
    if (nextFont === undefined) {
      // set the first font in the enum
      this.font = FamilyTreeFontEnum[Object.keys(FamilyTreeFontEnum)[0]];
    } else {
      this.font = FamilyTreeFontEnum[nextFont];
    }
  }

  prevFont() {
    const currentFontIndex = Object.values(FamilyTreeFontEnum).indexOf(
      this.font
    );
    const previousFont = Object.keys(FamilyTreeFontEnum)[currentFontIndex - 1];
    if (previousFont === undefined) {
      // set the last font in the enum
      this.font =
        FamilyTreeFontEnum[
          Object.keys(FamilyTreeFontEnum)[
            Object.values(FamilyTreeFontEnum).length - 1
          ]
        ];
    } else {
      this.font = FamilyTreeFontEnum[previousFont];
    }
  }

  onKey(event) {
    this.designTitle = event.target.value;
  }

  updateBannerText($event) {
    this.banner.text = $event.target.value;
    console.log('banner text', this.banner.text);
  }

  openAddToBasketModal() {
    this.saveDesign({ persist: false });
    this.modalService.open(AddToBasketModalComponent);
  }

  onIsDesignValidEvent($event) {
    console.warn('Design state has changed. Valid:', $event);
    this.isDesignValid = $event;
    this.cdr.detectChanges();
  }
}
