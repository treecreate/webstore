import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDesign, IFamilyTree } from '@interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DesignService } from '../../../services/design/design.service';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';
import { AddToBasketModalComponent } from '../../../../shared/components/modals/add-to-basket-modal/add-to-basket-modal.component';
import { LocalStorageService } from '../../../services/local-storage';
import { LocalStorageVars } from '@models';

@Component({
  selector: 'webstore-family-tree-collection-item',
  templateUrl: './family-tree-collection-item.component.html',
  styleUrls: ['./family-tree-collection-item.component.css'],
})
export class FamilyTreeCollectionItemComponent implements OnInit {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;
  @Input() design: IDesign;
  isLoading = false;

  constructor(
    private toastService: ToastService,
    private designService: DesignService,
    private router: Router,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  deleteDesign() {
    console.log('deleting item');
    this.isLoading = true;
    this.designService.deleteDesign(this.design.designId).subscribe(
      () => {
        console.log('deleting item 2');
        this.toastService.showAlert(
          'Design deleted',
          'Designet er slettet',
          'danger',
          5000
        );
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  editDesign() {
    this.router.navigate(['/designs/me/' + this.design.designId]);
  }

  addDesignToBasket() {
    this.localStorageService.setItem<IFamilyTree>(
      LocalStorageVars.designFamilyTree,
      this.design.designProperties
    );
    this.modalService.open(AddToBasketModalComponent);
  }
}
