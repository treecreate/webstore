import { Component, OnInit } from '@angular/core';
import { IDesign } from '@interfaces';

@Component({
  selector: 'webstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  pageTitle = 'collection';
  // TODO: get collection of designs from user
  designCollection = [];

  scrollTop() {
    window.scroll(0, 0);
  }

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
