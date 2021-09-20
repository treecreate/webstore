import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DesignTypeEnum,
  FamilyTreeDesignEnum,
  FamilyTreeFontEnum,
  IFamilyTree,
} from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToBasketModalComponent } from '../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { FamilyTreeDesignComponent } from '../../shared/components/products/family-tree/family-tree-design/family-tree-design.component';
import { ToastService } from '../../shared/components/toast/toast-service';
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
export class ProductComponent implements AfterViewInit {
  @ViewChild('familyTreeDesignCanvas', { static: true })
  designCanvas: FamilyTreeDesignComponent;

  isMobileOptionOpen = false;
  designTitle = 'Untitled-1';
  // set the default font
  font = FamilyTreeFontEnum[Object.keys(FamilyTreeFontEnum)[0]];
  design = FamilyTreeDesignEnum.first;
  boxSize = 20;
  maxSize = 40;
  minSize = 10;
  showBanner = false;
  isLargeFont = false;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  // TODO: properly assign the banner
  ngAfterViewInit() {
    let design: IFamilyTree;
    const queryParams = this.route.snapshot.queryParams;
    console.log('queryParams', queryParams);
    if (queryParams.designId !== undefined) {
      const designId = queryParams.designId;
      console.log('Fetching design from database', designId);
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
            this.font = design.font;
            this.showBanner = design.banner === null;
            this.boxSize = design.boxSize;
            this.isLargeFont = design.largeFont;
            this.cdr.detectChanges();
            this.loadDesign();
          }
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to fetch the', err);
          this.loadDesign();
        }
      );
    } else {
      console.log('Loading design from local storage');
      design = this.localStorageService.getItem<IFamilyTree>(
        LocalStorageVars.designFamilyTree
      ).value;
      // apply the design
      if (design !== null) {
        this.designTitle = design.title;
        this.font = design.font;
        this.showBanner = design.banner === null;
        this.boxSize = design.boxSize;
        this.isLargeFont = design.largeFont;
        this.cdr.detectChanges();
        this.loadDesign();
      }
    }
  }

  saveDesign() {
    this.designCanvas.saveDesign();
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
              'TODO: danish',
              'danger',
              10000
            );
          }
        );
    }
  }

  loadDesign() {
    this.designCanvas.loadDesign();
  }

  showOptions() {
    this.isMobileOptionOpen = !this.isMobileOptionOpen;
  }

  nextDesign() {
    if (this.design === FamilyTreeDesignEnum.first) {
      this.design = FamilyTreeDesignEnum.second;
    } else {
      this.design = FamilyTreeDesignEnum.first;
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

  openAddToBasketModal() {
    this.modalService.open(AddToBasketModalComponent);
  }
}
