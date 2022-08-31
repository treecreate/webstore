import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsletterSignupModalComponent } from '../modals/newsletter-signup-modal/newsletter-signup-modal.component';

@Component({
  selector: 'webstore-sticky-newsletter-button',
  templateUrl: './sticky-newsletter-button.component.html',
  styleUrls: ['./sticky-newsletter-button.component.scss'],
})
export class StickyNewsletterButtonComponent implements OnInit {
  constructor(private modalService: NgbModal,) {}

  openNewsletterModal() {
    this.modalService.open(NewsletterSignupModalComponent);
  }

  ngOnInit(): void {}
}
