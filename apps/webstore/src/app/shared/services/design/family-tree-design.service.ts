import { Injectable } from '@angular/core';
import {
  BoxDesignEnum,
  Tree1BoxDesignEnum,
  Tree2BoxDesignEnum,
  Tree3BoxDesignEnum,
  Tree4BoxDesignEnum,
  TreeDesignEnum,
} from '@assets';
import { DesignFontEnum, IDraggableBox } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class FamilyTreeDesignService {
  // the max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  maxLines = 2;

  /**
   * Draw the text within a draggable box.
   * @param context canvas context
   * @param boxSize size of the draggable box the text should be written in. Affect font size
   * @param font which font to use
   * @param box draggable box object. Used to get info like text and x/y coordinates
   * @param boxDimensions the exact sizing of the box
   */
  drawTextInDraggableBox(
    context: CanvasRenderingContext2D,
    boxSize: number,
    font: DesignFontEnum,
    box: IDraggableBox,
    boxDimensions: { height: number; width: number }
  ): void {
    // fancy math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
    // times 5 to account for having different scale
    // NOTE - can cause performance issues since it occurs on every frame
    const boxTextFontSize = (0.0425 * boxSize + 0.05) * 2.5; // in rem
    // TODO: add multi-line support
    context.font = `${boxTextFontSize}rem ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    let line = '';
    let currentLine = 1;
    const maxCharsPerLine = this.smallFontMaxChars;
    const words = box.text.substring(0, maxCharsPerLine * this.maxLines).split(' ');
    const multiLineText = box.text.length > maxCharsPerLine;
    const x = box.x + boxDimensions.width / 2;
    let y = box.y + boxDimensions.height / 2;
    const lineHeight = (boxDimensions.height / 5) * 1.1;
    if (multiLineText) {
      y = box.y + (boxDimensions.height / 5) * 2;
    }
    const formattedWords = [];
    words.forEach((word) => {
      do {
        if (word.length === 0) {
          break;
        }
        if (word.length >= maxCharsPerLine) {
          formattedWords.push(word.substring(0, maxCharsPerLine));
          word = word.substring(maxCharsPerLine, word.length);
        } else {
          formattedWords.push(word);
          word = '';
        }
      } while (word !== '');
    });
    // print out the text
    for (const word of formattedWords) {
      const testLine = line + word + ' ';

      if (testLine.length - 1 > maxCharsPerLine) {
        currentLine++;
        if (currentLine > this.maxLines) {
          break;
        }
        context.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  /**
   * Calculate the ratio between the canvas and its bounding rectangle.
   * @param canvas reference to the canvas
   * @returns the scales for x and y axis
   */
  getCanvasScale(canvas): { scaleX: number; scaleY: number } {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    return {
      scaleX: canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY: canvas.height / rect.height, // relationship bitmap vs. element for Y
    };
  }

  /**
   * Calculate document mouse coordinates based on canvas coordinates.
   * @param canvas reference to the canvas
   * @param cords the canvas-relative coordinates
   * @returns actual mouse coordinates on the page
   */
  getRealCords(canvas, cords: { x: number; y: number }): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    return {
      x: cords.x / scaleX + rect.left + window.pageXOffset,
      y: cords.y / scaleY + rect.top + window.pageYOffset,
    };
  }

  /**
   * Get current mouse position scaled to the canvas dimensions.
   * @param canvas reference to the canvas
   * @param event the touch or mouse event to process
   * @returns  the canvas coordinates where the click occured
   */
  getMousePosition(canvas, event: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    // get coordinates based on whether it is a touch or mouse event
    const clientX =
      window.TouchEvent && event instanceof TouchEvent
        ? Math.ceil(event.changedTouches[event.changedTouches.length - 1].clientX)
        : (event as MouseEvent).clientX;

    const clientY =
      window.TouchEvent && event instanceof TouchEvent
        ? Math.ceil(event.changedTouches[event.changedTouches.length - 1].clientY)
        : (event as MouseEvent).clientY;

    // scale mouse coordinates after they have been adjusted to be relative to element
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  /**
   * Based on the specified tree design, return a correct box design,
   * @param treeDesign which tree design to base the box on
   * @param boxDesign which box design to use (index, not source uri)
   * @param fetchedBoxDesigns the already fetched designs
   * @returns appriopriate html image element
   */
  getImageElementFromBoxDesign(
    treeDesign: TreeDesignEnum,
    boxDesign: BoxDesignEnum,
    fetchedBoxDesigns: Map<Tree1BoxDesignEnum | Tree2BoxDesignEnum | Tree3BoxDesignEnum, HTMLImageElement>[]
  ): HTMLImageElement {
    switch (treeDesign) {
      case TreeDesignEnum.tree1: {
        return fetchedBoxDesigns[0].get(
          Tree1BoxDesignEnum[Object.keys(Tree1BoxDesignEnum)[Object.keys(Tree1BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
      case TreeDesignEnum.tree2: {
        return fetchedBoxDesigns[1].get(
          Tree2BoxDesignEnum[Object.keys(Tree2BoxDesignEnum)[Object.keys(Tree2BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
      case TreeDesignEnum.tree3: {
        return fetchedBoxDesigns[2].get(
          Tree3BoxDesignEnum[Object.keys(Tree3BoxDesignEnum)[Object.keys(Tree3BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
      case TreeDesignEnum.tree4: {
        return fetchedBoxDesigns[3].get(
          Tree4BoxDesignEnum[Object.keys(Tree4BoxDesignEnum)[Object.keys(Tree4BoxDesignEnum).indexOf(boxDesign)]]
        );
      }
    }
  }

  /**
   * Based on the specified tree design, return a correct box design URI,
   * @param treeDesign which tree design to base the box on
   * @param boxDesign which box design to use (index, not source uri)
   * @returns appriopriate uri of the given design
   */
  getUriFromBoxDesign(treeDesign: TreeDesignEnum, boxDesign: BoxDesignEnum): string {
    switch (treeDesign) {
      case TreeDesignEnum.tree1: {
        return Tree1BoxDesignEnum[Object.keys(Tree1BoxDesignEnum)[Object.keys(Tree1BoxDesignEnum).indexOf(boxDesign)]];
      }
      case TreeDesignEnum.tree2: {
        return Tree2BoxDesignEnum[Object.keys(Tree2BoxDesignEnum)[Object.keys(Tree2BoxDesignEnum).indexOf(boxDesign)]];
      }
      case TreeDesignEnum.tree3: {
        return Tree3BoxDesignEnum[Object.keys(Tree3BoxDesignEnum)[Object.keys(Tree3BoxDesignEnum).indexOf(boxDesign)]];
      }
      case TreeDesignEnum.tree4: {
        return Tree4BoxDesignEnum[Object.keys(Tree4BoxDesignEnum)[Object.keys(Tree4BoxDesignEnum).indexOf(boxDesign)]];
      }
    }
  }

  /**
   * Returns whether or not the given coordinates are within Close the box option. The icon is assumed to be a circle.
   * @param pointCords point (for example, mouse click) coordinates x and y.
   * @param boxCord starting coordinates of the draggable box. Aka top-left corner x and y values.
   * @param optionButtonDimensions the dimensions of the option button
   * @returns
   */
  isWithinBoxCloseOption(
    pointCords: { x: number; y: number },
    boxCord: { x: number; y: number },
    optionButtonDimensions: { width: number; height: number },
    optionButtonOffset: { dragX: number; dragY: number; closeX: number; closeY: number }
  ): boolean {
    const radius = optionButtonDimensions.width / 2;
    // get where the circle started drawing
    const drawingX = boxCord.x + optionButtonOffset.closeX;
    const drawingY = boxCord.y + optionButtonOffset.closeY;
    // get where the center of the drawn circle is
    const centerX = drawingX + optionButtonDimensions.width / 2;
    const centerY = drawingY + optionButtonDimensions.height / 2;
    return (
      (pointCords.x - centerX) * (pointCords.x - centerX) + (pointCords.y - centerY) * (pointCords.y - centerY) <
      radius * radius
    );
  }
  /**
   * Returns whether or not the given coordinates are within the drag box option. The icon is assumed to be a circle.
   * @param pointCords point (for example, mouse click) coordinates x and y.
   * @param boxCord starting coordinates of the draggable box. Aka top-left corner x and y values.
   * @param optionButtonDimensions the dimensions of the option button
   * @returns
   */
  isWithinBoxDragOption(
    pointCords: { x: number; y: number },
    boxCord: { x: number; y: number },
    optionButtonDimensions: { width: number; height: number },
    optionButtonOffset: { dragX: number; dragY: number; closeX: number; closeY: number }
  ): boolean {
    const radius = optionButtonDimensions.width / 2;
    // get where the circle started drawing
    const drawingX = boxCord.x + optionButtonOffset.dragX;
    const drawingY = boxCord.y + optionButtonOffset.dragY;
    // get where the center of the drawn circle is
    const centerX = drawingX + optionButtonDimensions.width / 2;
    const centerY = drawingY + optionButtonDimensions.height / 2;
    return (
      (pointCords.x - centerX) * (pointCords.x - centerX) + (pointCords.y - centerY) * (pointCords.y - centerY) <
      radius * radius
    );
  }
}
