import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CookiePromptModalComponent } from './cookie-prompt-modal.component';

describe('CookiePromptComponent', () => {
  let component: CookiePromptModalComponent;
  let fixture: ComponentFixture<CookiePromptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiePromptModalComponent],
      imports: [NgbModule, RouterTestingModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePromptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
