import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = [];

  show(textOrTpl: string | TemplateRef<any>, options = {}) {
      this.toasts.push({ textOrTpl, ...options });
  }

  showAlert(text: string, type: string, time: number) {
    switch (type) {
      case 'success':
        this.show(text, {
          classname: 'bg-success text-light',
          delay: time,
        });
        break;
      case 'danger':
        this.show(text, {
          classname: 'bg-danger text-light',
          delay: time,
        });
        break;
      case 'standard':
        this.show(text, {
          delay: time,
        });
        break;
    }
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
