import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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

@Component({
  selector: 'webstore-family-tree-miniature',
  templateUrl: './family-tree-miniature.component.html',
  styleUrls: [
    './family-tree-miniature.component.scss',
    './family-tree-miniature.component.mobile.scss',
    '../../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeMiniatureComponent implements AfterViewInit, OnInit {
  // Inputs for design settings

  @Input()
  design: IFamilyTree;

  @Input()
  boxSize = 20;

  @Input()
  title: string;

  @Input()
  showBanner: boolean;

  @Input()
  banner: IFamilyTreeBanner;

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

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  // TODO: show only for one box instead of showing it for all if any of the boxes got moused over
  showDeleteBoxButtons = false;

  constructor(private cdr: ChangeDetectorRef) {}

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

    this.draw();

    this.isDesignValid = true;
    this.isDesignValidEvent.emit(this.isDesignValid);
    this.cdr.detectChanges();
    this.loadDesign();
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
    this.cdr.detectChanges();

    this.myBoxes.push(newBox);
  }

  // Draw the entire canvas with the boxes etc
  draw() {
    try {
      requestAnimationFrame(this.draw.bind(this));
      this.context.clearRect(
        0,
        0,
        this.designCanvas.nativeElement.width,
        this.designCanvas.nativeElement.height
      );

      // draw the background image
      if (
        this.treeDesigns.get(this.backgroundTreeDesign) !== undefined &&
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
        this.bannerDesigns.get(BannerDesignEnum.banner1) !== undefined &&
        this.bannerDesigns.get(BannerDesignEnum.banner1).complete
      ) {
        if (this.banner !== undefined && this.banner !== null) {
          // draw the banner at the bottom middle of the tree
          this.context.drawImage(
            this.bannerDesigns.get(BannerDesignEnum.banner1),
            this.canvasResolution.width / 2 - this.bannerDimensions.width / 2,
            this.canvasResolution.height - this.bannerDimensions.height,
            this.bannerDimensions.width,
            this.bannerDimensions.height
          );
          const bannerTextFontSize = 6; // in rem
          this.context.font = `${bannerTextFontSize}rem ${this.font}`;
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillText(
            this.banner.text,
            this.canvasResolution.width / 2,
            // I divide the height by 2.2 because the SVG has no proportions and the text is not exactly in the middle of it...
            this.canvasResolution.height - this.bannerDimensions.height / 2.2,
            this.bannerDimensions.width / 3
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

        // Draw the text within the box
        // fancy math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
        // times 5 to account for having different scale
        const boxTextFontSize =
          (0.0545 * this.boxSize + 0.05) * (this.isLargeFont ? 7 : 5); // in rem
        // TODO: add multi-line support
        this.context.font = `${boxTextFontSize}rem ${this.font}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(
          this.myBoxes[i].text,
          this.myBoxes[i].x + this.boxDimensions.width / 2,
          this.myBoxes[i].y + this.boxDimensions.height / 2,
          (this.boxDimensions.width / 3) * 2
        );
      }
    } catch (error) {
      console.error('An error has occurred while drawing the tree', error);
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
      // Load the design
      if (this.design === null || this.design === undefined) {
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
        this.showBanner = this.design.banner === null;
        this.boxSize = this.design.boxSize;
        this.backgroundTreeDesign = this.design.backgroundTreeDesign;
        this.isLargeFont = this.design.largeFont;
        this.design.boxes.forEach((box) => {
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
      this.isDesignValid = false;
    }

    this.draw();
  }

  // Util methods
  // TODO: Extract them into a library

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
