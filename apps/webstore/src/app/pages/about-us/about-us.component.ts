import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum, INewsletter } from '@interfaces';
import { ToastService } from '../../shared/components/toast/toast-service';
import { ErrorlogsService } from '../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../shared/services/events/events.service';
import { NewsletterService } from '../../shared/services/newsletter/newsletter.service';
import { OrderService } from '../../shared/services/order/order.service';

@Component({
  selector: 'webstore-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css', './about-us.mobile.component.scss'],
})
export class AboutUsComponent implements OnInit {
  treesPlanted = 666;
  newsletterForm: UntypedFormGroup;
  isLoading = false;
  @ViewChild('emailInput') emailInput: ElementRef;

  constructor(
    private newsletterService: NewsletterService,
    private ordersService: OrderService,
    private toastService: ToastService,
    private eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {
    this.newsletterForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    this.fetchPlantedTreesTotal();
  }

  registerNewsletter(): void {
    this.isLoading = true;
    if (this.newsletterForm.get('email').value !== '') {
      this.newsletterService.registerNewsletterEmail(this.newsletterForm.get('email').value).subscribe(
        (newsletterData: INewsletter) => {
          this.toastService.showAlert(
            `Thank you for subscribing: ${newsletterData.email}`,
            `Tak for din tilmelding: ${newsletterData.email}`,
            'success',
            3000
          );
          this.isLoading = false;
          this.eventsService.create('webstore.about-us.newsletter-signup');
        },
        (error) => {
          console.error(error);
          this.errorlogsService.create('webstore.about-us.newsletter-signup-failed', ErrorlogPriorityEnum.high, error);
          this.toastService.showAlert('Invalid email', 'Ugyldig email', 'danger', 5000);
          this.emailInput.nativeElement.focus();
          this.isLoading = false;
        }
      );
    } else {
      this.toastService.showAlert('Missing email input.', 'Udfyld email feltet.', 'danger', 5000);
      this.emailInput.nativeElement.focus();
      this.isLoading = false;
    }
  }

  fetchPlantedTreesTotal(): void {
    this.ordersService.getPlantedTreesTotal().subscribe({
      next: (plantedTreesTotal) => {
        this.treesPlanted = Math.ceil(plantedTreesTotal.plantedTrees / 10) * 10;
      },
      error: (error) => {
        console.error(error);
        this.errorlogsService.create(
          'webstore.about-us.fetch-planted-trees-failed',
          ErrorlogPriorityEnum.medium,
          error
        );
      },
    });
  }
}
