import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniProductDisplayComponent } from './mini-product-display.component';

describe('MiniProductDisplayComponent', () => {
  let component: MiniProductDisplayComponent;
  let fixture: ComponentFixture<MiniProductDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniProductDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniProductDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
