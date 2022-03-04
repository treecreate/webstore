import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTreeTemplateModalComponent } from './family-tree-template-modal.component';

describe('FamilyTreeTemplateModalComponent', () => {
  let component: FamilyTreeTemplateModalComponent;
  let fixture: ComponentFixture<FamilyTreeTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyTreeTemplateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
