import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CookieGuard } from './cookie.guard';

describe('CookieGuard', () => {
  let guard: CookieGuard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    }).compileComponents();
    guard = TestBed.inject(CookieGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
