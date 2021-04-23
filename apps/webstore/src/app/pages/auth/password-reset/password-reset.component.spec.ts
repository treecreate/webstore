import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../../../core/core.module';
import { ThemeModule } from '../../../@theme/theme.module';

import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../../shared/auth/auth.service';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [CoreModule, ThemeModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            passwordReset: jest.fn(() => true),
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
