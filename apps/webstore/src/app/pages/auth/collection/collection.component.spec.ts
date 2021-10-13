import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyTreeCollectionItemComponent } from '../../../shared/components/items/family-tree-collection-item/family-tree-collection-item.component';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
  let fixture: ComponentFixture<CollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionComponent, FamilyTreeCollectionItemComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(CollectionComponent);
    const collection = fixture.componentInstance;
    expect(collection.pageTitle).toEqual('collection');
  });
});
