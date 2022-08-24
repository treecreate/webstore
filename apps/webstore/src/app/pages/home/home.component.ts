import { Component, HostListener, OnInit } from '@angular/core';
import { LocaleType, LocalStorageVars } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '@local-storage';
import { NewsletterSignupModalComponent } from '../../shared/components/modals/newsletter-signup-modal/newsletter-signup-modal.component';

@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  initialTop: 0;
  showUpArrow = false;
  showStartButton = false;
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  reviews = [
    {
      id: 1,
      alt: '3 personlige gaver',
      url: '/assets/img/review-img/review-img-04.jpg',
      name: 'Maria',
      textEn: `"I LOVE your beautiful way of perpetuating the family, and have gotten countless compliments on the beautiful family tree. You are so sweet to helpfull to your customers."`,
      textDk: `“Fantastisk fint og helt unikt produkt, som rammer lige i 'skabet'. Vi købte stamtræer til begge hold bedsteforældre som gaver, hvilket var en stor succes.”`,
    },
    {
      id: 2,
      alt: 'En gave til farmor',
      url: '/assets/img/review-img/review-img-01.jpg',
      name: 'Stine',
      textEn: `"10/10 and more .. It gets praise every time we have guests, and many ask about it. Very nice product, top quality and we are more than satisfied."`,
      textDk: `“10/10! Og mere til .. det får ros hver gang vi har gæster, og mange spørger ind til det. Meget lækkert produkt, kvalitet i top, vi er mere end tilfredse.”`,
    },
    {
      id: 3,
      alt: 'En gave til mor',
      url: '/assets/img/review-img/review-img-03.jpg',
      name: 'Sabrine',
      textEn: `"My family was incredibly happy for their family tree, i think that it is nice to have the family be part of the house decorations."`,
      textDk: `“Min familie blev utroligt glade for deres gave, jeg synes at det er fedt at kunne få familien med ind i indretning!”`,
    },
    {
      id: 4,
      alt: 'Familien samlet om gaven',
      url: '/assets/img/review-img/review-img-02.jpg',
      name: 'Birgitte',
      textEn: `"A fantastic and completely unique product, that is always on point. We bought the family tree for both pairs of grandparent as a gift, which was a big success"`,
      textDk: `“Fantastisk fint og helt unikt produkt, som rammer lige i 'skabet'. Vi købte stamtræer til begge hold bedsteforældre som gaver, hvilket var en stor succes.”`,
    },
  ];

  title = 'homeComponent';

  constructor(private localStorageService: LocalStorageService, private modalService: NgbModal) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  ngOnInit(): void {
    const hasSeenNewsletterModal = this.localStorageService.getItem<boolean>(LocalStorageVars.hasSeenNewsletterModal);
    if (!hasSeenNewsletterModal.value) {
      setTimeout(() => {
        this.modalService.open(NewsletterSignupModalComponent);
        this.localStorageService.setItem<boolean>(LocalStorageVars.hasSeenNewsletterModal, true);
      }, 5000);
    }
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  @HostListener('window:scroll')
  onScrollShow() {
    // For the up arrow that scrolls to top
    if (window.scrollY > 800) {
      this.showUpArrow = true;
    } else {
      this.showUpArrow = false;
    }
    // For the start button
    if (window.scrollY < 50) {
      this.showStartButton = false;
    } else if (window.scrollY < 1800) {
      this.showStartButton = true;
    } else {
      this.showStartButton = false;
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
