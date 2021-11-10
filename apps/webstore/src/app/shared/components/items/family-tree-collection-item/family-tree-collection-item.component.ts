import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IDesign, IFamilyTree } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { DesignService } from '../../../services/design/design.service';
import { LocalStorageService } from '@local-storage';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-family-tree-collection-item',
  templateUrl: './family-tree-collection-item.component.html',
  styleUrls: ['./family-tree-collection-item.component.css'],
})
export class FamilyTreeCollectionItemComponent {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;
  @Input() design: IDesign;
  isLoading = false;
  @Output() deleteEvent = new EventEmitter();

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
        this.toastService.showAlert(
          'The design has been deleted',
          'Designet er slettet',
          'danger',
          5000
        );
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
      this.design.designProperties
    );
    this.modalService.open(AddToBasketModalComponent);
  }
}
