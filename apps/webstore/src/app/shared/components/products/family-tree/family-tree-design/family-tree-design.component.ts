import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
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
  inputRef?: ComponentRef<DraggableBoxComponent>;
  text: string;
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
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)],
      ''
    );
    this.myBoxes[1] = this.createBox(
      this.canvasResolution.width / 6,
      this.canvasResolution.height / 2,
      (this.canvasResolution.width / 10) * 2,
      this.canvasResolution.height / 10,
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)],
      ''
    );
    this.myBoxes[2] = this.createBox(
      this.canvasResolution.width / 2,
      this.canvasResolution.height / 3,
      (this.canvasResolution.width / 10) * 2,
      this.canvasResolution.height / 10,
      this.boxDesigns[Math.floor(Math.random() * this.boxDesigns.length)],
      ''
    );
    console.log('Boxes', this.myBoxes);

    // TODO: Make the boxes get created during init, then populated after the view is loaded, then fill out with data
    // TODO: Make the new boxes get created when background is clicked
    // TODO: Make boxes get deleted
    for (let i = 0; i < this.myBoxes.length; i++) {
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
      draggableBoxRef.instance.text = this.myBoxes[i].text;
      // set the reference to the draggable box component instance
      this.myBoxes[i].inputRef = draggableBoxRef;
      this.cdr.detectChanges();
    }
    // run the render loop
    // TODO: Switch to request animation frame
    clearInterval(this.timeInterval);
    this.timeInterval = setInterval(() => {
      this.draw();
    }, 1000 / this.framesPerSecond);
    console.log('Render loop started');
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
    width: number,
    height: number,
    boxDesign: HTMLImageElement,
    text: string
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
      text: text,
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
          box.width / scale.scaleX
        );
        this.myBoxes[i].inputRef.instance.height = Math.floor(
          box.height / scale.scaleY
        );
        this.myBoxes[i].inputRef.instance.text = this.myBoxes[i].text;
      }
    }
  }

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
        this.mouseCords.x < box.x + box.width &&
        this.mouseCords.y > box.y &&
        this.mouseCords.y < box.y + box.height
      ) {
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
