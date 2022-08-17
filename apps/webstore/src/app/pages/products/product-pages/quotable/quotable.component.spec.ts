import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QuotableComponent } from './quotable.component';

describe('QuotableComponent', () => {
  let component: QuotableComponent;
  let fixture: ComponentFixture<QuotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotableComponent],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
