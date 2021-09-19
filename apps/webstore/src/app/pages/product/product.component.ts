import { Component, ViewChild } from '@angular/core';
import { FamilyTreeDesignEnum } from '@interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  fontCollection = [
    'Times new roman',
    'Roboto',
    'Georgia',
    'Share Tech',
    'Spectral',
    'Sansita',
  ];
  isMobileOptionOpen = false;
  designTitle = 'Untitled-1';
  font = this.fontCollection[0];
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
    const fontIndex = this.fontCollection.indexOf(this.font);
    if (fontIndex < this.fontCollection.length - 1) {
      this.font = this.fontCollection[fontIndex + 1];
    } else {
      this.font = this.fontCollection[0];
    }
  }

  prevFont() {
    const selectedFont = this.fontCollection.indexOf(this.font);
    if (selectedFont === 0) {
      this.font = this.fontCollection[this.fontCollection.length - 1];
    } else {
      this.font = this.fontCollection[selectedFont - 1];
    }
  }

  onKey(event) {
    this.designTitle = event.target.value;
  }

  openAddToBasketModal() {
    this.modalService.open(AddToBasketModalComponent);
  }
}
