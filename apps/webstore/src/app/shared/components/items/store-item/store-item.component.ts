import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IDesign, IFamilyTree, IPetSign, IQoutable } from '@interfaces';

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
    switch (this.design.designType) {
      case DesignTypeEnum.familyTree:
        this.familyTreeDesignProperties = <IFamilyTree>this.design.designProperties;
        break;
      case DesignTypeEnum.quotable:
        this.quotableDesignProperties = <IQoutable>this.design.designProperties;
        break;
      case DesignTypeEnum.petSign:
        this.quotableDesignProperties = <IPetSign>this.design.designProperties;
        break;
    }
  }
}
