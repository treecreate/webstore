import { Component, ViewChild } from '@angular/core';
import { FamilyTreeDesignEnum, FamilyTreeFontEnum } from '@interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumType } from 'typescript';
import { AddToBasketModalComponent } from '../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { FamilyTreeDesignComponent } from '../../shared/components/products/family-tree/family-tree-design/family-tree-design.component';
@Component({
  selector: 'webstore-product',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
    './product.component.mobile.scss',
    '../../../assets/styles/tc-input-field.scss',
  ],
})
export class ProductComponent {
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

  constructor(private modalService: NgbModal) {}

  saveDesign() {
    this.designCanvas.saveDesign();
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
