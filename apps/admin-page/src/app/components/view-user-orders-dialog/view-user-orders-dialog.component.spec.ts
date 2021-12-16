import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserOrdersDialogComponent } from './view-user-orders-dialog.component';

describe('ViewUserOrdersDialogComponent', () => {
  let component: ViewUserOrdersDialogComponent;
  let fixture: ComponentFixture<ViewUserOrdersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserOrdersDialogComponent],
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
