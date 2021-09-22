import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ChangePasswordModalComponent } from './change-password-modal.component';

describe('ChangePasswordModalComponent', () => {
  let component: ChangePasswordModalComponent;
  let fixture: ComponentFixture<ChangePasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordModalComponent],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
