import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TreeDesignEnum, BoxDesignEnum } from '@assets';
import { DraggableBoxComponent } from '../draggable-box/draggable-box.component';

interface IDraggableBox {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  width: number;
  height: number;
  dragging: boolean;
  boxDesign: HTMLImageElement;
}

@Component({
  selector: 'webstore-family-tree-design',
  templateUrl: './family-tree-design.component.html',
  styleUrls: [
    './family-tree-design.component.scss',
    './family-tree-design.component.mobile.scss',
    '../../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeDesignComponent implements AfterViewInit, OnInit {
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

  timeInterval;
  framesPerSecond = 60; // FPS of the render loop

  // SVGs

  treeImage = new Image();
  boxDesigns: HTMLImageElement[] = [];

  alert: {
    type: 'success' | 'info' | 'warning' | 'danger';
    message: string;
    dismissible: boolean;
  };

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load and validate box designs

    console.log('Box design enum:', BoxDesignEnum);

    for (let i = 0; i < Object.values(BoxDesignEnum).length; i++) {
      let image = new Image();
      console.log('box path', Object.values(BoxDesignEnum)[i]);
      image.src = Object.values(BoxDesignEnum)[i];
      image.onerror = () => {
        console.error('Failed to load a box design');
        image = null;
        this.alert = {
          type: 'danger',
          message: 'Design information has failed to load',
          dismissible: false,
        };
        // stop rendering
        clearInterval(this.timeInterval);
      };

      this.boxDesigns.push(image);
    }

    // load and validate tree image svg
    this.treeImage.src = TreeDesignEnum.basicTree;
    this.treeImage.onload = () => {
      console.log('loading');
    };
    this.treeImage.onerror = () => {
      console.error('Failed to load the Tree design SVG');
      this.treeImage = null;
      this.alert = {
        type: 'danger',
        message: 'Design information has failed to load',
        dismissible: false,
      };

      // stop rendering
      clearInterval(this.timeInterval);
    };
  }

  ngAfterViewInit(): void {
    console.log('Setting up design area');
    // Setup canvas
    this.designCanvas.nativeElement.width = this.canvasResolution.width;
    this.designCanvas.nativeElement.height = this.canvasResolution.height;
    console.log('Canvas', this.designCanvas);
    this.context = this.designCanvas.nativeElement.getContext('2d');
    console.log('Context', this.context);

    // Setup boxes
    this.myBoxes[0] = this.createBox(
      this.canvasResolution.width / 8,
      this.canvasResolution.height / 4,
      (this.canvasResolution.width / 10) * 2,
      this.canvasResolution.height / 10,
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)]
    );
    this.myBoxes[1] = this.createBox(
      this.canvasResolution.width / 6,
      this.canvasResolution.height / 2,
      (this.canvasResolution.width / 10) * 2,
      this.canvasResolution.height / 10,
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)]
    );
    this.myBoxes[2] = this.createBox(
      this.canvasResolution.width / 2,
      this.canvasResolution.height / 3,
      (this.canvasResolution.width / 10) * 2,
      this.canvasResolution.height / 10,
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)]
    );
    console.log('Boxes', this.myBoxes);

    // TODO: Make the boxes get created during init, then populated after the view is loaded, then fill out with data
    // TODO: Make the new boxes get created when background is clicked
    // TODO: Make boxes get deleted
    // Create inputs for each box. Possible approach: https://codepen.io/sirspinach/pen/tflio
    for (let i = 0; i < this.myBoxes.length; i++) {
      const factory = this.resolver.resolveComponentFactory(
        DraggableBoxComponent
      );
      const draggableBoxRef = this.designWrapper.createComponent(factory);
      draggableBoxRef.instance.x = this.myBoxes[i].x;
      draggableBoxRef.instance.y = this.myBoxes[i].y;
      draggableBoxRef.instance.text = 'yeet' + i;
      this.cdr.detectChanges();
    }
    // run the render loop
    clearInterval(this.timeInterval);
    this.timeInterval = setInterval(() => {
      this.draw();
    }, 1000 / this.framesPerSecond);
    console.log('Render loop started');
  }

  // create a new box
  createBox(
    initialX: number,
    initialY: number,
    width: number,
    height: number,
    boxDesign: HTMLImageElement
  ): IDraggableBox {
    return {
      x: initialX,
      y: initialY,
      previousX: initialX, //saving x
      previousY: initialY, //saving y
      width: width,
      height: height,
      dragging: false,
      boxDesign: boxDesign,
    };
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
    if (this.treeImage !== null && this.treeImage.complete) {
      this.context.drawImage(this.treeImage, 0, 0);
    }

    // render the boxes
    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      this.context.drawImage(
        box.boxDesign,
        box.x,
        box.y,
        box.width,
        box.height
      );
    }
  }

  // get current mouse position scaled to the canvas dimensions
  getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    // get coordinates based on whether it is a touch or mouse event
    const clientX =
      event instanceof TouchEvent
        ? Math.ceil(
            event.changedTouches[event.changedTouches.length - 1].clientX
          )
        : event.clientX;

    const clientY =
      event instanceof TouchEvent
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
    console.log('down');
    event = event || window.event;
    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );

    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      if (
        this.mouseCords.x > box.x &&
        this.mouseCords.x < box.x + box.width &&
        this.mouseCords.y > box.y &&
        this.mouseCords.y < box.y + box.height
      ) {
        this.myBoxes[i].dragging = true;
        this.mouseClickOffset.x = this.mouseCords.x - box.x;
        this.mouseClickOffset.y = this.mouseCords.y - box.y;
        console.log('Boxes:', this.myBoxes);
        // swap the dragged box to the top of rending order, displaying it on top of the other boxes
        const temp = this.myBoxes[this.myBoxes.length - 1];
        this.myBoxes[this.myBoxes.length - 1] = this.myBoxes[i];
        this.myBoxes[i] = temp;
        // skip checking the other boxes
        return;
      }
    }
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
        if (!this.mouseOutsideBoundaries(box.width, box.height)) {
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
    console.log('up');
    event = event || window.event;
    this.mouseCords = this.getMousePosition(
      this.designCanvas.nativeElement,
      event
    );

    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];
      if (box.dragging) {
        if (this.mouseOutsideBoundaries(box.width, box.height)) {
          // send back to its last saved position
          this.myBoxes[i].x = box.previousX;
          this.myBoxes[i].y = box.previousY;
          this.myBoxes[i].dragging = false;
          console.log('Sending box back to init', this.myBoxes[i]);
        } else {
          // save the box in its new position
          this.myBoxes[i].x = this.mouseCords.x - this.mouseClickOffset.x;
          this.myBoxes[i].y = this.mouseCords.y - this.mouseClickOffset.y;
          this.myBoxes[i].previousX =
            this.mouseCords.x - this.mouseClickOffset.x;
          this.myBoxes[i].previousY =
            this.mouseCords.y - this.mouseClickOffset.y;
          this.myBoxes[i].dragging = false;
          console.log(
            'Dropping the box wherever it is, iz gucci',
            this.myBoxes[i]
          );
        }
        // skip checking the other boxes
        return;
      }
    }
  }
}
