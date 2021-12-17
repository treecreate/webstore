import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscountComponent } from './edit-discount.component';

describe('EditDiscountComponent', () => {
  let component: EditDiscountComponent;
  let fixture: ComponentFixture<EditDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
