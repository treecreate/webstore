import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IDesign, IFamilyTree } from '@interfaces';
import { DesignService } from '../../../services/design/design.service';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';

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
    private designService: DesignService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  deleteDesign() {
    //this.designService.deleteDesign( this.design.designId );
  }

  editDesign() {}

  addDesignToBasket() {}
}
