import { Component } from '@angular/core';

@Component({
  selector: 'webstore-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'dk', label: 'Danish' }
  ]

  title = $localize`webstore`;
}
