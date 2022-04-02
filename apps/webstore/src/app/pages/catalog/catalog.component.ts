import { Component } from '@angular/core';
import { CatalogItem } from './catalogItems';
import catalogItems from './catalogItems';

@Component({
  selector: 'webstore-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  catalogList: CatalogItem[] = catalogItems;

  constructor() {}
}
