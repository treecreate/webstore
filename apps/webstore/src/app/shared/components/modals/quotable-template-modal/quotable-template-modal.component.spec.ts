import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotableTemplateModalComponent } from './quotable-template-modal.component';

describe('QuotableTemplateModalComponent', () => {
  let component: QuotableTemplateModalComponent;
  let fixture: ComponentFixture<QuotableTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotableTemplateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotableTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
