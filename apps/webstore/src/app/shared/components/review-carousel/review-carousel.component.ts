import { Component } from '@angular/core';
import { LocaleType, LocalStorageVars } from '@models';
import { LocalStorageService } from '../../services/local-storage';

@Component({
  selector: 'webstore-review-carousel',
  templateUrl: './review-carousel.component.html',
  styleUrls: ['./review-carousel.component.css'],
})
export class ReviewCarouselComponent {
  reviewList = [
    {
      text: `“Fantastisk fint og helt unikt produkt, som rammer lige i
      'skabet'. Vi købte stamtræer til begge hold bedsteforældre
      som gaver, hvilket var en stor succes.”`,
      textEn: `"A fantastic and completely unique product, that is always on point. 
      We bought the family tree for both pairs of grandparent as a gift, which was a
      big success"`,
      name: 'Birgitte Hansson',
    },
    {
      text: `“10/10! Og mere til .. det for ros hvergang vi har gæster,
      og mange spørg til det. Meget lækkert produkt, kvalitet i
      top, vi er mere end tilfredse.”`,
      textEn: `10/10 and more .. It gets praise every time we have guests,
      and many ask about it. Very nice product, top quality and we are more
      than satisfied.`,
      name: 'Stine Olsen',
    },
    {
      text: `“Min familie blev utroligt glade for deres gave, jeg synes at det
      er fedt at kunne få familien med ind i indretning!”`,
      textEn: `My family was incredibly happy for their family tree, i think
      that it is nice to have the family be part of the house decorations.`,
      name: 'Sabrine Dam',
    },
    {
      text: `“jeg ELSKER jeres smukke måde at forevige familien på, og 
      har fået utallige komplimenter for det smukke familietræ. I pisse
      søde og hjælpsomme til at imødekomme ens ønsker.”`,
      textEn: `I LOVE your beautiful way of perpetuating the family, and 
      have gotten countless compliments on the beautiful family tree. You
      are so sweet to helpfull to your customers.`,
      name: 'Maria Sotskova',
    },
  ];

  locale$;
  localeCode;

  constructor(private localStorageService: LocalStorageService) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();
  }
}
