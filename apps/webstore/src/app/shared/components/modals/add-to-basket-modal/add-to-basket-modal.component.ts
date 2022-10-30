import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  ErrorlogPriorityEnum,
  IAuthUser,
  IFamilyTree,
  IQoutable,
  ITransactionItem,
  QuotableTypeEnum,
} from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/authentication/auth.service';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { DesignService } from '../../../services/design/design.service';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';
import { ToastService } from '../../toast/toast-service';
import { GoToBasketModalComponent } from '../go-to-basket-modal/go-to-basket-modal.component';

@Component({
  selector: 'webstore-add-to-basket-modal',
  templateUrl: './add-to-basket-modal.component.html',
  styleUrls: ['./add-to-basket-modal.component.scss'],
})
export class AddToBasketModalComponent implements OnInit, OnChanges {
  @Input()
  designType?: DesignTypeEnum;

  @Input()
  quotableType?: QuotableTypeEnum;

  addToBasketForm: UntypedFormGroup;
  price = 0;
  isMoreThan4 = false;
  itemsInBasket = 0;
  totalPrice = 0;
  public localeCode: LocaleType;
  design: IFamilyTree | IQoutable;
  prodSizeList = ['SMALL', 'MEDIUM', 'LARGE'];
  isLoading = false;
  authUser$: BehaviorSubject<IAuthUser>;
  isLoggedIn = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private calculatePriceService: CalculatePriceService,
    private designService: DesignService,
    private transactionItemService: TransactionItemService,
    private authService: AuthService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
    // Listen to changes to login status
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);

    // Check if the user is logged in
    this.authUser$.subscribe(() => {
      // Check if the access token is still valid
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
    });

    this.addToBasketForm = new UntypedFormGroup({
      quantity: new UntypedFormControl('', [Validators.required, Validators.max(99), Validators.min(1)]),
      dimension: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // default the designType to Family tree if it's null
    if (this.designType === undefined || this.designType === null) {
      this.designType = DesignTypeEnum.familyTree;
    }

    switch (this.designType) {
      case DesignTypeEnum.familyTree:
        this.design = this.localStorageService.getItem<IFamilyTree>(LocalStorageVars.designFamilyTree).value;
        break;
      case DesignTypeEnum.quotable:
      default:
        if (this.quotableType) {
          switch (this.quotableType) {
            case QuotableTypeEnum.babySign:
              this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designBabySign).value;
              break;
            case QuotableTypeEnum.loveLetter:
              this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designLoveLetter).value;
              break;
            case QuotableTypeEnum.quotable:
            default:
              this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
          }
        } else {
          this.design = this.localStorageService.getItem<IQoutable>(LocalStorageVars.designQuotable).value;
        }
    }

    this.addToBasketForm.setValue({
      quantity: 1,
      dimension: DesignDimensionEnum.small,
    });

    this.isLoading = true;
    if (this.isLoggedIn) {
      this.transactionItemService.getTransactionItems().subscribe(
        (itemList: ITransactionItem[]) => {
          let itemSum = 0;
          let priceSum = 0;
          for (let i = 0; i < itemList.length; i++) {
            itemSum += itemList[i].quantity;
          }
          this.itemsInBasket = itemSum;
          priceSum = this.calculatePriceService.getFullPrice(itemList);
          this.totalPrice = priceSum;
          this.isLoading = false;
          this.updatePrice();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.errorlogsService.create(
            'webstore.add-to-basket-modal.fetch-transaction-items-failed',
            ErrorlogPriorityEnum.high,
            error
          );
          this.isLoading = false;
        }
      );
    } else {
      const itemList = this.localStorageService.getItem<ITransactionItem[]>(LocalStorageVars.transactionItems).value;
      if (itemList !== null) {
        let itemSum = 0;
        let priceSum = 0;
        for (let i = 0; i < itemList.length; i++) {
          itemSum += itemList[i].quantity;
        }
        this.itemsInBasket = itemSum;
        priceSum = this.calculatePriceService.getFullPrice(itemList);
        this.totalPrice = priceSum;
      }
      this.isLoading = false;
      this.updatePrice();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if the design type gets updated, recalculate all product information
    if (changes.designType !== undefined) {
      this.ngOnInit();
    }
  }

  updatePrice() {
    this.price = this.calculatePriceService.calculateItemPriceAlternative(
      this.addToBasketForm.get('quantity').value,
      this.addToBasketForm.get('dimension').value,
      this.designType
    );
    this.isMoreThan4 = this.itemsInBasket + this.addToBasketForm.get('quantity').value >= 4;
  }

  amountSaved() {
    return (this.price + this.totalPrice) * 0.25;
  }

  /**
   * Translate dimensions from an Enum value into a human readble string
   * @param dimension dimensions of the item
   * @param designType design type of the item
   * @returns string representing the design like '15cm x 15cm'
   */
  translateDimensionToCm(dimension: string, designType: DesignTypeEnum): string {
    switch (designType) {
      case DesignTypeEnum.familyTree: {
        switch (dimension) {
          case 'SMALL':
            return '20x20cm';
          case 'MEDIUM':
            return '25x25cm';
          case 'LARGE':
            return '30x30cm';
        }
        break;
      }
      case DesignTypeEnum.quotable: {
        switch (dimension) {
          case 'SMALL':
            return '15x15cm';
          case 'MEDIUM':
            return '20x20cm';
          case 'LARGE':
            return '25x25cm';
        }
        break;
      }
    }
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  increaseQuantity() {
    this.addToBasketForm.setValue({
      quantity: this.addToBasketForm.get('quantity').value + 1,
      dimension: this.addToBasketForm.get('dimension').value,
    });
    this.updatePrice();
  }

  decreaseQuantity() {
    if (this.addToBasketForm.get('quantity').value > 1) {
      this.addToBasketForm.setValue({
        quantity: this.addToBasketForm.get('quantity').value - 1,
        dimension: this.addToBasketForm.get('dimension').value,
      });
      this.updatePrice();
    }
  }

  increaseDimension() {
    switch (this.addToBasketForm.get('dimension').value) {
      case DesignDimensionEnum.small:
        this.addToBasketForm.setValue({
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
      case DesignDimensionEnum.medium:
        this.addToBasketForm.setValue({
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.large,
        });
        break;
    }
    this.updatePrice();
  }

  decreaseDimension() {
    switch (this.addToBasketForm.get('dimension').value) {
      case DesignDimensionEnum.medium:
        this.addToBasketForm.setValue({
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.small,
        });
        break;
      case DesignDimensionEnum.large:
        this.addToBasketForm.setValue({
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
    }
    this.updatePrice();
  }

  addDesignToBasket() {
    this.isLoading = true;
    if (this.isLoggedIn) {
      // Save design to user collection and create and save transactionItem to DB
      this.saveToDataBase();
    } else {
      // Save transactionItem to local storage
      this.saveToLocalStorage();
    }
  }

  setSize(size: string): void {
    this.addToBasketForm.get('dimension').setValue(size);
    this.updatePrice();
  }

  saveToLocalStorage(): void {
    // design id should be null
    this.transactionItemService.saveToLocalStorage(
      {
        designProperties: this.design,
        dimension: this.addToBasketForm.get('dimension').value,
        quantity: this.addToBasketForm.get('quantity').value,
      },
      this.designType
    );

    this.activeModal.close();
    this.modalService.open(GoToBasketModalComponent);
    this.isLoading = false;
    this.eventsService.create('webstore.add-to-basket-modal.add.local-storage');
  }

  //TODO: Check if this design is already in the users collection (by checking id before saving it as a new design) before trying to update it
  /**
   * Persist the design in the database (either update or create a new entry) and, if successful, create a transaction item for it (add to basket).
   */
  saveToDataBase(): void {
    // Check if the design is loaded using a design ID (design comes from a user account collection)
    if (this.route.snapshot.queryParams.designId !== undefined) {
      if (this.designType === DesignTypeEnum.familyTree) {
        this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, <IFamilyTree>this.design);
      } else if (this.designType === DesignTypeEnum.quotable) {
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, <IQoutable>this.design);
      } else {
        console.warn('Aborting, tried to save a design with invalid design type: ', this.designType);
        this.errorlogsService.create(
          `webstore.add-to-basket-modal.save-design-is-invalid.${this.designType}`,
          ErrorlogPriorityEnum.high,
          null
        );
        return;
      }
      //Update design title in collection
      this.designService
        .updateDesign({
          designId: this.route.snapshot.queryParams.designId,
          designType: this.designType,
          designProperties: this.design,
        })
        .subscribe({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            console.error('Failed to save design', error);
            this.errorlogsService.create(
              'webstore.add-to-basket-modal.update-design-failed',
              ErrorlogPriorityEnum.high,
              error
            );
          },
        });
    }

    // Add an entry for the design to the basket (transaction item). Includes creation of a immutable version of the design
    this.designService
      .createDesign({
        designType: this.designType,
        designProperties: this.design,
        mutable: false, // the transaction-item related designs are immutable
      })
      .subscribe({
        next: (result) => {
          this.transactionItemService
            .createTransactionItem({
              designId: result.designId,
              dimension: this.addToBasketForm.get('dimension').value,
              quantity: this.addToBasketForm.get('quantity').value,
            })
            .subscribe({
              next: () => {
                this.isLoading = false;
                this.toastService.showAlert('Design added to basket', 'Design er lagt i kurven', 'success', 5000);
                this.activeModal.close();
                this.modalService.open(GoToBasketModalComponent);
                this.eventsService.create(`webstore.add-to-basket-modal.add.${this.designType}`);
              },
              error: (error: HttpErrorResponse) => {
                console.error(error);
                this.errorlogsService.create(
                  'webstore.add-to-basket-modal.add-design-to-basket-failed',
                  ErrorlogPriorityEnum.high,
                  error
                );
                this.toastService.showAlert(
                  'Failed to add design to basket, please try again',
                  'Der skete en fejl, prøv venligst igen',
                  'danger',
                  5000
                );
                this.isLoading = false;
              },
            });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to save design', error);
          this.errorlogsService.create(
            'webstore.add-to-basket-modal.save-design-failed',
            ErrorlogPriorityEnum.high,
            error
          );
          this.toastService.showAlert('Failed to save your design', 'Kunne ikke gemme dit design', 'danger', 10000);
        },
      });
  }
}
