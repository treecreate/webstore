import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TermsOfUseModalComponent } from './terms-of-use-modal.component';

describe('TermsOfUseModalComponent', () => {
  let component: TermsOfUseModalComponent;
  let fixture: ComponentFixture<TermsOfUseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsOfUseModalComponent],
      imports: [NgbModule, HttpClientModule, RouterTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfUseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
