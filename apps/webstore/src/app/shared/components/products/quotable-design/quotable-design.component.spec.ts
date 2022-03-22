import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotableDesignComponent } from './quotable-design.component';

describe('QuotableDesignComponent', () => {
  let component: QuotableDesignComponent;
  let fixture: ComponentFixture<QuotableDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotableDesignComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotableDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
