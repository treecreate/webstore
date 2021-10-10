import { Component, Input, OnInit } from '@angular/core';
import { IDesign, IFamilyTree } from '@interfaces';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.css'],
})
export class DesignItemComponent implements OnInit {
  @Input() familyTree: IFamilyTree;

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
