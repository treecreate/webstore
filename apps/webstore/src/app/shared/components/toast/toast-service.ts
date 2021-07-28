import { Injectable, TemplateRef } from '@angular/core';
import { LocaleType, LocalStorageVars } from '@models';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // get locale to determine what language to display the toast in
  public locale$: BehaviorSubject<LocaleType>;
  public localeCode: LocaleType;
  constructor(private localStorageService: LocalStorageService) {
    this.locale$ = this.localStorageService.getItem<LocaleType>(
      LocalStorageVars.locale
    );
    this.localeCode = this.locale$.getValue();
  }

  toasts = [];

  show(textOrTpl: string | TemplateRef<any>, options = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showAlert(textEn: string, textDk: string, type: string, time?: number) {
    // Default english text
    let displayText = textEn;
    // If language is set to danish, change the text
    if (this.localeCode !== LocaleType.en) {
      displayText = textDk;
    }

    switch (type) {
      case 'success':
        this.show(displayText, {
          classname: 'bg-success text-light',
          delay: time,
        });
        break;
      case 'danger':
        this.show(displayText, {
          classname: 'bg-danger text-light',
          delay: time,
        });
        break;
      case 'standard':
        this.show(displayText, {
          delay: time,
        });
        break;
    }
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
