import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IQoutable, QuotableType } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { take } from 'rxjs';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';

@Component({
  selector: 'webstore-quotable-design',
  templateUrl: './quotable-design.component.html',
  styleUrls: ['./quotable-design.component.scss'],
})
export class QuotableDesignComponent implements AfterViewInit, OnDestroy, OnInit, OnChanges {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('autosizeTitle') autosizeTitle: CdkTextareaAutosize;

  @ViewChild('textVerticalPlacement') textVerticalPlacement: ElementRef;
  @ViewChild('quotableTitleInput') titleInput: ElementRef;
  @ViewChild('quotableTextInput') textInput: ElementRef;

  @Input() isMutable = false;
  @Input() design: IQoutable;
  @Input() quotableType: QuotableType;
  @Input() showInputFieldOptions: boolean;

  @Output() isDesignValidEvent = new EventEmitter<boolean>();
  @Output() changeText = new EventEmitter<string>();
  @Output() changeTitleText = new EventEmitter<string>();

  @ViewChild('designWrapper') designWrapper;
  @ViewChild('inputWrapper') inputWrapper;

  originalFontSize: number;
  rows: number;

  isDesignValid = false;
  hasInitialized = false;
  hideTitle = true;
  hideText = false;

  fontSize = 10;
  inputTextHeight = 10;
  inputTitleHeight = 10;
  verticalTextPlacement = 0;

  autosaveInterval;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 15;

  constructor(
    private localStorageService: LocalStorageService,
    private _ngZone: NgZone,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    if (this.design) {
      this.originalFontSize = this.design.fontSize;
    }
    this.triggerResize();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosizeTitle.resizeToFitContent(true));
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
    }, 200);
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

  updateTitleText($event) {
    this.changeTitleText.emit($event);
    this.adjustInputDimensions();
  }

  saveDesign() {
    if (!this.isMutable) {
      return;
    }
    console.log('Saving your design...');
    if (!this.isDesignValid) {
      console.warn('The design is not valid, and thus it cannot get saved!');
      this.errorlogsService.create('webstore.quotable-design.save-design-because-invalid');
      return false;
    }

    // Save the design depending on quotable type
    switch (this.quotableType) {
      case QuotableType.babySign:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designBabySign, this.design);
        break;
      case QuotableType.loveLetter:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designLoveLetter, this.design);
        break;
      case QuotableType.quotable:
      default:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designQuotable, this.design);
    }
  }

  getSizeDependingOnWidth(number: number): number {
    const scale = ((this.designWrapper.nativeElement.offsetWidth / 601) * 7) / 11;
    console.log((this.designWrapper.nativeElement.offsetWidth / 641) * 7, scale);
    this.designWrapper.nativeElement.style.height = this.designWrapper.nativeElement.offsetWidth + 'px';
    const displaySize = Math.round(number * scale * 10) / 10;
    return displaySize;
  }

  /**
   * Adjust height of the input element to match its contents and amount fo rows. Based on the scroll height.
   */
  // @HostListener('window:resize')
  adjustInputDimensions(): void {
    this.fontSize = this.getSizeDependingOnWidth(this.design.fontSize);
    const inputToWindowWidthRatio = this.designWrapper.nativeElement.offsetWidth / window.innerWidth;

    if (this.textInput !== undefined && this.textInput.nativeElement !== undefined) {
      this.textInput.nativeElement.style.height = '0px';
      this.textInput.nativeElement.style.minHeight = '0px';
      this.inputTextHeight = Math.round(this.textInput.nativeElement.scrollHeight * inputToWindowWidthRatio);
      this.textInput.nativeElement.style.height = this.inputTextHeight + 'px';
    }

    if (this.titleInput !== undefined && this.titleInput.nativeElement !== undefined) {
      this.titleInput.nativeElement.style.height = '0px';
      this.titleInput.nativeElement.style.minHeight = '0px';
      this.inputTitleHeight = Math.round(this.titleInput.nativeElement.scrollHeight * inputToWindowWidthRatio);
      this.titleInput.nativeElement.style.height = this.inputTitleHeight + 'px';
    }

    this.triggerResize();
  }

  resize() {
    setTimeout(() => {
      this.adjustInputDimensions();
    }, 100);
  }

  adjustTextHeight(): void {
    this.textVerticalPlacement;
  }
}
