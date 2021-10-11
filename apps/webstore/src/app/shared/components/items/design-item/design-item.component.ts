import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IFamilyTree } from '@interfaces';
import { FamilyTreeMiniatureComponent } from '../../products/family-tree/family-tree-miniature/family-tree-miniature.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.css'],
})
export class DesignItemComponent implements OnInit {
  @ViewChild('productDesign', { static: true })
  miniature: FamilyTreeMiniatureComponent;
  @Input() familyTree: IFamilyTree;
  isLoading = false;

  constructor(private toastService: ToastService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  deleteDesign() {
    console.log('Delete design: ', this.familyTree);
  }

  editDesign() {
    console.log('Edit design: ', this.familyTree);
  }

  addDesignToBasket() {
    console.log('Add design to basket: ', this.familyTree);
  }
}
