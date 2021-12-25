import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CreateDiscountDialogComponent } from './create-discount-dialog.component';

describe('CreateDiscountDialogComponent', () => {
  let component: CreateDiscountDialogComponent;
  let fixture: ComponentFixture<CreateDiscountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDiscountDialogComponent],
      imports: [HttpClientModule, MatSnackBarModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDiscountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
