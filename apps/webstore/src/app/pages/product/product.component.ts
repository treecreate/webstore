import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', '../../../assets/styles/tc-input-field.scss']
})
export class ProductComponent implements OnInit {

  fontCollection = ["times new roman", "roboto", "Helvetica"]

  designTitle: string = "Untitled-1"
  font: string = "times new roman" 
  design: string = "first"
  boxSize: number = 10; 
  banner: boolean = false; 
  bigFont: boolean = false; 

  constructor() { }

  ngOnInit(): void {
  }

  nextDesign() {
    if (this.design === "first") {
      this.design = "second"
    } else {
      this.design = "first"
    }
  }

  nextFont() {
    let selectedFont = this.fontCollection.indexOf(this.font)
    if (selectedFont > 1) {
      this.font = this.fontCollection[0]
    } else {
      this.font = this.fontCollection[selectedFont+1]
    }
  }

  prevFont() {
    let selectedFont = this.fontCollection.indexOf(this.font)
    if (selectedFont < 1) {
      this.font = this.fontCollection[2]
    } else {
      this.font = this.fontCollection[selectedFont-1]
    }
  }

  onKey(event: any) {
    this.designTitle = event.target.value; 
  }

}
