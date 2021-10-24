import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTreeIntroModalComponent } from './family-tree-intro-modal.component';

describe('FamiliTreeIntroComponent', () => {
  let component: FamilyTreeIntroModalComponent;
  let fixture: ComponentFixture<FamilyTreeIntroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyTreeIntroModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeIntroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
