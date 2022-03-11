import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FamilyTreeTemplateModalComponent } from './family-tree-template-modal.component';

describe('FamilyTreeTemplateModalComponent', () => {
  let component: FamilyTreeTemplateModalComponent;
  let fixture: ComponentFixture<FamilyTreeTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyTreeTemplateModalComponent],
      imports: [NgbModule, RouterTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
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
