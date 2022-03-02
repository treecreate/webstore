import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSignupModalComponent } from './newsletter-signup-modal.component';

describe('NewsletterSignupModalComponent', () => {
  let component: NewsletterSignupModalComponent;
  let fixture: ComponentFixture<NewsletterSignupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsletterSignupModalComponent ]
    })
    .compileComponents();
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
