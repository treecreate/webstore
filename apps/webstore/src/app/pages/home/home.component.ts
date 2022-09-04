import { Component, HostListener, OnInit } from '@angular/core';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '@local-storage';
import { NewsletterSignupModalComponent } from '../../shared/components/modals/newsletter-signup-modal/newsletter-signup-modal.component';
import { reviewList } from './reviews.constant';
import { Meta, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  reviews = reviewList;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    private modalService: NgbModal,
    private metaTitle: Title,
    private meta: Meta
  ) {
    // Listen to changes to locale
    this.locale$ = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale);
    this.localeCode = this.locale$.getValue();
  }

  ngOnInit(): void {
    this.setMetaData();

    const hasSeenNewsletterModal = this.localStorageService.getItem<boolean>(LocalStorageVars.hasSeenNewsletterModal);
    if (!hasSeenNewsletterModal.value) {
      setTimeout(() => {
        this.modalService.open(NewsletterSignupModalComponent);
        this.localStorageService.setItem<boolean>(LocalStorageVars.hasSeenNewsletterModal, true);
      }, 5000);
    }
  }

  setMetaData() {
    this.metaTitle.setTitle('Treecreate | En miljøvenlig og personlig gave 2022');
    this.meta.updateTag({ name: 'description', content: 'En personlig gave, der får folk tættere på hinanden. For 299 kr, kan du bestille en helt unik og miljøvenlig gave til én, du holder af.' });
    this.meta.updateTag({ name: 'keywords', content: 'gave, personlig, miljøvenlig, bryllup, barnedåb, fødselsdagsgave, design, dekoration, gaveide, bæredygtig' });
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
