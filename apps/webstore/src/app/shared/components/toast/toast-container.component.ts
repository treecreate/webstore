import { Component, TemplateRef } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'webstore-toasts',
  template: `
    <div
      class="ngb-toasts"
      aria-live="polite"
      aria-atomic="true"
      style="pointer-events: none; opacity: 0.8; bottom: 0; top: auto !important;"
    >
      <ngb-toast
        *ngFor="let toast of toastService.toasts"
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
          <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
        </ng-template>

        <ng-template #text>{{ toast.textOrTpl }}</ng-template>
      </ngb-toast>
    </div>
  `,
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
