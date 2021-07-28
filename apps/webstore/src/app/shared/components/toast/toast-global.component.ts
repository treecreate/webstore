import { Component } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'webstore-toast-global',
  templateUrl: './toast-global.component.html',
})
export class ToastGlobalComponent {
  constructor(public toastService: ToastService) {}

  showStandard() {
    this.toastService.show('I am a standard toast');
  }

  showSuccess() {
    this.toastService.show('I am a success toast', {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  showDanger(dangerTpl) {
    this.toastService.show(dangerTpl, {
      classname: 'bg-danger text-light',
      delay: 15000,
    });
  }
}
