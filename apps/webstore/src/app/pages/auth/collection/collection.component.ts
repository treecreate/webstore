import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDesign } from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';
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

  constructor(
    private designService: DesignService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.designService.getDesigns().subscribe(
      (designList: IDesign[]) => {
        this.isLoading = false;
        this.designCollection = designList;
        console.log('designs fetched: ', designList);
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
