import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IQoutable } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { take } from 'rxjs';

@Component({
  selector: 'webstore-quotable-design',
  templateUrl: './quotable-design.component.html',
  styleUrls: ['./quotable-design.component.scss'],
})
export class QuotableDesignComponent implements AfterViewInit, OnDestroy, OnInit, OnChanges {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  @ViewChild('quotableInput')
  input: ElementRef;

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

  rows: number;

  isDesignValid = false;
  hasInitialized = false;

  fontSize = 10;
  inputHeight = 10;

  autosaveInterval;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 30;

  constructor(private localStorageService: LocalStorageService, private _ngZone: NgZone) {}

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

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
    // This will throw an ExpressionChangedAfterItHasBeenCheckedError if it is not set in an async method.
    setTimeout(() => {
      this.adjustInputDimensions();
      // re-assign the text to force resizing
      const temp = this.design.text;
      this.design.text = '';
      this.design.text = temp;
    }, 100);
    window.dispatchEvent(new Event('resize'));
  }

  ngOnDestroy(): void {
    clearInterval(this.autosaveInterval);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.design !== undefined) {
      this.adjustInputDimensions();
    }
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
    this.adjustInputDimensions();
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
    const scale = Math.round((this.designWrapper.nativeElement.offsetWidth / 641) * 6) / 10;
    const displaySize = Math.round(number * scale * 10) / 10;
    if (this.designWrapper.nativeElement.offsetWidth <= 641) {
      return displaySize;
    } else {
      return number;
    }
  }

  /**
   * Adjust height of the input element to match its contents and amount fo rows. Based on the scroll height.
   */
  adjustInputDimensions(): void {
    if (this.input !== undefined && this.input.nativeElement !== undefined) {
      this.fontSize = this.getSizeDependingOnWidth(this.design.fontSize);

      const inputToWindowWidthRatio = this.designWrapper.nativeElement.offsetWidth / window.innerWidth;
      this.input.nativeElement.style.height = '0px';
      this.inputHeight = Math.round(this.input.nativeElement.scrollHeight * inputToWindowWidthRatio);
      this.input.nativeElement.style.height = this.inputHeight + 'px';
    }
    this.triggerResize();
  }
}
