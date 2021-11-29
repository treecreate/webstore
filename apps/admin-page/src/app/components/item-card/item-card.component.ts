import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'webstore-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  @Input()
  title!: string;

  @Input()
  isLoading!: boolean;

  @Input()
  content!: TemplateRef<unknown>;
}
