import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

interface IDraggableBox {
  x;
  y;
  xS;
  yS;
  w;
  h;
  rgb;
  dragging: boolean;
}

@Component({
  selector: 'webstore-family-tree-design',
  templateUrl: './family-tree-design.component.html',
  styleUrls: [
    './family-tree-design.component.scss',
    './family-tree-design.component.mobile.scss',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class FamilyTreeDesignComponent implements AfterViewInit {
  @ViewChild('designCanvas', { static: true })
  designCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  canvasResolution = {
    height: 1000,
    width: 1000,
  };

  myBoxes: IDraggableBox[] = [];
  mouseCords = {
    x: 0,
    y: 0,
  };

  timeInterval;
  framesPerSecond = 60; // FPS of the render loop

  constructor() {}

  ngAfterViewInit(): void {
    console.log('Setting up design area');
    // Setup canvas
    this.designCanvas.nativeElement.width = this.canvasResolution.width;
    this.designCanvas.nativeElement.height = this.canvasResolution.height;
    console.log('Canvas', this.designCanvas);
    this.context = this.designCanvas.nativeElement.getContext('2d');
    console.log('Context', this.context);

    // Setup boxes
    this.myBoxes[0] = this.createBox(10, 10, 50, 100, 'green');
    this.myBoxes[1] = this.createBox(80, 50, 100, 75, 'blue');
    this.myBoxes[2] = this.createBox(40, 150, 20, 70, 'yellow');
    console.log('Boxes', this.myBoxes);

    // run the render loop
    clearInterval(this.timeInterval);
    this.timeInterval = setInterval(() => {
      this.draw();
    }, 1000 / this.framesPerSecond);
    console.log('Render loop started');
  }

  // create a new box
  createBox(x, y, w, h, rgb): IDraggableBox {
    return {
      x: x,
      y: y,
      xS: x, //saving x
      yS: y, //saving y
      w: w,
      h: h,
      rgb: rgb,
      dragging: false,
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

    //Droppable area (where the boxes can be dropped)
    this.context.fillStyle = 'red';
    this.context.fillRect(
      this.designCanvas.nativeElement.width / 2,
      0,
      this.designCanvas.nativeElement.width,
      this.designCanvas.nativeElement.height
    );

    // render the boxes
    for (let i = 0; i < this.myBoxes.length; i++) {
      const box = this.myBoxes[i];

      // if the box is moving, draw a ghost in its original spot
      if (box.dragging) {
        this.context.fillStyle = 'grey'; //I chose a different color to make it appear more as a shadow of the box that's being moved.
        this.context.fillRect(box.xS, box.yS, box.w, box.h);
        this.context.strokeRect(box.xS, box.yS, box.w, box.h);
      }

      this.context.fillStyle = box.rgb;
      this.context.fillRect(box.x, box.y, box.w, box.h);
      this.context.strokeRect(box.x, box.y, box.w, box.h);
    }
  }

  // get current mouse position scaled to the canvas dimensions
  getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (event.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (event.clientY - rect.top) * scaleY, // been adjusted to be relative to element
    };
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
        this.mouseCords.x < box.x + box.w &&
        this.mouseCords.y > box.y &&
        this.mouseCords.y < box.y + box.h
      ) {
        this.myBoxes[i].dragging = true;
        this.myBoxes[i].dragging = true;
        this.myBoxes[i] = box;
        console.log('Boxes:', this.myBoxes);
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
        this.myBoxes[i].x = this.mouseCords.x;
        this.myBoxes[i].y = this.mouseCords.y;
        this.myBoxes[i] = box;
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
        //if the box is inside the droppable area
        if (box.x > this.designCanvas.nativeElement.width / 2) {
          this.myBoxes[i].x = this.mouseCords.x;
          this.myBoxes[i].y = this.mouseCords.y;
          this.myBoxes[i].dragging = false;
          console.log(
            'Dropping the box wherever it is, iz gucci',
            this.myBoxes[i]
          );
        } else {
          this.myBoxes[i].x = box.xS;
          this.myBoxes[i].y = box.yS;
          this.myBoxes[i].dragging = false;
          console.log('Sending box back to init', this.myBoxes[i]);
        }
      }
    }
  }
}
