import { TestBed } from '@angular/core/testing';

import { CookieGuard } from './cookie.guard';

describe('CookieGuard', () => {
  let guard: CookieGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CookieGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
