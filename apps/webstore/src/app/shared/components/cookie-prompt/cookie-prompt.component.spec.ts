import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePromptComponent } from './cookie-prompt.component';

describe('CookiePromptComponent', () => {
  let component: CookiePromptComponent;
  let fixture: ComponentFixture<CookiePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiePromptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
