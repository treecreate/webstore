import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IDesign } from '@interfaces';
import { IFamilyTree } from 'libs/interfaces/src/lib/design/family-tree';

@Component({
  selector: 'webstore-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.css'],
})
export class StoretItemComponent implements OnInit {
  @Input()
  design!: IDesign;

  @Input()
  isMutable!: boolean;

  familyTreeDesignProperties: IFamilyTree;

  constructor() {}

  ngOnInit(): void {
    if (this.design.designType === DesignTypeEnum.familyTree) {
      this.familyTreeDesignProperties = <IFamilyTree>this.design.designProperties;
    }
  }
}
