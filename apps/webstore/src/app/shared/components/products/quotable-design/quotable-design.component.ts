import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { IQoutable } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';

@Component({
  selector: 'webstore-quotable-design',
  templateUrl: './quotable-design.component.html',
  styleUrls: ['./quotable-design.component.scss'],
})
export class QuotableDesignComponent implements AfterViewInit, OnDestroy {
  @Input()
  isMutable = false;

  @Input()
  design: IQoutable = null;

  @Output()
  isDesignValidEvent = new EventEmitter<boolean>();
  isDesignValid = false;

  autosaveInterval;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 30;

  constructor(private localStorageService: LocalStorageService) {}

  ngAfterViewInit(): void {
    if (this.isMutable) {
      this.autosaveInterval = setInterval(() => {
        this.saveDesign();
      }, 1000 * this.autosaveFrequencyInSeconds);
    }
    this.isDesignValid = true;
    this.isDesignValidEvent.emit(this.isDesignValid);
    console.log('design', this.design);
  }

  ngOnDestroy(): void {
    clearInterval(this.autosaveInterval);
  }

  handleFailedResourceLoading(message: string) {
    console.error(message);
    // stop the design autosave
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = null;
    this.isDesignValid = false;
    this.isDesignValidEvent.emit(this.isDesignValid);
  }

  saveDesign() {
    if (!this.isMutable) {
      return;
    }
    console.log('Saving your design...');
    if (!this.isDesignValid) {
      console.warn('The design is not valid, and thus it cannot get saved!');
      return false;
    }

    this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, this.design);
  }
}
