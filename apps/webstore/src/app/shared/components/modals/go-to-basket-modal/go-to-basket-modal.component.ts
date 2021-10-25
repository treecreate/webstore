import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ITransactionItem } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { LocalStorageService } from '../../../services/local-storage';
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
    private transactionItemService: TransactionItemService,
    private calculatePriceService: CalculatePriceService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.transactionItemService.getTransactionItems().subscribe(
      (itemList: ITransactionItem[]) => {
        let itemSum = 0;
        for (let i = 0; i < itemList.length; i++) {
          itemSum += itemList[i].quantity;
        }
        this.itemsInBasket = itemSum;
        if (this.itemsInBasket >= 4) {
          this.basketPrice =
            this.calculatePriceService.getFullPrice(itemList) * 0.75;
        } else {
          this.basketPrice = this.calculatePriceService.getFullPrice(itemList);
        }
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  createNew() {
    this.localStorageService.removeItem(LocalStorageVars.designFamilyTree);
    this.activeModal.close();
  }
}
