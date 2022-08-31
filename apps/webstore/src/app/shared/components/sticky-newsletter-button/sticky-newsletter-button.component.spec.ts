import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyNewsletterButtonComponent } from './sticky-newsletter-button.component';

describe('StickyNewsletterButtonComponent', () => {
  let component: StickyNewsletterButtonComponent;
  let fixture: ComponentFixture<StickyNewsletterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StickyNewsletterButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StickyNewsletterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
