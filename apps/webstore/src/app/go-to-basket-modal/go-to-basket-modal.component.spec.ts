import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToBasketModalComponent } from './go-to-basket-modal.component';

describe('GoToBasketModalComponent', () => {
  let component: GoToBasketModalComponent;
  let fixture: ComponentFixture<GoToBasketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoToBasketModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToBasketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
