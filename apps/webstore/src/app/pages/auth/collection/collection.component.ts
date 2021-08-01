import { Component, OnInit } from '@angular/core';
import { Design } from '@interfaces';

@Component({
  selector: 'webstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  designCollection = [
    // new Design('1', '1', 'test title'),
    // new Design('2', '2', 'test title'),
    // new Design('3', '3', 'test title'),
    // new Design('4', '2'),
    // new Design('5', '1', 'test title'),
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('collection');
  }
}
