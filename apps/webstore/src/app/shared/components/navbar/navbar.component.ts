import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import {
  LocalStorageService,
  LocalStorageVars,
} from '../../services/local-storage';
import { CookiePromptModalComponent } from '../modals/cookie-prompt-modal/cookie-prompt-modal.component';

@Component({
  selector: 'webstore-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  public isLoggedIn = true;
  cookies$: BehaviorSubject<Boolean>;

  basketItemOptions(amount: Number): string {
    if (amount === 0) {
      return 'Basket empty';
    }
    return `(${amount}) products `;
  }

  constructor(
    public modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    //Cookie prompt
    //Open cookie prompt if cookies are not accepted yet
    this.cookies$ = this.localStorageService.getItem<Boolean>(
      LocalStorageVars.cookies
    );
    if (!this.cookies$.getValue()) {
      this.modalService.open(CookiePromptModalComponent, {
        backdrop: 'static',
      });
    }
  }
}
