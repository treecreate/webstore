import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'webstore-product',
  templateUrl: './product.component.html',
  styleUrls: [
    './product.component.scss',
    './product.component.mobile.scss',
    '../../../assets/styles/tc-input-field.scss',
  ],
})
export class ProductComponent implements OnInit {
  fontCollection = [
    'Times new roman',
    'Roboto',
    'Georgia',
    'Share Tech',
    'Spectral',
    'Sansita',
  ];
  isMobileOptionOpen = false;
  designTitle = 'Untitled-1';
  font = this.fontCollection[0];
  design = 'first';
  boxSize = 10;
  banner = false;
  bigFont = false;

  constructor() {}

  ngOnInit(): void {
    // the lint test fail if the ngOnInit is empty 
    console.log('open product page');
  }

  showOptions() {
    this.isMobileOptionOpen = !this.isMobileOptionOpen;
  }

  nextDesign() {
    if (this.design === 'first') {
      this.design = 'second';
    } else {
      this.design = 'first';
    }
  }

  nextFont() {
    const fontIndex = this.fontCollection.indexOf(this.font);
    if (fontIndex < this.fontCollection.length - 1) {
      this.font = this.fontCollection[fontIndex + 1];
    } else {
      this.font = this.fontCollection[0];
    }
  }

  prevFont() {
    const selectedFont = this.fontCollection.indexOf(this.font);
    if (selectedFont === 0) {
      this.font = this.fontCollection[this.fontCollection.length - 1];
    } else {
      this.font = this.fontCollection[selectedFont - 1];
    }
  }

  onKey(event) {
    this.designTitle = event.target.value;
  }
}
