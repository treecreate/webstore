import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GoToBasketModalComponent } from './go-to-basket-modal.component';

describe('GoToBasketModalComponent', () => {
  let component: GoToBasketModalComponent;
  let fixture: ComponentFixture<GoToBasketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoToBasketModalComponent],
      imports: [NgbModule],
      providers: [NgbActiveModal],
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
