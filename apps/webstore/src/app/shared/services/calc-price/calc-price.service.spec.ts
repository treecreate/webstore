import { TestBed } from '@angular/core/testing';

import { CalcPriceService } from './calc-price.service';

describe('CalcPriceService', () => {
  let service: CalcPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
