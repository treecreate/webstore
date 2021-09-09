import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../authentication/auth.service';
import { NewsletterService } from './newsletter.service';

describe('NewsletterService', () => {
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(NewsletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
