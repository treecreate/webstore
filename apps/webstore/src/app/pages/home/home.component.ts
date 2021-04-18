import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    './home.component.mobile.css',
    './home.component.side-scroll.css',
  ],
})
export class HomeComponent implements OnInit {
  initialTop: 0;
  parallaxRatio: number;

  title = 'homeComponent';

  constructor(private eleRef: ElementRef) {
    this.initialTop = 0;
    this.parallaxRatio = 0.7;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    return this.initialTop - window.scrollY * this.parallaxRatio + 'px';
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
