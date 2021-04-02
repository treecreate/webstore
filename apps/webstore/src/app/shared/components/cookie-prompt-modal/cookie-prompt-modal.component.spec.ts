import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CookiePromptModalComponent } from './cookie-prompt-modal.component';

describe('CookiePromptModalComponent', () => {
  let component: CookiePromptModalComponent;
  let fixture: ComponentFixture<CookiePromptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CookiePromptModalComponent
      ],
      imports: [NgbActiveModal]
    }).compileComponents();

    //Mock localStorage
    let store = { };
    const mockLocalStorageService = {
      getItem: (key : string): string => {
        return key in store ? store[key] : null; 
      },
      setItem: (key : string, value : string) => {
        store[key] = `${value}`;
      },
      removeItem: (key : string) => {
        delete store[key];
      },
      clear: () => {
        store = { };
      }
    };

    // This means: Whenever localStorage.getItem is called, instead, mockLocalStorageService.getItem is called.
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorageService.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorageService.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorageService.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorageService.clear);

  });

  beforeEach( () => {
    localStorage.clear();
  })

  describe('setCookies', () => {
    it('should change the local storage cookies to true', () => {
      localStorage.setItem('cookies', 'true'); 
      expect(localStorage.getItem('cookies')).toEqual('true'); 
    });
  });

  describe('getCookiesStatus', () => {
    it('should return false when not initiated', () => {
      expect(localStorage.getItem('cookies')).toEqual(null); 
    });
  });

});
