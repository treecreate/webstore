import { Options } from '@angular-slider/ngx-slider';
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
import { IQoutable, quotableFrames, QuotableTypeEnum } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocaleType, LocalStorageVars } from '@models';
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
  @Input() quotableType: QuotableTypeEnum;
  @Input() showInputFieldOptions: boolean;

  @Output() isDesignValidEvent = new EventEmitter<boolean>();
  @Output() changeText = new EventEmitter<string>();
  @Output() changeTitleText = new EventEmitter<string>();

  isDesignValid = false;
  isLoading = true;
  public localeCode: LocaleType;

  fontSize = 10;
  inputTextHeight = 10;
  inputTitleHeight = 10;

  verticalPlacementOptions: Options = {
    floor: 5,
    ceil: 95,
    vertical: true,
    rightToLeft: true,
  };

  autosaveInterval;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 30;

  constructor(
    private localStorageService: LocalStorageService,
    private _ngZone: NgZone,
    private errorlogsService: ErrorlogsService
  ) {
    this.localeCode = this.localStorageService.getItem<LocaleType>(LocalStorageVars.locale).getValue();
  }

  ngOnInit(): void {
    // For deprecated designs that dont have a quotableType yet
    // If quotable type is not set, find the frame from the list of all quotable frames
    if (this.design.quotableType === undefined && this.quotableType === undefined) {
      const selectedFrame = quotableFrames.find((frame) => frame.src === this.getDesignSrc());
      const frameIndex = quotableFrames.indexOf(selectedFrame);
      this.design.quotableType = this.quotableType = quotableFrames[frameIndex].productType[0];
    }

    // For deprecated designs that dont have a vertical placement
    // If not set, set to center (50)
    if (this.design.verticalPlacement === undefined) {
      this.design.verticalPlacement = 50;
    }

    if (this.designWrapper !== undefined && this.designWrapper.nativeElement !== undefined) {
      this.isLoading = false;
    } else {
      const loadElement = setInterval(() => {
        if (this.designWrapper !== undefined && this.designWrapper.nativeElement !== undefined) {
          this.isLoading = false;
          clearInterval(loadElement);
        }
      }, 20);
    }

    // Has to be seperate from the previous interval since it has to be done loading
    const loadHeight = setInterval(() => {
      if (this.inputWrapper !== undefined && this.inputWrapper.nativeElement !== undefined) {
        this.changeVerticalPlacement();
        clearInterval(loadHeight);
      }
    }, 200);
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
      setTimeout(() => {
        this.adjustInputDimensions();
      }, 100);
    }
  }

  isEnglish(): boolean {
    return this.localeCode === 'en-US';
  }

  getTitlePlaceholder(): string {
    if (!this.isMutable) {
      return '';
    }
    return this.isEnglish() ? 'Name' : 'Navn';
  }

  getTextPlaceholder(): string {
    if (!this.isMutable) {
      return '';
    }
    return this.isEnglish() ? 'Write your text here' : 'Skriv din tekst her';
  }

  showAddTextButton(): boolean {
    return !this.design.showText && this.isMutable;
  }

  getDesignSrc(): string {
    const isDeprecatedSrc =
      !this.design.designSrc.includes('frame0-no-design.svg') &&
      this.design.designSrc.includes('assets/quotable/frame-design/frame');
    // for deprecated src links
    if (isDeprecatedSrc) {
      return this.design.designSrc.replace('assets/quotable/frame-design/', 'assets/quotable/frame-design/quotable/');
    } else {
      return this.design.designSrc;
    }
  }

  handleFailedResourceLoading(message: string): void {
    console.error(message);
    // stop the design autosave
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = null;
    this.isDesignValid = false;
    this.isDesignValidEvent.emit(this.isDesignValid);
  }

  updateText($event): void {
    this.changeText.emit($event);
    this.adjustInputDimensions();
  }

  updateTitleText($event): void {
    this.changeTitleText.emit($event);
    this.adjustInputDimensions();
  }

  saveDesign(): void {
    if (!this.isMutable) {
      return;
    }
    console.log('Saving your design...');
    if (!this.isDesignValid) {
      console.warn('The design is not valid, and thus it cannot get saved!');
      this.errorlogsService.create('webstore.quotable-design.save-design-because-invalid');
    }

    // Save the design depending on quotable type
    switch (this.quotableType) {
      case QuotableTypeEnum.babySign:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designBabySign, this.design);
        break;
      case QuotableTypeEnum.loveLetter:
        this.localStorageService.setItem<IQoutable>(LocalStorageVars.designLoveLetter, this.design);
        break;
      case QuotableTypeEnum.quotable:
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

  @HostListener('document:keydown.enter')
  @HostListener('document:keydown.backspace')
  reCenterText(): void {
    // To recenter text after a new row has been created or deleted.
    // Adding or removing a row doesnt trigger ngChange
    setTimeout(() => {
      this.changeVerticalPlacement();
    }, 50);
  }

  changeVerticalPlacement() {
    const textHeight = this.inputWrapper.nativeElement.offsetHeight;
    const canvasHeight = this.designWrapper.nativeElement.offsetHeight;
    const x = canvasHeight - textHeight;
    const placement = this.design.verticalPlacement * (x / 100);

    this.inputWrapper.nativeElement.style.top = placement + 'px';
  }

  /**
   * Adjust height of the input element to match its contents and amount fo rows. Based on the scroll height.
   */
  @HostListener('window:resize')
  adjustInputDimensions(): void {
    if (this.isLoading) {
      return;
    }

    this.fontSize = this.getSizeDependingOnWidth(this.design.fontSize);
    const inputToWindowWidthRatio = this.designWrapper.nativeElement.offsetWidth / window.innerWidth;

    if (this.textInput !== undefined && this.textInput.nativeElement !== undefined) {
      this.textInput.nativeElement.style.minHeight = '0px';
      this.inputTextHeight = Math.round(this.textInput.nativeElement.scrollHeight * inputToWindowWidthRatio);
      this.textInput.nativeElement.style.height = this.inputTextHeight + 'px';
    }

    if (this.titleInput !== undefined && this.titleInput.nativeElement !== undefined) {
      this.titleInput.nativeElement.style.minHeight = '0px';
      this.inputTitleHeight = Math.round(this.titleInput.nativeElement.scrollHeight * inputToWindowWidthRatio);
      this.titleInput.nativeElement.style.height = this.inputTitleHeight + 'px';
    }

    this.triggerResize();
  }

  resizeText() {
    // If undefined (deprecated) set to true and resize input
    if (this.design.showText === undefined) {
      this.design.showText = true;
      // If show text is false, dont resize
    } else if (!this.design.showText) {
      return;
    }

    if (this.textInput !== undefined && this.textInput.nativeElement !== undefined) {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
    }
  }

  resizeTitle() {
    // If undefined (deprecated) set to false and dont resize input
    if (this.design.showTitle === undefined) {
      this.design.showTitle = false;
      return;
      // If show title is false, dont resize
    } else if (!this.design.showTitle) {
      return;
    }

    if (this.titleInput !== undefined && this.titleInput.nativeElement !== undefined) {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosizeTitle.resizeToFitContent(true));
    }
  }

  triggerResize() {
    this.resizeText();
    this.resizeTitle();
    // re adjust hight
    setTimeout(() => {
      this.changeVerticalPlacement();
    }, 50);
  }
}
