import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DesignTypeEnum, IDesign, IFamilyTree } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { DesignService } from '../../../services/design/design.service';
import { FamilyTreeDesignComponent } from '../../products/family-tree/family-tree-design/family-tree-design.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-family-tree-collection-item',
  templateUrl: './family-tree-collection-item.component.html',
  styleUrls: ['./family-tree-collection-item.component.css'],
})
export class FamilyTreeCollectionItemComponent {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeDesignComponent;
  @Input() design: IDesign;
  isLoading = false;
  @Output() deleteEvent = new EventEmitter();
  public designTypeEnum = DesignTypeEnum;

  constructor(
    private toastService: ToastService,
    private designService: DesignService,
    private router: Router,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}

  deleteDesign() {
    console.log('deleting item');
    this.isLoading = true;
    this.designService.deleteDesign(this.design.designId).subscribe(
      () => {
        console.log('deleting item 2');
        this.toastService.showAlert('The design has been deleted', 'Designet er slettet', 'danger', 5000);
        this.isLoading = false;
        this.deleteEvent.emit(this.design.designId);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  editDesign() {
    window.scrollTo(0, 0);
  }

  addDesignToBasket() {
    this.localStorageService.setItem<IFamilyTree>(
      LocalStorageVars.designFamilyTree,
      <IFamilyTree>this.design.designProperties
    );
    this.modalService.open(AddToBasketModalComponent);
  }

  /**
   * Get the edit link for the given product based on designType
   * @returns absolute path to the design page
   */
  getEditLink(): string {
    switch (this.design.designType) {
      case DesignTypeEnum.familyTree: {
        return '/products/family-tree';
      }
      case DesignTypeEnum.quotable: {
        return '/products/quotable';
      }
    }
  }
}
