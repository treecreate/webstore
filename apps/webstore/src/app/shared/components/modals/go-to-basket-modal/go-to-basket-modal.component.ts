import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IAuthUser, ITransactionItem } from '@interfaces';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/authentication/auth.service';
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
  isLoggedIn = false;
  basketPrice = 0;
  isLoading = false;
  authUser$: BehaviorSubject<IAuthUser>;
  constructor(
    public activeModal: NgbActiveModal,
    private transactionItemService: TransactionItemService,
    private calculatePriceService: CalculatePriceService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(
      LocalStorageVars.authUser
    );
    this.authUser$.subscribe(() => {
      this.isLoggedIn =
        this.authUser$.getValue() != null &&
        this.authService.isAccessTokenValid();
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    if (this.isLoggedIn) {
      this.getBasketInfoFromDB();
    } else {
      this.getBasketInfoFromLocalStorage();
    }
  }

  getBasketInfoFromLocalStorage() {
    const itemsList = this.localStorageService.getItem<ITransactionItem[]>(
      LocalStorageVars.transactionItems
    ).value;
    if (itemsList != null) {
      let itemSum = 0;
      for (let i = 0; i < itemsList.length; i++) {
        itemSum += itemsList[i].quantity;
      }
      this.itemsInBasket = itemSum;
      if (this.itemsInBasket >= 4) {
        this.basketPrice =
          this.calculatePriceService.getFullPrice(itemsList) * 0.75;
      } else {
        this.basketPrice = this.calculatePriceService.getFullPrice(itemsList);
      }
    }
    this.isLoading = false;
  }

  getBasketInfoFromDB() {
    this.transactionItemService.getTransactionItems().subscribe(
      (itemsList: ITransactionItem[]) => {
        let itemSum = 0;
        for (let i = 0; i < itemsList.length; i++) {
          itemSum += itemsList[i].quantity;
        }
        this.itemsInBasket = itemSum;
        if (this.itemsInBasket >= 4) {
          this.basketPrice =
            this.calculatePriceService.getFullPrice(itemsList) * 0.75;
        } else {
          this.basketPrice = this.calculatePriceService.getFullPrice(itemsList);
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
