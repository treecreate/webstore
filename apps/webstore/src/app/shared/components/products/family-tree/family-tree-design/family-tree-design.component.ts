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
  OnDestroy,
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
import { FamilyTreeFontEnum, IDesign, IDraggableBox, IFamilyTree, IFamilyTreeBanner } from '@interfaces';
import { LocalStorageService } from '@local-storage';
import { LocalStorageVars } from '@models';
import { FamilyTreeDesignService } from '../../../../services/design/family-tree-design.service';
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
export class FamilyTreeDesignComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
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

  @ViewChild('foregroundCanvas', { static: true })
  foregroundCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('backgroundImage', { static: true })
  backgroundImage: ElementRef<HTMLImageElement>;

  public context: CanvasRenderingContext2D;

  canvasResolution = {
    height: 2000,
    width: 2000,
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
  frameChanged = true;

  // SVGs

  treeDesigns: Map<TreeDesignEnum, HTMLImageElement> = new Map();
  bannerDesigns: Map<BannerDesignEnum, HTMLImageElement> = new Map();
  bannerDimensions = {
    height: this.canvasResolution.height / 8,
    width: this.canvasResolution.width / 2,
  };
  treeBoxDesigns: Map<Tree1BoxDesignEnum | Tree2BoxDesignEnum | Tree3BoxDesignEnum, HTMLImageElement>[] = new Array<
    Map<Tree1BoxDesignEnum | Tree2BoxDesignEnum | Tree3BoxDesignEnum, HTMLImageElement>
  >(
    new Map<Tree1BoxDesignEnum, HTMLImageElement>(),
    new Map<Tree2BoxDesignEnum, HTMLImageElement>(),
    new Map<Tree3BoxDesignEnum, HTMLImageElement>()
  );
  boxSizeScalingMultiplier = 0.05;
  boxDimensions = {
    height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier),
    width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier),
  };
  closeButton = new Image();
  // If the height doesn't equal the width, the button will not be a cricle and click detection logic will break!
  optionButtonDimensions = {
    height: (this.canvasResolution.height / 30) * (this.boxSize * this.boxSizeScalingMultiplier),
    width: (this.canvasResolution.width / 30) * (this.boxSize * this.boxSizeScalingMultiplier),
  };

  // The max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  largeFontMaxChars = 9;
  maxCharsPerLine = this.isLargeFont ? this.largeFontMaxChars : this.smallFontMaxChars;
  maxLines = 2;

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  // TODO - add a button for controlling this variable
  showDeleteBoxButtons = true;

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private familyTreeDesignService: FamilyTreeDesignService
  ) {}

  ngOnInit(): void {
    // Load and validate tree design SVGs
    for (let i = 0; i < Object.values(TreeDesignEnum).length; i++) {
      let image = new Image();
      this.backgroundImage.nativeElement.src = this.backgroundTreeDesign;
      image.src = Object.values(TreeDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a tree design');
      };
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
      this.treeBoxDesigns[0].set(Object.values(Tree1BoxDesignEnum)[i], image);
    }
    // Tree 2 designs
    for (let i = 0; i < Object.values(Tree2BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(Tree2BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.treeBoxDesigns[1].set(Object.values(Tree2BoxDesignEnum)[i], image);
    }
    // Tree 3 designs
    for (let i = 0; i < Object.values(Tree3BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(Tree3BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.treeBoxDesigns[2].set(Object.values(Tree3BoxDesignEnum)[i], image);
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
    clearInterval(this.timeInterval);
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = null;
    this.isDesignValid = false;
    this.isDesignValidEvent.emit(this.isDesignValid);
  }

  ngAfterViewInit(): void {
    console.log('Setting up design area');
    // Setup canvas
    this.foregroundCanvas.nativeElement.width = this.canvasResolution.width;
    this.foregroundCanvas.nativeElement.height = this.canvasResolution.height;
    this.context = this.foregroundCanvas.nativeElement.getContext('2d');

    // run the render loop
    clearInterval(this.timeInterval);

    this.timeInterval = setInterval(() => {
      if (this.frameChanged) {
        requestAnimationFrame(this.draw.bind(this));
      }
    }, 1000 / this.framesPerSecond);
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
    for (const box of this.myBoxes) {
      box.text = box.inputRef.instance.text;
    }
  }

  // create a new box
  createBox(initialX: number, initialY: number, boxDesign: BoxDesignEnum, text: string) {
    const newBox: IDraggableBox = {
      x: initialX,
      y: initialY,
      previousX: initialX, //saving x
      previousY: initialY, //saving y
      dragging: false,
      boxDesign: boxDesign,
      text: text,
    };
    const factory = this.resolver.resolveComponentFactory(DraggableBoxComponent);
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
    draggableBoxRef.instance.newTextValue.subscribe(() => {
      // We don't actually use the value yet since we can't directly apply it to the element in myBoxes (indexes change)
      // Instead, we update all of the boxes via their refs whenever there is a value change (efficient af am I rite?)
      this.updateBoxRefText();
      this.frameChanged = true;
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
    this.frameChanged = true;
  }

  // Draw the entire canvas with the boxes etc
  draw() {
    try {
      this.context.clearRect(
        0,
        0,
        this.foregroundCanvas.nativeElement.width,
        this.foregroundCanvas.nativeElement.height
      );

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
            this.canvasResolution.height * bannerHeightOffset - this.bannerDimensions.height,
            this.bannerDimensions.width,
            this.bannerDimensions.height
          );
          const bannerTextFontSize = 3; // in rem
          this.context.font = `${bannerTextFontSize}rem ${this.font}`;
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillText(
            this.banner.text,
            this.canvasResolution.width / 1.97,
            // I divide the height by 2.2 because the SVG has no proportions and the text is not exactly in the middle of it...
            this.canvasResolution.height * bannerHeightOffset - this.bannerDimensions.height / 1.32,
            this.bannerDimensions.width / 2
          );
        }
      }

      // render the boxes
      for (let i = 0; i < this.myBoxes.length; i++) {
        const box = this.myBoxes[i];
        this.context.drawImage(
          this.familyTreeDesignService.getImageElementFromBoxDesign(
            this.backgroundTreeDesign,
            box.boxDesign,
            this.treeBoxDesigns
          ),
          box.x,
          box.y,
          this.boxDimensions.width,
          this.boxDimensions.height
        );
        const cords = this.familyTreeDesignService.getRealCords(this.foregroundCanvas.nativeElement, {
          x: box.x,
          y: box.y,
        });
        // Update position of the input field to match the box
        if (this.myBoxes[i].inputRef !== undefined) {
          const scale = this.familyTreeDesignService.getCanvasScale(this.foregroundCanvas.nativeElement);
          this.myBoxes[i].inputRef.instance.x = cords.x;
          this.myBoxes[i].inputRef.instance.y = cords.y;
          // set the input dimensions, accounting for the scale between canvas and document
          this.myBoxes[i].inputRef.instance.width = Math.floor(this.boxDimensions.width / scale.scaleX);
          this.myBoxes[i].inputRef.instance.height = Math.floor(this.boxDimensions.height / scale.scaleY);
          this.myBoxes[i].inputRef.instance.zIndex = i;
          this.myBoxes[i].inputRef.instance.text = this.myBoxes[i].text;
          this.myBoxes[i].inputRef.instance.boxSize = this.boxSize;
          // draw the close button within the box
          if (this.showDeleteBoxButtons) {
            this.context.drawImage(
              this.closeButton,
              this.myBoxes[i].x - this.optionButtonDimensions.width / 4,
              this.myBoxes[i].y - this.optionButtonDimensions.height / 4,
              this.optionButtonDimensions.width,
              this.optionButtonDimensions.height
            );
          }
          this.familyTreeDesignService.drawTextInDraggableBox(
            this.context,
            this.boxSize,
            this.isLargeFont,
            this.font,
            this.myBoxes[i],
            this.boxDimensions
          );
        }
      }
      this.frameChanged = false;
    } catch (error) {
      console.error('An error has occurred while drawing the tree', error);
      // disable autosave and the drawing loop
      clearInterval(this.timeInterval);
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
          this.canvasResolution.width / 7,
          this.canvasResolution.height / 2.5,
          Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.treeBoxDesigns[0].size)],
          'Dig'
        );
        this.createBox(
          this.canvasResolution.width / 2,
          this.canvasResolution.height / 2.5,
          Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.treeBoxDesigns[0].size)],
          'Partner'
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
      console.log('Finished loading design');
      this.frameChanged = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Something went wrong while loading the design!', error);
      this.alert = {
        message: 'Something went wrong while loading the design!',
        type: 'danger',
        dismissible: false,
      };
      console.log('interval', this.timeInterval);
      clearInterval(this.timeInterval);
      clearInterval(this.autosaveInterval);
      this.isDesignValid = false;
    }
  }

  saveDesign() {
    console.log('Saving your design...');
    if (!this.isDesignValid || this.timeInterval === null || this.timeInterval === undefined) {
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

    this.localStorageService.setItem<IFamilyTree>(LocalStorageVars.designFamilyTree, {
      title: this.title,
      font: this.font,
      backgroundTreeDesign: this.backgroundTreeDesign,
      boxSize: this.boxSize,
      banner: this.banner,
      largeFont: this.isLargeFont,
      boxes: boxesCopy,
    });
  }

  // handle input value updates

  ngOnChanges(changes: SimpleChanges) {
    if (changes.boxSize !== undefined) {
      this.boxDimensions = {
        height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier),
        width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier),
      };

      this.optionButtonDimensions = {
        height: (this.canvasResolution.height / 20) * (this.boxSize * this.boxSizeScalingMultiplier),
        width: (this.canvasResolution.width / 20) * (this.boxSize * this.boxSizeScalingMultiplier),
      };
    }

    if (changes.isLargeFont !== undefined) {
      this.maxCharsPerLine = this.isLargeFont ? this.largeFontMaxChars : this.smallFontMaxChars;
      // update the box inputs
      this.myBoxes.forEach((box) => {
        box.inputRef.instance.maxCharsPerLine = this.maxCharsPerLine;
        box.inputRef.instance.largeFont = this.isLargeFont;
      });
    }

    if (changes.backgroundTreeDesign !== undefined) {
      this.backgroundImage.nativeElement.src = this.backgroundTreeDesign;
    }

    this.frameChanged = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.autosaveInterval);
  }

  // handle canvas events

  mouseOutsideBoundaries(boxWidth: number, boxHeight: number): boolean {
    return (
      this.mouseCords.x - this.mouseClickOffset.x < 0 ||
      this.mouseCords.x - this.mouseClickOffset.x > this.foregroundCanvas.nativeElement.width - boxWidth ||
      this.mouseCords.y - this.mouseClickOffset.y < 0 ||
      this.mouseCords.y - this.mouseClickOffset.y > this.foregroundCanvas.nativeElement.height - boxHeight
    );
  }

  mouseDownHandler(event) {
    try {
      event = event || window.event;
      // if the mouse down/touchdown event got triggered, don't allow any new down events for 100ms
      if (this.downEventDelay) {
        return;
      } else {
        this.downEventDelay = true;
        setTimeout(() => (this.downEventDelay = false), 100);
      }

      this.mouseCords = this.familyTreeDesignService.getMousePosition(this.foregroundCanvas.nativeElement, event);
      for (let i = this.myBoxes.length - 1; i >= 0; i--) {
        const box = this.myBoxes[i];

        // check if the Close button got pressed
        if (
          this.familyTreeDesignService.isWithinBoxOption(
            this.mouseCords,
            { x: this.myBoxes[i].x, y: this.myBoxes[i].y },
            this.optionButtonDimensions
          )
        ) {
          // remove the box and the input component
          this.myBoxes[i].inputRef.destroy();
          this.myBoxes.splice(i, 1);
          // prevent follow up click for touch events (causes new click creating a new box)
          event.preventDefault();

          return;
        }
        if (
          this.mouseCords.x > box.x &&
          this.mouseCords.x < box.x + this.boxDimensions.width &&
          this.mouseCords.y > box.y &&
          this.mouseCords.y < box.y + this.boxDimensions.height
        ) {
          this.myBoxes[i].dragging = true;
          this.mouseClickOffset.x = this.mouseCords.x - box.x;
          this.mouseClickOffset.y = this.mouseCords.y - box.y;
          // swap the dragged box to the top of rending order, displaying it on top of the other boxes
          const clickedBox = this.myBoxes[i];
          const temp = this.myBoxes[this.myBoxes.length - 1];
          this.myBoxes[this.myBoxes.length - 1] = this.myBoxes[i];
          this.myBoxes[i] = temp;
          // prevent registration of screen dragging to ensure the background doesn't move on mobile
          event.preventDefault();
          // focus on the input element of the clicked box which is now on top of the stack
          clickedBox.inputRef.instance.input.nativeElement.focus();

          // skip checking the other boxes
          return;
        }
      }
      // this will only be reached if none of the boxes was clicked on
      // create new box
      this.createBox(
        this.mouseCords.x - this.boxDimensions.width / 2,
        this.mouseCords.y - this.boxDimensions.height / 2,
        // assign a random design based on the amount of fetched box designs
        Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.treeBoxDesigns[0].size)],
        ''
      );

      // auto-focus on the newly created element
      setTimeout(() => {
        this.myBoxes[this.myBoxes.length - 1].inputRef.instance.input.nativeElement.focus();
      });
    } finally {
      this.frameChanged = true;
    }
  }

  // the mousemove event is not available as a angular attribute so it has to be declared explicitly
  @HostListener('document:mousemove', ['$event'])
  mouseMoveHandler(event) {
    try {
      event = event || window.event;
      this.mouseCords = this.familyTreeDesignService.getMousePosition(this.foregroundCanvas.nativeElement, event);

      for (const box of this.myBoxes) {
        // if the mouse is within the design boundries and the given box is supposed to be moved, move it to the cursor position
        if (!this.mouseOutsideBoundaries(this.boxDimensions.width, this.boxDimensions.height)) {
          if (box.dragging) {
            {
              // move the box with the cursor
              box.x = this.mouseCords.x - this.mouseClickOffset.x;
              box.y = this.mouseCords.y - this.mouseClickOffset.y;
              // skip checking the other boxes, only one box should get moved at a time
              return;
            }
          }
        }
      }
    } finally {
      this.frameChanged = true;
    }
  }

  mouseUpHandler(event) {
    try {
      event = event || window.event;
      this.mouseCords = this.familyTreeDesignService.getMousePosition(this.foregroundCanvas.nativeElement, event);

      for (const box of this.myBoxes) {
        if (box.dragging) {
          if (this.mouseOutsideBoundaries(this.boxDimensions.width, this.boxDimensions.height)) {
            // send back to its last saved position
            box.x = box.previousX;
            box.y = box.previousY;
            box.dragging = false;
          } else {
            // save the box in its new position
            box.x = this.mouseCords.x - this.mouseClickOffset.x;
            box.y = this.mouseCords.y - this.mouseClickOffset.y;
            box.previousX = this.mouseCords.x - this.mouseClickOffset.x;
            box.previousY = this.mouseCords.y - this.mouseClickOffset.y;
            box.dragging = false;
          }
          // skip checking the other boxes
          return;
        }
      }
    } finally {
      this.frameChanged = true;
    }
  }

  // Util methods
}
