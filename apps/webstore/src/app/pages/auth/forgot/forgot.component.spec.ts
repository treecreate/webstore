import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../../../core/core.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { ForgotComponent } from './forgot.component';
import { AuthService } from '../../../shared/auth/auth.service';

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotComponent],
      imports: [CoreModule, ThemeModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            passwordResetRequest: jest.fn(() => true),
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
