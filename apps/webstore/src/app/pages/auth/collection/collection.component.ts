import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDesign, IFamilyTree } from '@interfaces';
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
  familyTreeCollection: IFamilyTree[] = [];
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
    this.getDesigns();
  }

  getDesigns(): void {
    this.isLoading = true;
    this.designService.getDesigns().subscribe(
      (designList: IDesign[]) => {
        this.designCollection = designList;
        for (let i = 0; i < designList.length; i++) {
          this.familyTreeCollection.push(designList[i].designProperties);
        }
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
