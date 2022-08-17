import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IDesign, IFamilyTree, IQoutable } from '@interfaces';

@Component({
  selector: 'webstore-store-item',
  templateUrl: './store-item.component.html',
})
export class StoretItemComponent implements OnInit {
  @Input()
  design!: IDesign;

  @Input()
  isMutable!: boolean;

  familyTreeDesignProperties: IFamilyTree;
  quotableDesignProperties: IQoutable;
  designTypeEnum = DesignTypeEnum;

  constructor() {}

  ngOnInit(): void {
    if (this.design.designType === DesignTypeEnum.familyTree) {
      this.familyTreeDesignProperties = <IFamilyTree>this.design.designProperties;
    } else if (this.design.designType === DesignTypeEnum.quotable) {
      this.quotableDesignProperties = <IQoutable>this.design.designProperties;
    }
  }
}
