import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocaleType } from '../../i18n';
import { LocalStorageVars } from './local-storage.constants';

interface ICache {
  [key: string]: BehaviorSubject<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnDestroy {
  private cache: ICache;

  constructor() {
    // Initial state
    const initialLocale =
      JSON.parse(localStorage.getItem(LocalStorageVars.locale)) ||
      LocaleType.dk;

    this.cache = {
      [LocalStorageVars.locale]: new BehaviorSubject<LocaleType>(initialLocale),
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

  getItem<T>(key: string): BehaviorSubject<T> {
    if (this.cache[key]) {
      return this.cache[key] as BehaviorSubject<T>;
    }

    if (this.isLocalStorageSupported) {
      return (this.cache[key] = new BehaviorSubject(
        JSON.parse(localStorage.getItem(key))
      ));
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
