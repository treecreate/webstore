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
    // Get initial state of cookies and locale from previously set values. If nothing is found, set defaults
    const locale = localStorage.getItem(LocalStorageVars.locale);
    const initialLocale = locale !== null ? JSON.parse(locale) : LocaleType.da;

    const cookies = localStorage.getItem(LocalStorageVars.cookiesAccepted);
    const acceptedCookies = cookies !== null ? JSON.parse(cookies) : CookieStatus.undefined;

    // set the initial state in the cache
    this.cache = {
      [LocalStorageVars.locale]: new BehaviorSubject<LocaleType>(initialLocale),
      [LocalStorageVars.cookiesAccepted]: new BehaviorSubject<CookieStatus>(acceptedCookies),
    };

    window.addEventListener('storage', (e) => this.handleStorageUpdate(e));
  }

  get isLocalStorageSupported(): boolean {
    return !!localStorage;
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
  /**
   * Save a given object to local storage.
   * @example this.localStorageService.setItem<IAuthUser>(LocalStorageVars.authUser, user);
   * @param key name that the object should be saved under
   * @param value the object
   * @returns behavior subject that you can subscribe to and listen for changes
   */
  setItem<T>(key: string, value: T): BehaviorSubject<T> {
    if (this.isLocalStorageSupported) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    if (this.cache[key]) {
      this.cache[key].next(this.deepCopy(value));
      return this.cache[key] as BehaviorSubject<T>;
    }

    return (this.cache[key] = new BehaviorSubject(this.deepCopy(value)));
  }

  /**
   * Get a specific object from local storage cache
   * @example this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue();
   * @example const authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue(); authUser$.subscribe();
   * @param key name of the object
   * @returns behavior subject that you can subscribe to and listen for changes
   */
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

  /**
   * Remove a specific object from local storage
   * @example this.localStorageService.removeItem(LocalStorageVars.authUser);
   * @param key name of the object
   */
  removeItem(key: string): void {
    if (this.isLocalStorageSupported) {
      localStorage.removeItem(key);
    }
    if (this.cache[key]) this.cache[key].next(undefined);
  }

  /**
   * Perform a deep copy of the given object, including the nested object. Does not copy methods.
   * @param obj object to be copied
   * @returns a deep copy of the object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deepCopy(obj: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}
