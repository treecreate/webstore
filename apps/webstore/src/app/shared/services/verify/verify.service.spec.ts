import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifyService } from './verify.service';

describe('VerifyService', () => {
  let service: VerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
    });
    service = TestBed.inject(VerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
