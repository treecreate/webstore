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
  
  fontCollection = ['Times new roman', 'Roboto', 'Georgia', 'Share Tech', 'Spectral', 'Sansita'];
  isMobileOptionOpen: boolean = false;
  designTitle: string = 'Untitled-1';
  font: string = this.fontCollection[0];
  design: string = 'first';
  boxSize: number = 10;
  banner: boolean = false;
  bigFont: boolean = false;

  constructor() {}

  ngOnInit(): void {}

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
    let fontIndex = this.fontCollection.indexOf(this.font)
    if (fontIndex < this.fontCollection.length -1) {
      this.font = this.fontCollection[fontIndex + 1];
    } else {
      this.font = this.fontCollection[0];
    }
  }

  prevFont() {
    let selectedFont = this.fontCollection.indexOf(this.font);
    if (selectedFont == 0) {
      this.font = this.fontCollection[ this.fontCollection.length - 1 ];
    } else {
      this.font = this.fontCollection[ selectedFont - 1];
    }
  }

  onKey(event: any) {
    this.designTitle = event.target.value;
  }
}
