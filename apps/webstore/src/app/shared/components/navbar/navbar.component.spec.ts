import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {
  NgbActiveModal,
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiePromptModalComponent } from '../modals/cookie-prompt-modal/cookie-prompt-modal.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [NgbModal, NgbModal, NgbActiveModal],
      imports: [NgbModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should have a variable 'isMenuCollapsed' that is true", () => {
    fixture = TestBed.createComponent(NavbarComponent);
    const navbar = fixture.componentInstance;
    expect(navbar.isMenuCollapsed).toBe(true);
  });
});
