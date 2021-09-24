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
import { BoxDesignEnum, CloseBoxDesignEnum, TreeDesignEnum } from '@assets';
import {
  FamilyTreeFontEnum,
  IDesign,
  IDraggableBox,
  IFamilyTree,
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
  boxSize = 10;

  @Input()
  title: string;

  @Input()
  showBanner: boolean;

  @Input()
  isLargeFont: boolean;

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

  // render loop
  timeInterval;
  framesPerSecond = 60; // FPS of the render loop
  // autosaving of the design
  autosaveFrequencyInMinutes = 5;
  autosaveInterval;

  // SVGs

  treeDesigns: Map<TreeDesignEnum, HTMLImageElement> = new Map();
  boxDesigns: Map<BoxDesignEnum, HTMLImageElement> = new Map();
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

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

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
    // Load and validate box design SVGs
    for (let i = 0; i < Object.values(BoxDesignEnum).length; i++) {
      let image = new Image();
      image.src = Object.values(BoxDesignEnum)[i];
      image.onerror = () => {
        image = null;
        this.handleFailedResourceLoading('Failed to load a box design');
      };
      this.boxDesigns.set(Object.values(BoxDesignEnum)[i], image);
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
    this.timeInterval = null;
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
    // TODO: Switch to request animation frame
    clearInterval(this.timeInterval);
    this.timeInterval = setInterval(() => {
      try {
        this.draw();
      } catch (error) {
        console.error('failed to draw the design', error);
        // disable autosave and the drawing loop
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        clearInterval(this.autosaveInterval);
        this.autosaveInterval = null;
        this.alert = {
          type: 'danger',
          message:
            'Failed to load design. Please contact us at info@treecreate.dk if it keeps occurring',
          dismissible: false,
        };
        this.isDesignValid = false;
        this.isDesignValidEvent.emit(this.isDesignValid);
      }
    }, 1000 / this.framesPerSecond);
    console.log('Render loop started');

    // start autosave of design
    clearInterval(this.autosaveInterval);
    this.autosaveInterval = setInterval(() => {
      this.saveDesign();
    }, 1000 * 60 * this.autosaveFrequencyInMinutes);
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
    // set the reference to the draggable box component instance
    newBox.inputRef = draggableBoxRef;
    this.cdr.detectChanges();

    this.myBoxes.push(newBox);
  }

  // Draw the entire canvas with the boxes etc
  draw() {
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
        0
      );
    }

    // render the boxes
    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      // console.log('box', box)
      this.context.drawImage(
        this.boxDesigns.get(box.boxDesign),
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
        // draw the close button within the box
        this.context.drawImage(
          this.closeButton,
          this.myBoxes[i].x + this.closeButtonDimensions.width / 4,
          this.myBoxes[i].y + this.closeButtonDimensions.height / 4,
          this.closeButtonDimensions.width,
          this.closeButtonDimensions.height
        );
      }
    }
  }

  loadDesign() {
    // clear the existing boxes info
    this.myBoxes.forEach((box) => {
      box.inputRef.destroy();
    });
    this.myBoxes = [];
    // load the design from loca, storage
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
          Math.floor(Math.random() * this.boxDesigns.size)
        ],
        ''
      );
      this.createBox(
        this.canvasResolution.width / 6,
        this.canvasResolution.height / 2,
        Object.values(BoxDesignEnum)[
          Math.floor(Math.random() * this.boxDesigns.size)
        ],
        ''
      );
      this.createBox(
        this.canvasResolution.width / 2,
        this.canvasResolution.height / 3,
        Object.values(BoxDesignEnum)[
          Math.floor(Math.random() * this.boxDesigns.size)
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
  }

  saveDesign() {
    console.log('Saving your design...');
    console.log(this.timeInterval);
    if (this.timeInterval === null) {
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
        banner: null,
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
        Math.floor(Math.random() * this.boxDesigns.size)
      ],
      ''
    );
  }

  // the mousemove event is not available as a angular attribute so it has to be declared explicitly
  @HostListener('document:mousemove', ['$event'])
  mouseMoveHandler(event) {
    event = event || window.event;
    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );

    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      if (box.dragging) {
        if (
          !this.mouseOutsideBoundaries(
            this.boxDimensions.width,
            this.boxDimensions.height
          )
        ) {
          // move the box with the cursor
          this.myBoxes[i].x = this.mouseCords.x - this.mouseClickOffset.x;
          this.myBoxes[i].y = this.mouseCords.y - this.mouseClickOffset.y;
          // skip checking the other boxes
          return;
        }
      }
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
}
