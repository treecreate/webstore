import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuotableTemplateModalComponent } from './quotable-template-modal.component';

describe('QuotableTemplateModalComponent', () => {
  let component: QuotableTemplateModalComponent;
  let fixture: ComponentFixture<QuotableTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotableTemplateModalComponent],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
      providers: [NgbActiveModal],
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