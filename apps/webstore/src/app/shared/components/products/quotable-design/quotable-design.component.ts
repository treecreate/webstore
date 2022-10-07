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
  @ViewChild('designWrapper') designWrapper: ElementRef;
  @ViewChild('inputWrapper') inputWrapper: ElementRef;

  @Input() isMutable = false;
  @Input() design: IQoutable;
  @Input() quotableType: QuotableType;
  @Input() showInputFieldOptions: boolean;

  @Output() isDesignValidEvent = new EventEmitter<boolean>();
  @Output() changeText = new EventEmitter<string>();
  @Output() changeTitleText = new EventEmitter<string>();

  originalFontSize: number;
  rows: number;

  isDesignValid = false;
  isLoading = true;

  fontSize = 10;
  inputTextHeight = 10;
  inputTitleHeight = 10;
  // verticalTextPlacement = 0;

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

    const loadElement = setInterval(() => {
      if (this.designWrapper !== undefined && this.designWrapper.nativeElement !== undefined) {
        this.isLoading = false;
        clearInterval(loadElement);
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    if (this.isMutable) {
      this.autosaveInterval = setInterval(() => {
        this.saveDesign();
      }, 1000 * this.autosaveFrequencyInSeconds);
    }
    this.isDesignValid = true;
    this.isDesignValidEvent.emit(this.isDesignValid);

    setTimeout(() => {
      this.adjustInputDimensions();
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

  getDesignSrc(): string {
    const isDepricatedSrc =
      !this.design.designSrc.includes('frame0-no-design.svg') &&
      this.design.designSrc.includes('assets/quotable/frame-design/frame');
    // for depricated src links
    if (isDepricatedSrc) {
      return this.design.designSrc.replace('assets/quotable/frame-design/', 'assets/quotable/frame-design/quotable/');
    } else {
      return this.design.designSrc;
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

  changeTitleDisplay() {
    if (this.design.showTitle !== undefined) {
      this.design.showTitle = !this.design.showTitle;
    } else {
      this.design.showTitle = true;
    }
    this.adjustInputDimensions();
  }

  changeTextDisplay() {
    if (this.design.showText !== undefined) {
      this.design.showText = !this.design.showText;
    } else {
      this.design.showText = true;
    }
    this.adjustInputDimensions();
  }

  getSizeDependingOnWidth(number: number): number {
    const scale = ((this.designWrapper.nativeElement.offsetWidth / 601) * 7) / 11;
    this.designWrapper.nativeElement.style.height = this.designWrapper.nativeElement.offsetWidth + 'px';
    return Math.round(number * scale * 10) / 10;
  }

  /**
   * Adjust height of the input element to match its contents and amount fo rows. Based on the scroll height.
   */
  @HostListener('window:resize')
  adjustInputDimensions(): void {
    if (this.isLoading) {
      return;
    }

    setTimeout(() => {
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
    }, 15);
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    if (this.textInput !== undefined && this.textInput.nativeElement !== undefined) {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
    }
    if (this.titleInput !== undefined && this.titleInput.nativeElement !== undefined) {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosizeTitle.resizeToFitContent(true));
    }
  }

  adjustTextHeight(): void {
    this.textVerticalPlacement;
  }
}
