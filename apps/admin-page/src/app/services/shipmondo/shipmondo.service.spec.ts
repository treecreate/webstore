import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ShipmondoService } from './shipmondo.service';

describe('ShipmondoService', () => {
  let service: ShipmondoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ShipmondoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
