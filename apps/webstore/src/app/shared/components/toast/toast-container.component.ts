import { Component, TemplateRef } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'webstore-toasts',
  template: `
    <div class="ngb-toasts" aria-live="polite" aria-atomic="true">
      <ngb-toast
        *ngFor="let toast of toastService.toasts"
        [class]="toast.classname"
        [autohide]="true"
        [delay]="100000"
        (hidden)="toastService.remove(toast)"
      >
        <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
          <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
        </ng-template>
        <ng-template #text>{{ toast.textOrTpl }}</ng-template>
      </ngb-toast>
    </div>
  `,
  styles: [
    `
      .ngb-toasts {
        pointer-events: none;
        opacity: 0.9;
        bottom: 0;
        left: 0;
        padding: 0.5em;
        position: sticky;
      }
    `,
  ],
})
export class ToastsContainerComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
