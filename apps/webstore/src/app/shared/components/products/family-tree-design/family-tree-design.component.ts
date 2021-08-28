import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

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
    height: 4000,
    width: 4000,
  };

  constructor() {}

  ngAfterViewInit(): void {
    // Setup canvas
    this.designCanvas.nativeElement.width = this.canvasResolution.width;
    this.designCanvas.nativeElement.height = this.canvasResolution.height;
    this.context = this.designCanvas.nativeElement.getContext('2d');
    this.renderDefaultTree();
  }

  renderDefaultTree() {
    this.context.fillStyle = 'red';
    this.context.fillRect(
      0,
      0,
      this.designCanvas.nativeElement.width,
      this.designCanvas.nativeElement.height
    );
    this.context.fillStyle = 'purple';
    this.context.fillRect(0, 0, 100, 100);
  }
}
