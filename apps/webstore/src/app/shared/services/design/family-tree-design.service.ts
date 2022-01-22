import { Injectable } from '@angular/core';
import { FamilyTreeFontEnum, IDraggableBox } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class FamilyTreeDesignService {
  // the max chars control how much text can be put into the draggable box
  // It is propagated to the draggable box input element
  smallFontMaxChars = 12;
  largeFontMaxChars = 9;
  maxLines = 2;

  /**
   * Draw the text within a draggable box
   * @param context canvas context
   * @param boxSize size of the draggable box the text should be written in. Affect font size
   * @param isLargeFont  whether the font is large or normal. Affects font size
   * @param font which font to use
   * @param box draggable box object. Used to get info like text and x/y coordinates
   * @param boxDimensions the exact sizing of the box
   */
  drawTextInDraggableBox(
    context: CanvasRenderingContext2D,
    boxSize: number,
    isLargeFont: boolean,
    font: FamilyTreeFontEnum,
    box: IDraggableBox,
    boxDimensions: { height: number; width: number }
  ): void {
    // fancy math to make the value scale well with box size. Source of values: https://www.dcode.fr/function-equation-finder
    // times 5 to account for having different scale
    // NOTE - can cause performance issues since it occurs on every frame
    const boxTextFontSize = (0.0545 * boxSize + 0.05) * (isLargeFont ? 1.75 : 1.25); // in rem
    // TODO: add multi-line support
    context.font = `${boxTextFontSize}rem ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    let line = '';
    let currentLine = 1;
    const maxCharsPerLine = isLargeFont ? this.largeFontMaxChars : this.smallFontMaxChars;
    const words = box.text.substring(0, maxCharsPerLine * this.maxLines).split(' ');
    const multiLineText = box.text.length > maxCharsPerLine;
    const x = box.x + boxDimensions.width / 2;
    let y = box.y + boxDimensions.height / 2;
    const lineHeight = (boxDimensions.height / 5) * 1.2;
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
}
