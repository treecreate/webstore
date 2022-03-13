import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NewsletterSignupModalComponent } from './newsletter-signup-modal.component';

describe('NewsletterSignupModalComponent', () => {
  let component: NewsletterSignupModalComponent;
  let fixture: ComponentFixture<NewsletterSignupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsletterSignupModalComponent],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterSignupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
