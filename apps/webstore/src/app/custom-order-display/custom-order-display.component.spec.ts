import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderDisplayComponent } from './custom-order-display.component';

describe('CustomOrderDisplayComponent', () => {
  let component: CustomOrderDisplayComponent;
  let fixture: ComponentFixture<CustomOrderDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomOrderDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOrderDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
