import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
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
import { IDesign, IDraggableBox, IFamilyTree } from '@interfaces';
import { FamilyTreeDesignService } from '../../../../services/design/family-tree-design.service';

@Component({
  selector: 'webstore-family-tree-miniature',
  templateUrl: './family-tree-miniature.component.html',
  styleUrls: [
    './family-tree-miniature.component.scss',
    './family-tree-miniature.component.mobile.scss',
    '../../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeMiniatureComponent implements AfterViewInit, OnInit, OnChanges {
  // Inputs for design settings

  @Input()
  design: IFamilyTree = null;

  @Input()
  boxSize = 20;

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
    height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier),
    width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier),
  };
  closeButton = new Image();
  closeButtonDimensions = {
    height: (this.canvasResolution.height / 30) * (this.boxSize * this.boxSizeScalingMultiplier),
    width: (this.canvasResolution.width / 30) * (this.boxSize * this.boxSizeScalingMultiplier),
  };

  // the max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  largeFontMaxChars = 9;
  maxCharsPerLine = this.smallFontMaxChars;
  maxLines = 2;

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  // TODO: show only for one box instead of showing it for all if any of the boxes got moused over
  showDeleteBoxButtons = false;

  constructor(private cdr: ChangeDetectorRef, private familyTreeDesignService: FamilyTreeDesignService) {}

  ngOnInit(): void {
    // Load and validate tree design SVGs
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
  }

  ngAfterViewInit(): void {
    // Setup canvas
    this.foregroundCanvas.nativeElement.width = this.canvasResolution.width;
    this.foregroundCanvas.nativeElement.height = this.canvasResolution.height;
    this.context = this.foregroundCanvas.nativeElement.getContext('2d');

    // Set the background
    if (this.design !== undefined && this.design !== null) {
      this.backgroundImage.nativeElement.src = this.design.backgroundTreeDesign;
    }

    this.isDesignValid = true;
    this.cdr.detectChanges();
    this.loadDesign();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges) {
    // handle input value updates

    if (changes.boxSize !== undefined) {
      this.boxDimensions = {
        height: (this.canvasResolution.height / 10) * (this.boxSize * this.boxSizeScalingMultiplier),
        width: (this.canvasResolution.width / 5) * (this.boxSize * this.boxSizeScalingMultiplier),
      };

      this.closeButtonDimensions = {
        height: (this.canvasResolution.height / 20) * (this.boxSize * this.boxSizeScalingMultiplier),
        width: (this.canvasResolution.width / 20) * (this.boxSize * this.boxSizeScalingMultiplier),
      };
    }

    if (this.design !== undefined && this.context !== undefined) {
      this.loadDesign();

      this.maxCharsPerLine = this.design.largeFont ? this.largeFontMaxChars : this.smallFontMaxChars;
      // Set the background
      this.backgroundImage.nativeElement.src = this.design.backgroundTreeDesign;
    }

    this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    this.myBoxes.push(newBox);
    this.draw();
  }

  // Draw the entire canvas with the boxes etc
  draw() {
    if (!this.design) {
      requestAnimationFrame(this.draw.bind(this));
      return;
    }
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
        if (this.design.banner !== undefined && this.design.banner !== null) {
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
          this.context.font = `${bannerTextFontSize}rem ${this.design.font}`;
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillText(
            this.design.banner.text,
            this.canvasResolution.width / 1.97,
            // I divide the height by 2.2 because the SVG has no proportions and the text is not exactly in the middle of it...
            this.canvasResolution.height * bannerHeightOffset - this.bannerDimensions.height / 1.32,
            this.bannerDimensions.width / 2
          );
        }
      } else {
        requestAnimationFrame(this.draw.bind(this));
        return;
      }

      // render the boxes
      for (const box of this.myBoxes) {
        this.context.drawImage(
          this.getImageElementFromBoxDesign(this.design.backgroundTreeDesign, box.boxDesign),
          box.x,
          box.y,
          this.boxDimensions.width,
          this.boxDimensions.height
        );

        this.familyTreeDesignService.drawTextInDraggableBox(
          this.context,
          this.boxSize,
          this.design.largeFont,
          this.design.font,
          box,
          this.boxDimensions
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
    }
  }

  loadDesign() {
    try {
      this.myBoxes = [];
      // Load the design
      if (this.design === null || this.design === undefined) {
        // Setup default boxes if there is no saved design
        this.createBox(
          this.canvasResolution.width / 8,
          this.canvasResolution.height / 4,
          Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.tree1BoxDesigns.size)],
          ''
        );
        this.createBox(
          this.canvasResolution.width / 6,
          this.canvasResolution.height / 2,
          Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.tree1BoxDesigns.size)],
          ''
        );
        this.createBox(
          this.canvasResolution.width / 2,
          this.canvasResolution.height / 3,
          Object.values(BoxDesignEnum)[Math.floor(Math.random() * this.tree1BoxDesigns.size)],
          ''
        );
      } else {
        // Setup boxes based on the loaded design
        this.boxSize = this.design.boxSize;
        this.design.boxes.forEach((box) => {
          this.createBox(box.x, box.y, box.boxDesign, box.text);
        });
      }
      this.draw();
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
  }

  // Util methods
  // TODO: Extract them into a library

  // handle canvas events

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

  getImageElementFromBoxDesign(treeDesign: TreeDesignEnum, boxDesign: BoxDesignEnum): HTMLImageElement {
    switch (treeDesign) {
      case TreeDesignEnum.tree1: {
        return this.tree1BoxDesigns.get(
          Tree1BoxDesignEnum[Object.keys(Tree1BoxDesignEnum)[Object.keys(Tree1BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
      case TreeDesignEnum.tree2: {
        return this.tree2BoxDesigns.get(
          Tree2BoxDesignEnum[Object.keys(Tree2BoxDesignEnum)[Object.keys(Tree2BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
      case TreeDesignEnum.tree3: {
        return this.tree3BoxDesigns.get(
          Tree3BoxDesignEnum[Object.keys(Tree3BoxDesignEnum)[Object.keys(Tree3BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
    }
  }
}
