import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RejectedCookiesComponent } from './rejected-cookies.component';

describe('RejectedCookiesComponent', () => {
  let component: RejectedCookiesComponent;
  let fixture: ComponentFixture<RejectedCookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectedCookiesComponent],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
