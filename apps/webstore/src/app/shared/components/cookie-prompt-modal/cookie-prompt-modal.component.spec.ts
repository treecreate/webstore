import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePromptModalComponent } from './cookie-prompt-modal.component';

describe('CookiePromptModalComponent', () => {
  let component: CookiePromptModalComponent;
  let fixture: ComponentFixture<CookiePromptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookiePromptModalComponent ]
    })
    .compileComponents();
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
