import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('collection');
  }
}
