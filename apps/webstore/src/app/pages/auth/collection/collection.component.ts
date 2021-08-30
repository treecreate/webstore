import { Component, OnInit } from '@angular/core';
import { Design } from '@interfaces';

@Component({
  selector: 'webstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  pageTitle = 'collection';
  // TODO: get collection of designs from user
  designCollection = [
    new Design('1', '1', 'test title'),
    new Design('2', '2', 'test title'),
    new Design('3', '3', 'test title'),
    new Design('4', '2'),
    new Design('5', '1', 'test title'),
  ];

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
