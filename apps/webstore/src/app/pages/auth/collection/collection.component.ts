import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DesignTypeEnum, IDesign } from '@interfaces';
import { DesignService } from '../../../shared/services/design/design.service';

@Component({
  selector: 'webstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  pageTitle = 'collection';
  designCollection: IDesign[] = [];
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(private designService: DesignService) {}

  ngOnInit(): void {
    this.getDesigns();
  }

  removeItemFromList(itemId: string) {
    console.warn('deleting design from collection', itemId);
    this.designCollection = this.designCollection.filter((item) => itemId !== item.designId);
  }

  getDesigns(): void {
    this.isLoading = true;
    this.designService.getDesigns().subscribe(
      (designList: IDesign[]) => {
        this.designCollection = designList.filter((design) => design.mutable);
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.alert = {
          message: 'Failed to get a list of items',
          type: 'danger',
          dismissible: false,
        };
        this.isLoading = false;
      }
    );
  }

  scrollTop() {
    window.scroll(0, 0);
  }
}
