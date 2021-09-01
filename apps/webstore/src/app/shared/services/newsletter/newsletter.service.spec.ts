import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NewsletterService } from './newsletter.service';

describe('NewsletterService', () => {
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(NewsletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
