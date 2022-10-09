import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesignTypeEnum, ErrorlogPriorityEnum, IDesign, IFamilyTree, IQoutable, QuotableTypeEnum } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DesignService } from '../../../services/design/design.service';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { AddToBasketModalComponent } from '../../modals/add-to-basket-modal/add-to-basket-modal.component';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.css'],
})
export class CollectionItemComponent implements OnInit {
  @Input() design: IDesign;
  isLoading = false;

  @Output() deleteEvent = new EventEmitter();
  public designTypeEnum = DesignTypeEnum;

  localeCode: LocaleType;

  constructor(
    private toastService: ToastService,
    private designService: DesignService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
  }

  deleteDesign() {
    this.isLoading = true;
    this.designService.deleteDesign(this.design.designId).subscribe({
      next: () => {
        this.toastService.showAlert('The design has been deleted', 'Designet er slettet', 'danger', 5000);
        this.isLoading = false;
        this.deleteEvent.emit(this.design.designId);
        this.eventsService.create('webstore.collection-item.collection-item-removed');
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.errorlogsService.create(
          'webstore.collection-item.delete-design-item-failed',
          ErrorlogPriorityEnum.high,
          error
        );
      },
    });
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
    this.eventsService.create('webstore.collection-item.item-added-to-basket');
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

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  getProductName(): string {
    switch (this.design.designType) {
      case DesignTypeEnum.familyTree:
        return this.isEnglish() ? 'Family tree' : 'Stamtræ';
      case DesignTypeEnum.quotable:
      default:
        switch ((this.design.designProperties as IQoutable).quotableType) {
          case QuotableTypeEnum.babySign:
            return this.isEnglish() ? 'Baby sign' : 'Baby skilt';
          case QuotableTypeEnum.loveLetter:
            return this.isEnglish() ? 'Love letter' : 'Kærlighedsbrevet';
          case QuotableTypeEnum.quotable:
          default:
            return this.isEnglish() ? 'Quotable' : 'Citat ramme';
        }
    }
  }
}
