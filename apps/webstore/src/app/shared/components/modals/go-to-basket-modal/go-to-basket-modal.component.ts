import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthUser, ITransactionItem } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/authentication/auth.service';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
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
    private route: ActivatedRoute,
    private router: Router,
    private transactionItemService: TransactionItemService,
    private calculatePriceService: CalculatePriceService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser);
    this.authUser$.subscribe(() => {
      this.isLoggedIn = this.authUser$.getValue() != null && this.authService.isAccessTokenValid();
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
    const itemsList = this.localStorageService.getItem<ITransactionItem[]>(LocalStorageVars.transactionItems).value;
    if (itemsList != null) {
      let itemSum = 0;
      for (let i = 0; i < itemsList.length; i++) {
        itemSum += itemsList[i].quantity;
      }
      this.itemsInBasket = itemSum;
      if (this.itemsInBasket >= 4) {
        this.basketPrice = this.calculatePriceService.getFullPrice(itemsList) * 0.75;
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
          this.basketPrice = this.calculatePriceService.getFullPrice(itemsList) * 0.75;
        } else {
          this.basketPrice = this.calculatePriceService.getFullPrice(itemsList);
        }
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error(error.error);
      }
    );
  }

  createNew() {
    this.activeModal.close();
    this.clearDesign();
  }

  clearDesign() {
    let itemType = LocalStorageVars.designFamilyTree;

    switch (this.router.url) {
      case '/products/family-tree': {
        itemType = LocalStorageVars.designFamilyTree;
        break;
      }
      case '/products/quotable': {
        itemType = LocalStorageVars.designQuotable;
        break;
      }
    }
    this.localStorageService.removeItem(itemType);
    if (this.route.snapshot.queryParams.designId === undefined) {
      // trigger reload of the page by switching to another page and back
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    } else {
      // clear the designId param, triggering refetching of data
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { designId: null },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    }
  }
}
