import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  IFamilyTree,
  ITransactionItem,
} from '@interfaces';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { DesignService } from '../../../services/design/design.service';
import { LocalStorageService } from '../../../services/local-storage';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';
import { ToastService } from '../../toast/toast-service';
import { GoToBasketModalComponent } from '../go-to-basket-modal/go-to-basket-modal.component';

@Component({
  selector: 'webstore-add-to-basket-modal',
  templateUrl: './add-to-basket-modal.component.html',
  styleUrls: ['./add-to-basket-modal.component.scss'],
})
export class AddToBasketModalComponent implements OnInit {
  addToBasketForm: FormGroup;
  price: number;
  isMoreThan4: boolean;
  itemsInBasket: number;
  totalPrice: number;
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  design;
  isLoading = false;
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private calculatePriceService: CalculatePriceService,
    private designService: DesignService,
    private transactionItemService: TransactionItemService
  ) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();
    this.locale$.subscribe(() => {
      console.log('Locale changed to: ' + this.locale$.getValue());
    });
  }

  ngOnInit(): void {
    this.addToBasketForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
      ]),
      quantity: new FormControl('', [
        Validators.required,
        Validators.max(99),
        Validators.min(1),
      ]),
      dimension: new FormControl('', [Validators.required]),
    });

    this.design = this.localStorageService.getItem<IFamilyTree>(
      LocalStorageVars.designFamilyTree
    ).value;

    this.addToBasketForm.setValue({
      title: this.design ? this.design.title : '',
      quantity: 1,
      dimension: DesignDimensionEnum.small,
    });

    new Promise(() => {
      //Get items already in basket
      this.isLoading = true;
      this.transactionItemService.getTransactionItems().subscribe(
        (itemList: ITransactionItem[]) => {
          let itemSum = 0;
          let priceSum = 0;
          for (let i = 0; i < itemList.length; i++) {
            itemSum += itemList[i].quantity;
            switch (itemList[i].dimension) {
              case 'SMALL':
                priceSum += itemList[i].quantity * 495;
                break;
              case 'MEDIUM':
                priceSum += itemList[i].quantity * 695;
                break;
              case 'LARGE':
                priceSum += itemList[i].quantity * 995;
                break;
            }
          }
          this.itemsInBasket = itemSum;
          this.totalPrice = priceSum;
          this.isLoading = false;
          this.updatePrice();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    });
  }

  updatePrice() {
    this.price = this.calculatePriceService.calculateItemPriceAlternative(
      this.addToBasketForm.get('quantity').value,
      this.addToBasketForm.get('dimension').value
    );
    this.isMoreThan4 =
      this.itemsInBasket + this.addToBasketForm.get('quantity').value >= 4;
  }

  amountSaved() {
    return (this.price + this.totalPrice) * 0.25;
  }

  translateDimension(dimension: string): string {
    switch (dimension) {
      case 'SMALL':
        return '20cm x 20cm';
      case 'MEDIUM':
        return '25cm x 25cm';
      case 'LARGE':
        return '30cm x 30cm';
    }
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  increaseQuantity() {
    this.addToBasketForm.setValue({
      title: this.addToBasketForm.get('title').value,
      quantity: this.addToBasketForm.get('quantity').value + 1,
      dimension: this.addToBasketForm.get('dimension').value,
    });
    this.updatePrice();
  }

  decreaseQuantity() {
    if (this.addToBasketForm.get('quantity').value > 1) {
      this.addToBasketForm.setValue({
        title: this.addToBasketForm.get('title').value,
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
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
      case DesignDimensionEnum.medium:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
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
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.small,
        });
        break;
      case DesignDimensionEnum.large:
        this.addToBasketForm.setValue({
          title: this.addToBasketForm.get('title').value,
          quantity: this.addToBasketForm.get('quantity').value,
          dimension: DesignDimensionEnum.medium,
        });
        break;
    }
    this.updatePrice();
  }

  addDesignToBasket() {
    this.isLoading = true;
    this.design.title = this.addToBasketForm.get('title').value;
    // Persist the design as a new one, and, if successful, create a transaction item for it
    //TODO: Check if this design is already in the users collection (by checking id before saving it as a new design)
    this.designService
      .createDesign({
        designType: DesignTypeEnum.familyTree,
        designProperties: this.design,
        mutable: false, // the transaction-item related designs are immutable
      })
      .subscribe(
        (result) => {
          console.log('Design created and persisted', result);
          // Removed to use the goToBasket modal instead
          // this.router.navigate([], {
          //   relativeTo: this.route,
          //   queryParams: { designId: result.designId },
          //   queryParamsHandling: 'merge', // remove to replace all query params by provided
          // });
          // Create the transaction item with the newly persisted design
          console.log('design properties', {
            designId: result.designId,
            dimension: this.addToBasketForm.get('dimension').value,
            quantity: this.addToBasketForm.get('quantity').value,
          });
          this.transactionItemService
            .createTransactionItem({
              designId: result.designId,
              dimension: this.addToBasketForm.get('dimension').value,
              quantity: this.addToBasketForm.get('quantity').value,
            })
            .subscribe(
              (newItem: ITransactionItem) => {
                this.isLoading = false;
                console.log('added design to basket', newItem);
                this.toastService.showAlert(
                  'Design added to basket',
                  'Design er lagt i kurven',
                  'success',
                  5000
                );
                this.activeModal.close();
                this.modalService.open(GoToBasketModalComponent);
              },
              (error: HttpErrorResponse) => {
                console.error(error);
                this.toastService.showAlert(
                  'Failed to add design to basket, please try again',
                  'Der skete en fejl, prøv venligst igen',
                  'danger',
                  5000
                );
                this.isLoading = false;
              }
            );
        },
        (error: HttpErrorResponse) => {
          console.error('Failed to save design', error);
          this.toastService.showAlert(
            'Failed to save your design',
            'Kunne ikke gemme dit design',
            'danger',
            10000
          );
        }
      );
  }
}
