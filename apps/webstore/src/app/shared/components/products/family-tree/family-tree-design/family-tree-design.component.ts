import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  BannerDesignEnum,
  BoxDesignEnum,
  CloseBoxDesignEnum,
  Tree1BoxDesignEnum,
  Tree2BoxDesignEnum,
  Tree3BoxDesignEnum,
  TreeDesignEnum,
} from '@assets';
import {
  FamilyTreeFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTree,
  IFamilyTreeBanner,
} from '@interfaces';
import { LocalStorageVars } from '@models';
import { LocalStorageService } from '../../../../services/local-storage';
import { DraggableBoxComponent } from '../draggable-box/draggable-box.component';

@Component({
  selector: 'webstore-family-tree-design',
  templateUrl: './family-tree-design.component.html',
  styleUrls: [
    './family-tree-design.component.scss',
    './family-tree-design.component.mobile.scss',
    '../../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeDesignComponent
  implements AfterViewInit, OnInit, OnChanges {
  // Inputs for design settings

  @Input()
  boxSize = 20;

  @Input()
  title: string;

  @Input()
  showBanner: boolean;

  @Input()
  banner: IFamilyTreeBanner;

  @Input()
  isLargeFont = false;

  @Input()
  font: FamilyTreeFontEnum;

  @Input()
  backgroundTreeDesign: TreeDesignEnum;

  @Output()
  isDesignValidEvent = new EventEmitter<boolean>();

  isDesignValid = false;

  // Design

  savedDesign: IDesign;

  // Canvas
  @ViewChild('designWrapper', { read: ViewContainerRef })
  designWrapper: ViewContainerRef;

  @ViewChild('designCanvas', { static: true })
  designCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  canvasResolution = {
    height: 4000,
    width: 4000,
  };

  myBoxes: IDraggableBox[] = [];
  mouseCords = {
    x: 0,
    y: 0,
  };

  // stores the difference between the mouse cursor and the top-left corner of the box
  mouseClickOffset = {
    x: 0,
    y: 0,
  };
  downEventDelay = false;

  // render loop
  timeInterval;
  framesPerSecond = 60; // FPS of the render loop
  // autosaving of the design
  autosaveFrequencyInSeconds = 30;
  autosaveInterval;

  // SVGs

  treeDesigns: Map<TreeDesignEnum, HTMLImageElement> = new Map();
  bannerDesigns: Map<BannerDesignEnum, HTMLImageElement> = new Map();
  bannerDimensions = {
    height: this.canvasResolution.height / 8,
    width: this.canvasResolution.width / 2,
  };
  tree1BoxDesigns: Map<Tree1BoxDesignEnum, HTMLImageElement> = new Map();
  tree2BoxDesigns: Map<Tree2BoxDesignEnum, HTMLImageElement> = new Map();
  tree3BoxDesigns: Map<Tree3BoxDesignEnum, HTMLImageElement> = new Map();
  boxSizeScalingMultiplier = 0.05;
  boxDimensions = {
    height:
      (this.canvasResolution.height / 10) *
      (this.boxSize * this.boxSizeScalingMultiplier),
    width:
      (this.canvasResolution.width / 5) *
      (this.boxSize * this.boxSizeScalingMultiplier),
  };
  closeButton = new Image();
  closeButtonDimensions = {
    height:
      (this.canvasResolution.height / 30) *
      (this.boxSize * this.boxSizeScalingMultiplier),
    width:
      (this.canvasResolution.width / 30) *
      (this.boxSize * this.boxSizeScalingMultiplier),
  };

  // the max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  largeFontMaxChars = 9;
  maxCharsPerLine = this.isLargeFont
    ? this.largeFontMaxChars
    : this.smallFontMaxChars;
  maxLines = 2;

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  // TODO: show only for one box instead of showing it for all if any of the boxes got moused over
  showDeleteBoxButtons = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Load and validate tree design SVGs
    for (let i = 0; i < Object.values(TreeDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(TreeDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a tree design');
      };
      this.treeDesigns.set(Object.values(TreeDesignEnum)[i], image);
    }
    // Load and validate banner SVGs
    for (let i = 0; i < Object.values(BannerDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(BannerDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a banner design');
      };
      this.bannerDesigns.set(Object.values(BannerDesignEnum)[i], image);
    }
    // Load and validate box design SVGs
    // Tree 1 designs
    for (let i = 0; i < Object.values(Tree1BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(Tree1BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.tree1BoxDesigns.set(Object.values(Tree1BoxDesignEnum)[i], image);
    }
    // Tree 2 designs
    for (let i = 0; i < Object.values(Tree2BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(Tree2BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.tree2BoxDesigns.set(Object.values(Tree2BoxDesignEnum)[i], image);
    }
    // Tree 3 designs
    for (let i = 0; i < Object.values(Tree3BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(Tree3BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.tree3BoxDesigns.set(Object.values(Tree3BoxDesignEnum)[i], image);
    }
    // load and validate close button image SVG
    this.closeButton.src = CloseBoxDesignEnum.closeButton1;
    this.closeButton.onerror = () => {
      this.handleFailedResourceLoading('Failed to load the tree design SVG');
    };
  }

  handleFailedResourceLoading(message: string) {
    console.error(message);
    this.alert = {
      type: 'danger',
      message: 'Design information has failed to load',
      dismissible: false,
    };
    // stop the canvas rendering process
    cancelAnimationFrame(this.timeInterval);
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = null;
    this.isDesignValid = false;
    this.isDesignValidEvent.emit(this.isDesignValid);
  }

  ngAfterViewInit(): void {
    console.log('Setting up design area');
    // Setup canvas
    this.designCanvas.nativeElement.width = this.canvasResolution.width;
    this.designCanvas.nativeElement.height = this.canvasResolution.height;
    console.log('Canvas', this.designCanvas);
    this.context = this.designCanvas.nativeElement.getContext('2d');
    console.log('Context', this.context);

    for (let i = 0; i < this.myBoxes.length; i++) {}
    // run the render loop
    cancelAnimationFrame(this.timeInterval);
    this.draw();
    console.log('Render loop started');

    // start autosave of design
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = setInterval(() => {
      this.saveDesign();
    }, 1000 * this.autosaveFrequencyInSeconds);
    this.isDesignValid = true;
    this.isDesignValidEvent.emit(this.isDesignValid);
  }

  updateBoxRefText() {
    for (let i = 0; i < this.myBoxes.length; i++) {
      this.myBoxes[i].text = this.myBoxes[i].inputRef.instance.text;
    }
  }

  // create a new box
  createBox(
    initialX: number,
    initialY: number,
    boxDesign: BoxDesignEnum,
    text: string
  ) {
    const newBox: IDraggableBox = {
      x: initialX,
      y: initialY,
      previousX: initialX, //saving x
      previousY: initialY, //saving y
      dragging: false,
      boxDesign: boxDesign,
      text: text,
    };
    const factory = this.resolver.resolveComponentFactory(
      DraggableBoxComponent
    );
    const draggableBoxRef = this.designWrapper.createComponent(factory);

    // set the listeners on the new component
    draggableBoxRef.instance.mousedownEvent.subscribe((value) => {
      this.mouseDownHandler(value);
    });
    draggableBoxRef.instance.mouseupEvent.subscribe((value) => {
      this.mouseUpHandler(value);
    });

    draggableBoxRef.instance.touchmoveEvent.subscribe((value) => {
      this.mouseMoveHandler(value);
    });
    draggableBoxRef.instance.touchstartEvent.subscribe((value) => {
      this.mouseDownHandler(value);
    });
    draggableBoxRef.instance.touchendEvent.subscribe((value) => {
      this.mouseUpHandler(value);
    });
    draggableBoxRef.instance.newTextValue.subscribe((value) => {
      // We don't actually use the value yet since we can't directly apply it to the element in myBoxes (indexes change)
      // Instead, we update all of the boxes via their refs whenever there is a value change (efficient af am I rite?)
      this.updateBoxRefText();
    });
    draggableBoxRef.instance.text = newBox.text;
    draggableBoxRef.instance.zIndex = this.myBoxes.length;
    draggableBoxRef.instance.boxSize = this.boxSize;
    draggableBoxRef.instance.isLargeFont = this.isLargeFont;
    draggableBoxRef.instance.maxCharsPerLine = this.maxCharsPerLine;
    // set the reference to the draggable box component instance
    newBox.inputRef = draggableBoxRef;
    this.cdr.detectChanges();

    this.myBoxes.push(newBox);
  }

  // Draw the entire canvas with the boxes etc
  draw() {
    try {
      // https://medium.com/angular-in-depth/how-to-get-started-with-canvas-animations-in-angular-2f797257e5b4
      this.timeInterval = requestAnimationFrame(this.draw.bind(this));

      this.context.clearRect(
        0,
        0,
        this.designCanvas.nativeElement.width,
        this.designCanvas.nativeElement.height
      );

      // draw the background image
      if (
        this.treeDesigns.get(this.backgroundTreeDesign) !== null &&
        this.treeDesigns.get(this.backgroundTreeDesign).complete
      ) {
        this.context.drawImage(
          this.treeDesigns.get(this.backgroundTreeDesign),
          0,
          0,
          this.designCanvas.nativeElement.width,
          this.designCanvas.nativeElement.height
        );
      }
      // render the banner
      if (
        this.bannerDesigns.get(BannerDesignEnum.banner1) !== null &&
        this.bannerDesigns.get(BannerDesignEnum.banner1).complete
      ) {
        if (this.banner !== undefined && this.banner !== null) {
          const bannerHeightOffset = 0.96;
          // draw the banner at the bottom middle of the tree
          this.context.drawImage(
            this.bannerDesigns.get(BannerDesignEnum.banner1),
            this.canvasResolution.width / 2 - this.bannerDimensions.width / 2,
            this.canvasResolution.height * bannerHeightOffset -
              this.bannerDimensions.height,
            this.bannerDimensions.width,
            this.bannerDimensions.height
          );
          const bannerTextFontSize = 6; // in rem
          this.context.font = `${bannerTextFontSize}rem ${this.font}`;
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillText(
            this.banner.text,
            this.canvasResolution.width / 1.97,
            // I divide the height by 2.2 because the SVG has no proportions and the text is not exactly in the middle of it...
            this.canvasResolution.height * bannerHeightOffset -
              this.bannerDimensions.height / 1.32,
            this.bannerDimensions.width / 2
          );
        }
      }

      // render the boxes
      for (let i = 0; i < this.myBoxes.length; i++) {
        const box = this.myBoxes[i];
        this.context.drawImage(
          this.getImageElementFromBoxDesign(
            this.backgroundTreeDesign,
            box.boxDesign
          ),
          box.x,
          box.y,
          this.boxDimensions.width,
          this.boxDimensions.height
        );
        const cords = this.getRealCords(this.designCanvas.nativeElement, {
          x: box.x,
          y: box.y,
        });
        // Update position of the input field to match the box
        if (this.myBoxes[i].inputRef !== undefined) {
          const scale = this.getCanvasScale(this.designCanvas.nativeElement);
          this.myBoxes[i].inputRef.instance.x = cords.x;
          this.myBoxes[i].inputRef.instance.y = cords.y;
          // set the input dimensions, accounting for the scale between canvas and document
          this.myBoxes[i].inputRef.instance.width = Math.floor(
            this.boxDimensions.width / scale.scaleX
          );
          this.myBoxes[i].inputRef.instance.height = Math.floor(
            this.boxDimensions.height / scale.scaleY
          );
          this.myBoxes[i].inputRef.instance.zIndex = i;
          this.myBoxes[i].inputRef.instance.text = this.myBoxes[i].text;
          this.myBoxes[i].inputRef.instance.boxSize = this.boxSize;
          // draw the close button within the box
          if (this.showDeleteBoxButtons) {
            this.context.drawImage(
              this.closeButton,
              this.myBoxes[i].x + this.closeButtonDimensions.width / 4,
              this.myBoxes[i].y + this.closeButtonDimensions.height / 4,
              this.closeButtonDimensions.width,
              this.closeButtonDimensions.height
            );
          }

          // Draw the text within the box
          // fancy math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
          // times 5 to account for having different scale
          // NOTE - can cause performance issues since it occurs on every frame
          const boxTextFontSize =
            (0.0545 * this.boxSize + 0.05) * (this.isLargeFont ? 7 : 5); // in rem
          // TODO: add multi-line support
          this.context.font = `${boxTextFontSize}rem ${this.font}`;
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          let line = '';
          let currentLine = 1;
          const words = this.myBoxes[i].text
            .substring(0, this.maxCharsPerLine * this.maxLines)
            .split(' ');
          const multiLineText =
            this.myBoxes[i].text.length > this.maxCharsPerLine;
          const x = this.myBoxes[i].x + this.boxDimensions.width / 2;
          let y = this.myBoxes[i].y + this.boxDimensions.height / 2;
          const lineHeight = (this.boxDimensions.height / 5) * 1;
          if (multiLineText) {
            y = this.myBoxes[i].y + (this.boxDimensions.height / 5) * 2;
          }
          const formattedWords = [];
          words.forEach((word) => {
            do {
              if (word.length === 0) {
                break;
              }
              if (word.length >= this.maxCharsPerLine) {
                formattedWords.push(word.substring(0, this.maxCharsPerLine));
                word = word.substring(this.maxCharsPerLine, word.length);
              } else {
                formattedWords.push(word);
                word = '';
              }
            } while (word !== '');
          });
          // print out the text
          for (let j = 0; j < formattedWords.length; j++) {
            const testLine = line + formattedWords[j] + ' ';

            if (testLine.length - 1 > this.maxCharsPerLine) {
              currentLine++;
              if (currentLine > this.maxLines) {
                break;
              }
              this.context.fillText(line, x, y);
              line = formattedWords[j] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          this.context.fillText(line, x, y);
        }
      }
    } catch (error) {
      console.error('An error has occurred while drawing the tree', error);
      // disable autosave and the drawing loop
      cancelAnimationFrame(this.timeInterval);
      clearInterval(this.autosaveInterval);
      this.autosaveInterval = null;
      this.alert = {
        type: 'danger',
        message:
          'An error has occurred while drawing the tree. Please contact us at info@treecreate.dk if it keeps occurring',
        dismissible: false,
      };
      this.isDesignValid = false;
      this.isDesignValidEvent.emit(this.isDesignValid);
    }
  }

  loadDesign() {
    try {
      // clear the existing boxes info
      this.myBoxes.forEach((box) => {
        box.inputRef.destroy();
      });
      this.myBoxes = [];
      // load the design from local storage
      const design: IFamilyTree = this.localStorageService.getItem<IFamilyTree>(
        LocalStorageVars.designFamilyTree
      ).value;
      // Load the design
      if (design === null || design === undefined) {
        // Setup default boxes if there is no saved design
        console.log('There was no saved design, generating a clean slate');
        this.createBox(
          this.canvasResolution.width / 8,
          this.canvasResolution.height / 4,
          Object.values(BoxDesignEnum)[
            Math.floor(Math.random() * this.tree1BoxDesigns.size)
          ],
          ''
        );
        this.createBox(
          this.canvasResolution.width / 6,
          this.canvasResolution.height / 2,
          Object.values(BoxDesignEnum)[
            Math.floor(Math.random() * this.tree1BoxDesigns.size)
          ],
          ''
        );
        this.createBox(
          this.canvasResolution.width / 2,
          this.canvasResolution.height / 3,
          Object.values(BoxDesignEnum)[
            Math.floor(Math.random() * this.tree1BoxDesigns.size)
          ],
          ''
        );
      } else {
        // Setup boxes based on the loaded design
        this.showBanner = design.banner === null;
        this.boxSize = design.boxSize;
        this.backgroundTreeDesign = design.backgroundTreeDesign;
        this.isLargeFont = design.largeFont;
        design.boxes.forEach((box) => {
          this.createBox(box.x, box.y, box.boxDesign, box.text);
        });
      }
      console.log('Boxes', this.myBoxes);
      console.log('Finished loading design');
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Something went wrong while loading the design!', error);
      this.alert = {
        message: 'Something went wrong while loading the design!',
        type: 'danger',
        dismissible: false,
      };
      console.log('interval', this.timeInterval);
      cancelAnimationFrame(this.timeInterval);
      clearInterval(this.autosaveInterval);
      this.isDesignValid = false;
    }
  }

  saveDesign() {
    console.log('Saving your design...');
    if (
      !this.isDesignValid ||
      this.timeInterval === null ||
      this.timeInterval === undefined
    ) {
      console.warn('The design is not valid, and thus it cannot get saved!');
      return false;
    }
    // deep copy the boxes by value (since it modifies the array)
    const boxesCopy: IDraggableBox[] = [];

    // deep copy the myBoxes array while omitting the inputRef property
    this.myBoxes.forEach((box) => {
      boxesCopy.push({
        x: box.x,
        y: box.y,
        previousX: 0,
        previousY: 0,
        dragging: false,
        boxDesign: box.boxDesign,
        text: box.text,
      });
    });

    this.localStorageService.setItem<IFamilyTree>(
      LocalStorageVars.designFamilyTree,
      {
        title: this.title,
        font: FamilyTreeFontEnum.georgia,
        backgroundTreeDesign: this.backgroundTreeDesign,
        boxSize: this.boxSize,
        banner: this.banner,
        largeFont: this.isLargeFont,
        boxes: boxesCopy,
      }
    );
    console.log('Design saved');
  }

  // handle input value updates

  ngOnChanges(changes: SimpleChanges) {
    if (changes.boxSize !== undefined) {
      this.boxDimensions = {
        height:
          (this.canvasResolution.height / 10) *
          (this.boxSize * this.boxSizeScalingMultiplier),
        width:
          (this.canvasResolution.width / 5) *
          (this.boxSize * this.boxSizeScalingMultiplier),
      };

      this.closeButtonDimensions = {
        height:
          (this.canvasResolution.height / 30) *
          (this.boxSize * this.boxSizeScalingMultiplier),
        width:
          (this.canvasResolution.width / 30) *
          (this.boxSize * this.boxSizeScalingMultiplier),
      };
    }

    if (changes.isLargeFont !== undefined) {
      this.maxCharsPerLine = this.isLargeFont
        ? this.largeFontMaxChars
        : this.smallFontMaxChars;
      // update the box inputs
      this.myBoxes.forEach((box) => {
        box.inputRef.instance.maxCharsPerLine = this.maxCharsPerLine;
        box.inputRef.instance.largeFont = this.isLargeFont;
      });
    }
    this.cdr.detectChanges();
  }

  // handle canvas events

  getCanvasScale(canvas): { scaleX: number; scaleY: number } {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    return {
      scaleX: canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY: canvas.height / rect.height, // relationship bitmap vs. element for Y
    };
  }

  // get current mouse position scaled to the canvas dimensions
  getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    // get coordinates based on whether it is a touch or mouse event
    const clientX =
      window.TouchEvent && event instanceof TouchEvent
        ? Math.ceil(
            event.changedTouches[event.changedTouches.length - 1].clientX
          )
        : event.clientX;

    const clientY =
      window.TouchEvent && event instanceof TouchEvent
        ? Math.ceil(
            event.changedTouches[event.changedTouches.length - 1].clientY
          )
        : event.clientY;

    // scale mouse coordinates after they have been adjusted to be relative to element
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  // calculate document mouse coordinates based on canvas coordinates
  getRealCords(canvas, cords: { x: number; y: number }) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    return {
      x: cords.x / scaleX + rect.left + window.pageXOffset,
      y: cords.y / scaleY + rect.top + window.pageYOffset,
    };
  }

  mouseOutsideBoundaries(boxWidth: number, boxHeight: number): boolean {
    return (
      this.mouseCords.x - this.mouseClickOffset.x < 0 ||
      this.mouseCords.x - this.mouseClickOffset.x >
        this.designCanvas.nativeElement.width - boxWidth ||
      this.mouseCords.y - this.mouseClickOffset.y < 0 ||
      this.mouseCords.y - this.mouseClickOffset.y >
        this.designCanvas.nativeElement.height - boxHeight
    );
  }

  mouseDownHandler(event) {
    event = event || window.event;
    // if the mouse down/touchdown event got triggered, don't allow any new down events for 100ms
    if (this.downEventDelay) {
      return;
    } else {
      this.downEventDelay = true;
      setTimeout(() => (this.downEventDelay = false), 100);
    }

    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );
    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];

      if (
        this.mouseCords.x > box.x &&
        this.mouseCords.x < box.x + this.boxDimensions.width &&
        this.mouseCords.y > box.y &&
        this.mouseCords.y < box.y + this.boxDimensions.height
      ) {
        // check if the Close button got pressed
        if (
          this.mouseCords.x > box.x &&
          this.mouseCords.x < box.x + this.closeButtonDimensions.width &&
          this.mouseCords.y > box.y &&
          this.mouseCords.y < box.y + this.closeButtonDimensions.width
        ) {
          // remove the box and the input component
          this.myBoxes[i].inputRef.destroy();
          this.myBoxes.splice(i, 1);
          return;
        }

        this.myBoxes[i].dragging = true;
        this.mouseClickOffset.x = this.mouseCords.x - box.x;
        this.mouseClickOffset.y = this.mouseCords.y - box.y;
        // swap the dragged box to the top of rending order, displaying it on top of the other boxes
        const temp = this.myBoxes[this.myBoxes.length - 1];
        this.myBoxes[this.myBoxes.length - 1] = this.myBoxes[i];
        this.myBoxes[i] = temp;
        // skip checking the other boxes
        return;
      }
    }
    // this will only be reached if none of the boxes was clicked on
    // create new box
    this.createBox(
      this.mouseCords.x - this.boxDimensions.width / 2,
      this.mouseCords.y - this.boxDimensions.height / 2,
      Object.values(BoxDesignEnum)[
        Math.floor(Math.random() * this.tree1BoxDesigns.size)
      ],
      ''
    );

    // auto-focus on the newly created element
    setTimeout(() => {
      this.myBoxes[
        this.myBoxes.length - 1
      ].inputRef.instance.input.nativeElement.focus();
    });
  }

  // the mousemove event is not available as a angular attribute so it has to be declared explicitly
  @HostListener('document:mousemove', ['$event'])
  mouseMoveHandler(event) {
    event = event || window.event;
    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );

    let boxesGotMousedOver = false;

    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      if (
        !this.mouseOutsideBoundaries(
          this.boxDimensions.width,
          this.boxDimensions.height
        )
      ) {
        // check if any of the boxes got moused over
        if (
          this.mouseCords.x > box.x &&
          this.mouseCords.x < box.x + this.boxDimensions.width &&
          this.mouseCords.y > box.y &&
          this.mouseCords.y < box.y + this.boxDimensions.height
        ) {
          boxesGotMousedOver = true;
          this.showDeleteBoxButtons = true;
        }
        if (box.dragging) {
          {
            // move the box with the cursor
            this.myBoxes[i].x = this.mouseCords.x - this.mouseClickOffset.x;
            this.myBoxes[i].y = this.mouseCords.y - this.mouseClickOffset.y;
            // skip checking the other boxes
            return;
          }
        }
      }
    }
    // only stop showing the delete button if none of the boxes got moused over
    if (!boxesGotMousedOver) {
      this.showDeleteBoxButtons = false;
    }
  }

  mouseUpHandler(event) {
    event = event || window.event;
    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );

    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      if (box.dragging) {
        if (
          this.mouseOutsideBoundaries(
            this.boxDimensions.width,
            this.boxDimensions.height
          )
        ) {
          // send back to its last saved position
          this.myBoxes[i].x = box.previousX;
          this.myBoxes[i].y = box.previousY;
          this.myBoxes[i].dragging = false;
        } else {
          // save the box in its new position
          this.myBoxes[i].x = this.mouseCords.x - this.mouseClickOffset.x;
          this.myBoxes[i].y = this.mouseCords.y - this.mouseClickOffset.y;
          this.myBoxes[i].previousX =
            this.mouseCords.x - this.mouseClickOffset.x;
          this.myBoxes[i].previousY =
            this.mouseCords.y - this.mouseClickOffset.y;
          this.myBoxes[i].dragging = false;
        }
        // skip checking the other boxes
        return;
      }
    }
  }

  // Util methods
  // TODO: Extract them into a library

  getImageElementFromBoxDesign(
    treeDesign: TreeDesignEnum,
    boxDesign: BoxDesignEnum
  ): HTMLImageElement {
    switch (treeDesign) {
      case TreeDesignEnum.tree1: {
        return this.tree1BoxDesigns.get(
          Tree1BoxDesignEnum[
            Object.keys(Tree1BoxDesignEnum)[
              Object.keys(Tree1BoxDesignEnum).indexOf(boxDesign)
            ]
          ]
        );
      }
      case TreeDesignEnum.tree2: {
        return this.tree2BoxDesigns.get(
          Tree2BoxDesignEnum[
            Object.keys(Tree2BoxDesignEnum)[
              Object.keys(Tree2BoxDesignEnum).indexOf(boxDesign)
            ]
          ]
        );
      }
      case TreeDesignEnum.tree3: {
        return this.tree3BoxDesigns.get(
          Tree3BoxDesignEnum[
            Object.keys(Tree3BoxDesignEnum)[
              Object.keys(Tree3BoxDesignEnum).indexOf(boxDesign)
            ]
          ]
        );
      }
    }
  }
}
