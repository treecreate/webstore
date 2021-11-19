import { Injectable, OnDestroy } from '@angular/core';
import { CookieStatus, LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';

interface ICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: BehaviorSubject<any>;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnDestroy {
  private cache: ICache;

  constructor() {
    // Initial state
    const initialLocale = JSON.parse(localStorage.getItem(LocalStorageVars.locale) || LocaleType.dk);

    const acceptedCookies = JSON.parse(
      localStorage.getItem(LocalStorageVars.cookiesAccepted) || CookieStatus.undefined
    );

    this.cache = {
      [LocalStorageVars.locale]: new BehaviorSubject<LocaleType>(initialLocale),
      [LocalStorageVars.cookiesAccepted]: new BehaviorSubject<CookieStatus>(acceptedCookies),
    };

    window.addEventListener('storage', (e) => this.handleStorageUpdate(e));
  }

  // Lifecycle methods
  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageUpdate.bind(this));
  }

  // Handlers
  handleStorageUpdate({ key, newValue }: StorageEvent): void {
    if (key && newValue) {
      if (this.cache[key]) {
        this.cache[key].next(JSON.parse(newValue));
      }
    }
  }

  // Methods
  setItem<T>(key: string, value: T): BehaviorSubject<T> {
    if (this.isLocalStorageSupported) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    if (this.cache[key]) {
      this.cache[key].next(value);
      return this.cache[key] as BehaviorSubject<T>;
    }

    return (this.cache[key] = new BehaviorSubject(value));
  }

  getItem<T>(key: string): BehaviorSubject<T | null> | null {
    if (this.cache[key]) {
      return this.cache[key] as BehaviorSubject<T | null>;
    }

    if (this.isLocalStorageSupported) {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return (this.cache[key] = new BehaviorSubject<T | null>(JSON.parse(item)));
      } else {
        return new BehaviorSubject<T | null>(null);
      }
    }
    return null;
  }

  removeItem(key: string) {
    if (this.isLocalStorageSupported) {
      localStorage.removeItem(key);
    }
    if (this.cache[key]) this.cache[key].next(undefined);
  }

  get isLocalStorageSupported(): boolean {
    return !!localStorage;
  }
}
