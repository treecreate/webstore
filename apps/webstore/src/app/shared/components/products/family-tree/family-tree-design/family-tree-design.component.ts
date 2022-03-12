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
  BoxOptionsDesignEnum,
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
  @Input()
  boxSize = 20;

  // Various sizing and position variables
  // Note - modify this variable to control option button size
  boxOptionSize = 10;
  mobileOptionButtonMultiplier = 1.5;
  boxRawSize = 1;
  // Note - modify this variable to control the curve of box size changes
  boxSizeScalingMultiplier = 0.05;

  // The max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  maxCharsPerLine = this.smallFontMaxChars;
  maxLines = 2;

  // FPS of the render loop
  framesPerSecond = 60;
  // design autosave frequency, in seconds
  autosaveFrequencyInSeconds = 30;

  canvasResolution = {
    height: 2000,
    width: 2000,
  };

  bannerDimensions = {
    height: this.canvasResolution.height / 8,
    width: this.canvasResolution.width / 2,
  };
  // dimensions etc of various design elements. Control with variables at the top of the component
  // NOTE - each change needs to be replicated in ngOnChanges method
  boxDimensions = {
    height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier) * this.boxRawSize,
    width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier) * this.boxRawSize,
  };

  // controls position of option buttons around the draggable box
  // NOTE - actual values need to get adjusted in `updateDraggableBoxDimensions` method
  optionButtonOffset: {
    dragX: number;
    dragY: number;
    closeX: number;
    closeY: number;
  };

  // ---------------------------------------------------------- //

  // render loop variables
  timeInterval;
  autosaveInterval;
  frameChanged = true;

  // alert for failed load of the design etc
  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  // Inputs for design settings

  @Input()
  isMutable = false;

  @Input()
  design: IFamilyTree = null;

  @Input()
  banner: IFamilyTreeBanner;

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

  // SVGs

  treeDesigns: Map<TreeDesignEnum, HTMLImageElement> = new Map();
  bannerDesigns: Map<BannerDesignEnum, HTMLImageElement> = new Map();

  treeBoxDesigns: Map<Tree1BoxDesignEnum | Tree2BoxDesignEnum | Tree3BoxDesignEnum, HTMLImageElement>[] = new Array<
    Map<Tree1BoxDesignEnum | Tree2BoxDesignEnum | Tree3BoxDesignEnum, HTMLImageElement>
  >(
    new Map<Tree1BoxDesignEnum, HTMLImageElement>(),
    new Map<Tree2BoxDesignEnum, HTMLImageElement>(),
    new Map<Tree3BoxDesignEnum, HTMLImageElement>()
  );

  closeButton = new Image();
  dragButton = new Image();

  // placeholder dimensions. Get calculated after the canvas is initialized (depend on canvasScaleToBounds)
  optionButtonDimensions = {
    height: 0,
    width: 0,
  };
  canvasScaleToBounds: { scaleX: number; scaleY: number };

  @Input()
  showOptionBoxButtons = true;

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
    this.closeButton.src = BoxOptionsDesignEnum.closeButton1;
    this.closeButton.onerror = () => {
      this.handleFailedResourceLoading('Failed to load the close box SVG');
    };
    // load and validate drag button image SVG
    this.dragButton.src = BoxOptionsDesignEnum.dragButton1;
    this.dragButton.onerror = () => {
      this.handleFailedResourceLoading('Failed to load the drag box SVG');
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
    this.canvasScaleToBounds = this.familyTreeDesignService.getCanvasScale(this.foregroundCanvas.nativeElement);

    // if the design is viewed on mobile, the buttons should be bigger
    if (window.innerWidth <= 640) {
      this.optionButtonDimensions = {
        height:
          (this.canvasResolution.height / 10) *
          this.boxSizeScalingMultiplier *
          this.boxOptionSize *
          this.mobileOptionButtonMultiplier,
        width:
          (this.canvasResolution.width / 10) *
          this.boxSizeScalingMultiplier *
          this.boxOptionSize *
          this.mobileOptionButtonMultiplier,
      };
    } else {
      this.optionButtonDimensions = {
        height: (this.canvasResolution.height / 10) * this.boxSizeScalingMultiplier * this.boxOptionSize,
        width: (this.canvasResolution.width / 10) * this.boxSizeScalingMultiplier * this.boxOptionSize,
      };
    }

    // run the render loop
    clearInterval(this.timeInterval);

    // draws the design boxes on based frequecy (FPS). Only draws them if there is a change to draw
    this.timeInterval = setInterval(() => {
      if (this.frameChanged) {
        requestAnimationFrame(this.draw.bind(this));
      }
    }, 1000 / this.framesPerSecond);
    console.log('Render loop started');

    // start autosave of design
    clearInterval(this.autosaveInterval);
    if (this.isMutable) {
      this.autosaveInterval = setInterval(() => {
        this.saveDesign();
      }, 1000 * this.autosaveFrequencyInSeconds);
    }
    // schedule a refresh in 1 second if immutable (no other triggers for refresh)
    if (!this.isMutable) {
      setTimeout(() => {
        this.updateDraggableBoxDimensions();
        this.frameChanged = true;
      }, 1000);
    }
    this.loadDesign();
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
    draggableBoxRef.instance.boxInitComplete.subscribe(() => {
      this.frameChanged = true;
    });
    draggableBoxRef.instance.newTextValue.subscribe(() => {
      // We don't actually use the value yet since we can't directly apply it to the element in myBoxes (indexes change)
      // Instead, we update all of the boxes via their refs whenever there is a value change (efficient af am I rite?)
      this.updateBoxRefText();
      this.frameChanged = true;
    });
    draggableBoxRef.instance.backgroundImageUri = this.familyTreeDesignService.getUriFromBoxDesign(
      this.backgroundTreeDesign,
      newBox.boxDesign
    );
    draggableBoxRef.instance.boxSize = this.boxSize;
    draggableBoxRef.instance.width = Math.floor(this.boxDimensions.width / this.canvasScaleToBounds.scaleX);
    draggableBoxRef.instance.height = Math.floor(this.boxDimensions.height / this.canvasScaleToBounds.scaleY);
    draggableBoxRef.instance.boxOptionDimensions = {
      height: this.optionButtonDimensions.height / this.canvasScaleToBounds.scaleY,
      width: this.optionButtonDimensions.width / this.canvasScaleToBounds.scaleX,
    };
    draggableBoxRef.instance.optionButtonOffset = {
      dragX: this.optionButtonOffset.dragX / this.canvasScaleToBounds.scaleX,
      dragY: this.optionButtonOffset.dragY / this.canvasScaleToBounds.scaleY,
      closeX: this.optionButtonOffset.closeX / this.canvasScaleToBounds.scaleX,
      closeY: this.optionButtonOffset.closeY / this.canvasScaleToBounds.scaleY,
    };
    draggableBoxRef.instance.text = newBox.text;
    draggableBoxRef.instance.fontSize = 1;
    draggableBoxRef.instance.zIndex = this.myBoxes.length;
    draggableBoxRef.instance.maxCharsPerLine = this.maxCharsPerLine;
    draggableBoxRef.instance.isMutable = this.isMutable;
    draggableBoxRef.instance.showOptionButtons = this.showOptionBoxButtons;
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
      // recalculate the scale (screen size change etc)
      this.canvasScaleToBounds = this.familyTreeDesignService.getCanvasScale(this.foregroundCanvas.nativeElement);

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
      // fancy magic math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
      const boxFontSize = ((0.045 * this.boxSize + 0.05) / this.canvasScaleToBounds.scaleX) * 2;
      for (let i = 0; i < this.myBoxes.length; i++) {
        const box = this.myBoxes[i];
        // Update position of the input field to match the box
        const cords = this.familyTreeDesignService.getRealCords(this.foregroundCanvas.nativeElement, {
          x: box.x,
          y: box.y,
        });
        if (this.myBoxes[i].inputRef !== undefined) {
          this.myBoxes[i].inputRef.instance.x = cords.x;
          this.myBoxes[i].inputRef.instance.y = cords.y;
          this.myBoxes[i].inputRef.instance.zIndex = i;
          this.myBoxes[i].inputRef.instance.fontSize = boxFontSize;
          this.myBoxes[i].inputRef.instance.text = this.myBoxes[i].text;
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
      let design: IFamilyTree = null;
      if (this.isMutable) {
        design = this.localStorageService.getItem<IFamilyTree>(LocalStorageVars.designFamilyTree).value;
      } else {
        design = this.design;
      }
      // Load the design
      if (design === null || design === undefined) {
        // Setup default boxes if there is no saved design and it is not an immutable miniature etc
        if (this.isMutable) {
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
        }
      } else {
        // Setup boxes based on the loaded design
        this.boxSize = design.boxSize;
        this.backgroundTreeDesign = design.backgroundTreeDesign;
        design.boxes.forEach((box) => {
          this.createBox(box.x, box.y, box.boxDesign, box.text);
        });
      }
      console.log('Finished loading design');
      this.frameChanged = true;
      this.updateDraggableBoxDimensions();
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
    if (!this.isMutable) {
      return;
    }
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
      font: this.font,
      backgroundTreeDesign: this.backgroundTreeDesign,
      boxSize: this.boxSize,
      banner: this.banner,
      boxes: boxesCopy,
    });
  }

  // handle input value updates

  ngOnChanges(changes: SimpleChanges) {
    if (changes.boxSize !== undefined) {
      this.updateDraggableBoxDimensions();
    }

    if (changes.backgroundTreeDesign !== undefined) {
      this.backgroundImage.nativeElement.src = this.backgroundTreeDesign;
    }

    if (changes.font !== undefined) {
      setTimeout(() => {
        for (let i = 0; i < this.myBoxes.length; i++) {
          this.myBoxes[i].inputRef.instance.adjustInputHeight();
        }
      }, 50);
    }

    if (changes.showOptionBoxButtons !== undefined) {
      for (let i = 0; i < this.myBoxes.length; i++) {
        this.myBoxes[i].inputRef.instance.showOptionButtons = changes.showOptionBoxButtons.currentValue;
      }
    }

    this.frameChanged = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.autosaveInterval);
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(): void {
    this.updateDraggableBoxDimensions();
    this.frameChanged = true;
  }

  /**
   * Update various dimensions related properties of all draggable boxes based on the state of the canvas.
   */
  updateDraggableBoxDimensions(): void {
    this.boxDimensions = {
      height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier) * this.boxRawSize,
      width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier) * this.boxRawSize,
    };

    // controls position of option buttons around the draggable box
    this.optionButtonOffset = {
      dragX: this.boxDimensions.width * 0.9,
      dragY: this.boxDimensions.height / 2 + this.optionButtonDimensions.height * 0.1,
      closeX: this.boxDimensions.width * 0.9,
      closeY: this.boxDimensions.height / 2 - this.optionButtonDimensions.height * 1.1,
    };

    // update all of the boxes with new sizing information
    for (let i = 0; i < this.myBoxes.length; i++) {
      // set the input and option button dimensions, accounting for the scale between canvas and document
      // needs to occur on each frame in case of screen size changing
      this.myBoxes[i].inputRef.instance.boxSize = this.boxSize;
      this.myBoxes[i].inputRef.instance.width = Math.floor(this.boxDimensions.width / this.canvasScaleToBounds.scaleX);
      this.myBoxes[i].inputRef.instance.height = Math.floor(
        this.boxDimensions.height / this.canvasScaleToBounds.scaleY
      );
      this.myBoxes[i].inputRef.instance.boxOptionDimensions = {
        height: this.optionButtonDimensions.height / this.canvasScaleToBounds.scaleY,
        width: this.optionButtonDimensions.width / this.canvasScaleToBounds.scaleX,
      };
      this.myBoxes[i].inputRef.instance.optionButtonOffset = {
        dragX: this.optionButtonOffset.dragX / this.canvasScaleToBounds.scaleX,
        dragY: this.optionButtonOffset.dragY / this.canvasScaleToBounds.scaleY,
        closeX: this.optionButtonOffset.closeX / this.canvasScaleToBounds.scaleX,
        closeY: this.optionButtonOffset.closeY / this.canvasScaleToBounds.scaleY,
      };
    }
  }

  private calculateOptionButtonOffset(): void {}

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
    if (!this.isMutable) {
      return;
    }
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
        // only works if the buttons are supposed to be shown
        if (
          this.showOptionBoxButtons &&
          this.familyTreeDesignService.isWithinBoxCloseOption(
            this.mouseCords,
            { x: this.myBoxes[i].x, y: this.myBoxes[i].y },
            this.optionButtonDimensions,
            this.optionButtonOffset
          )
        ) {
          // remove the box and the input component
          this.myBoxes[i].inputRef.destroy();
          this.myBoxes.splice(i, 1);
          // prevent follow up click for touch events (causes new click creating a new box)
          event.preventDefault();

          return;
        }
        // check if the Drag button got pressed
        // only works if the buttons are supposed to be shown
        if (
          this.showOptionBoxButtons &&
          this.familyTreeDesignService.isWithinBoxDragOption(
            this.mouseCords,
            { x: this.myBoxes[i].x, y: this.myBoxes[i].y },
            this.optionButtonDimensions,
            this.optionButtonOffset
          )
        ) {
          // remove the box and the input component
          this.myBoxes[i].dragging = true;
          this.mouseClickOffset.x = this.mouseCords.x - this.myBoxes[i].x;
          this.mouseClickOffset.y = this.mouseCords.y - this.myBoxes[i].y;

          this.bringBoxToFront(i);
          // prevent registration of screen dragging to ensure the background doesn't move on mobile
          event.preventDefault();
          return;
        }
        if (
          this.mouseCords.x > box.x &&
          this.mouseCords.x < box.x + this.boxDimensions.width &&
          this.mouseCords.y > box.y &&
          this.mouseCords.y < box.y + this.boxDimensions.height
        ) {
          this.bringBoxToFront(i);
          // skip checking the other boxes
          return;
        }
      }
      // this will only be reached if none of the boxes was clicked on
      // create a new box
      // if part of it would end up outside of the boundries it gets moved a bit to fit
      let createOffsetX = 0;
      let createOffsetY = 0;
      if (this.mouseCords.x - this.boxDimensions.width / 2 < 0) {
        createOffsetX = this.boxDimensions.width / 2;
      }
      if (this.mouseCords.x + this.boxDimensions.width / 2 > this.canvasResolution.width) {
        createOffsetX = (this.boxDimensions.width / 2) * -1;
      }
      if (this.mouseCords.y - this.boxDimensions.height / 2 < 0) {
        createOffsetY = this.boxDimensions.height / 2;
      }
      if (this.mouseCords.y + this.boxDimensions.height / 2 > this.canvasResolution.height) {
        createOffsetY = (this.boxDimensions.height / 2) * -1;
      }
      // create new box
      this.createBox(
        this.mouseCords.x - this.boxDimensions.width / 2 + createOffsetX,
        this.mouseCords.y - this.boxDimensions.height / 2 + createOffsetY,
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
    if (!this.isMutable) {
      return;
    }
    try {
      event = event || window.event;
      this.mouseCords = this.familyTreeDesignService.getMousePosition(this.foregroundCanvas.nativeElement, event);

      for (const box of this.myBoxes) {
        // if the mouse is within the design boundries and the given box is supposed to be moved, move it to the cursor position
        if (box.dragging && !this.mouseOutsideBoundaries(this.boxDimensions.width, this.boxDimensions.height)) {
          {
            // move the box with the cursor
            box.x = this.mouseCords.x - this.mouseClickOffset.x;
            box.y = this.mouseCords.y - this.mouseClickOffset.y;
            // skip checking the other boxes, only one box should get moved at a time
            return;
          }
        }
      }
    } finally {
      this.frameChanged = true;
    }
  }

  mouseUpHandler(event) {
    if (!this.isMutable) {
      return;
    }
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

  /**
   * Swap the dragged box to the top of rending order, displaying it on top of the other boxes.
   * Focuses on the input element of the clicked box which is now on top of the stack.
   * @param boxIndex the index in myBoxes of the now-first box.
   */
  bringBoxToFront(boxIndex: number): void {
    const clickedBox = this.myBoxes[boxIndex];
    const temp = this.myBoxes[this.myBoxes.length - 1];
    this.myBoxes[this.myBoxes.length - 1] = this.myBoxes[boxIndex];
    this.myBoxes[boxIndex] = temp;
    clickedBox.inputRef.instance.input.nativeElement.focus();
  }
}
