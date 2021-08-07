import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignItemComponent } from '../../../shared/components/design-item/design-item.component';

import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionComponent, DesignItemComponent],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CollectionComponent);
    const collection = fixture.componentInstance;
    expect(collection.pageTitle).toEqual('collection');
  });
});
