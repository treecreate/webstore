import { Component, HostListener, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
import { EventsService } from '../../shared/services/events/events.service';
import { reviewList } from './reviews.constant';

@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home.mobile.component.scss'],
})
export class HomeComponent implements OnInit {
  initialTop: 0;
  showUpArrow = false;
  showStartButton = false;
  public localeCode: LocaleType;
  reviews = reviewList;

  title = 'homeComponent';

  constructor(
    private localStorageService: LocalStorageService,
    public eventsService: EventsService,
    private metaTitle: Title,
    private meta: Meta
  ) {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
  }

  ngOnInit(): void {
    this.setMetaData();
  }

  setMetaData() {
    this.metaTitle.setTitle('Treecreate | En miljøvenlig og personlig gave 2022');
    this.meta.updateTag({
      name: 'description',
      content:
        'En personlig gave, der får folk tættere på hinanden. For 299 kr, kan du bestille en helt unik og miljøvenlig gave til én, du holder af.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'gave, personlig, miljøvenlig, bryllup, barnedåb, fødselsdagsgave, design, dekoration, gaveide, bæredygtig',
    });
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
