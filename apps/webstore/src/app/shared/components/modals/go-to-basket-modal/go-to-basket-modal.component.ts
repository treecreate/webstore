import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DesignDimensionEnum, ITransactionItem } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionItemService } from '../../../services/transaction-item/transaction-item.service';

@Component({
  selector: 'webstore-go-to-basket-modal',
  templateUrl: './go-to-basket-modal.component.html',
  styleUrls: ['./go-to-basket-modal.component.css'],
})
export class GoToBasketModalComponent implements OnInit {
  itemsInBasket = 0;
  basketPrice = 0;
  isLoading = false;
  constructor(
    public activeModal: NgbActiveModal,
    private transactionItemService: TransactionItemService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        let itemSum = 0;
        let priceSum = 0;
        for (let i = 0; i < itemList.length; i++) {
          itemSum += itemList[i].quantity;
          switch (itemList[i].dimension) {
            case DesignDimensionEnum.large:
              priceSum += itemList[i].quantity * 995;
              break;
            case DesignDimensionEnum.medium:
              priceSum += itemList[i].quantity * 695;
              break;
            case DesignDimensionEnum.small:
              priceSum += itemList[i].quantity * 495;
              break;
          }
        }
        this.itemsInBasket = itemSum;
        if (this.itemsInBasket >= 4) {
          this.basketPrice = priceSum * 0.75;
        } else {
          this.basketPrice = priceSum;
        }
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}
