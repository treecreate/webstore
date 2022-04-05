import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IQoutable } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';

@Component({
  selector: 'webstore-quotable-design',
  templateUrl: './quotable-design.component.html',
  styleUrls: ['./quotable-design.component.scss'],
})
export class QuotableDesignComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input()
  isMutable = false;

  @Input()
  design: IQoutable;

  @Output()
  isDesignValidEvent = new EventEmitter<boolean>();

  @Output()
  changeText = new EventEmitter<string>();

  @ViewChild('designWrapper') designWrapper;

  @ViewChild('inputWrapper') inputWrapper;

  originalFontSize: number;

  isDesignValid = false;
  hasInitialized = false;
  inputHeight: number;

  autosaveInterval;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 30;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    if (this.design) {
      this.originalFontSize = this.design.fontSize;
    }
  }

  ngAfterViewInit(): void {
    if (this.isMutable) {
      this.autosaveInterval = setInterval(() => {
        this.saveDesign();
      }, 1000 * this.autosaveFrequencyInSeconds);
    }
    this.isDesignValid = true;
    this.isDesignValidEvent.emit(this.isDesignValid);
    this.hasInitialized = true;
    this.inputHeight = this.inputWrapper.nativeElement.offsetHeight;
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

  updateText($event) {
    this.changeText.emit($event);
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

  getSizeDependingOnWidth(number: number): number {
    const scale = Math.round((this.designWrapper.nativeElement.offsetWidth / 641) * 10) / 10;
    const displaySize = Math.round(number * scale * 10) / 10;
    if (this.designWrapper.nativeElement.offsetWidth <= 641) {
      return displaySize;
    } else {
      return number;
    }
  }
}
