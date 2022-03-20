import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IDesign, IFamilyTree } from '@interfaces';

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
  designTypeEnum = DesignTypeEnum;

  constructor() {}

  ngOnInit(): void {
    if (this.design.designType === DesignTypeEnum.familyTree) {
      this.familyTreeDesignProperties = <IFamilyTree>this.design.designProperties;
    }
  }
}
