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
import { EventsService } from '../../../services/events/events.service';
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
    private authService: AuthService,
    public eventsService: EventsService
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
    // this.clearDesign();
    this.activeModal.close();
    this.router.navigate(['/products']);
  }

  // I commented this out since its not certain that the user wishes to clear their design.
  // Instead i just redirect to products page since the user always has the option to clear design later.
  // This is also in case the user adds a design to basket (normally removing it from local) and there
  // being a spelling error or something they want to change. Then they have to re-create the design
  // but since it stays in local they can just re add it after changes and remove the wrong one from basket.

  // clearDesign() {
  //   // Check what product page the user is on
  //   if (this.router.url.includes('/products/quotable')) {
  //     // Get quotable type from params
  //     // Remove product from local storage
  //     switch (this.route.snapshot.queryParams.productType) {
  //       case QuotableTypeEnum.babySign:
  //         this.localStorageService.removeItem(LocalStorageVars.designBabySign);
  //         break;
  //       case QuotableTypeEnum.loveLetter:
  //         this.localStorageService.removeItem(LocalStorageVars.designLoveLetter);
  //         break;
  //       case QuotableTypeEnum.quotable:
  //       default:
  //         this.localStorageService.removeItem(LocalStorageVars.designQuotable);
  //     }
  //   } else if (this.router.url.includes('/products/family-tree')) {
  //     // Remove family tree from local storage
  //     this.localStorageService.removeItem(LocalStorageVars.designFamilyTree);
  //   }

  //   if (this.route.snapshot.queryParams.designId === undefined) {
  //     this.router.navigate(['/products']);
  //   } else {
  //     // clear the designId param, triggering refetching of data
  //     this.router.navigate([], {
  //       relativeTo: this.route,
  //       queryParams: { designId: null },
  //       queryParamsHandling: 'merge', // remove to replace all query params by provided
  //     });
  //   }
  // }
}
