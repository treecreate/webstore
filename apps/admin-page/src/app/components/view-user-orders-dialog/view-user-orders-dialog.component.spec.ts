import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ViewUserOrdersDialogComponent } from './view-user-orders-dialog.component';

describe('ViewUserOrdersDialogComponent', () => {
  let component: ViewUserOrdersDialogComponent;
  let fixture: ComponentFixture<ViewUserOrdersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserOrdersDialogComponent],
      imports: [HttpClientModule, MatDialogModule, MatSnackBarModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserOrdersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
