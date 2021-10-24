import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GoToBasketModalComponent } from './go-to-basket-modal.component';

describe('GoToBasketModalComponent', () => {
  let component: GoToBasketModalComponent;
  let fixture: ComponentFixture<GoToBasketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoToBasketModalComponent],
      providers: [NgbActiveModal],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
    }).compileComponents();
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
