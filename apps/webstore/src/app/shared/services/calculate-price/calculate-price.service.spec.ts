import { TestBed } from '@angular/core/testing';

import { CalculatePriceService } from './calculate-price.service';

describe('CalculatePriceService', () => {
  let service: CalculatePriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatePriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
