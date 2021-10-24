import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTreeIntroComponent } from './family-tree-intro.component';

describe('FamiliTreeIntroComponent', () => {
  let component: FamilyTreeIntroComponent;
  let fixture: ComponentFixture<FamilyTreeIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyTreeIntroComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
