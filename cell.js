class Cell {
  constructor(x, y, cellColor) {
    this.col = x;
    this.row = y;
    this.x = x;
    this.y = y;
    this.cellColor = cellColor;
    this.currentColor = undefined;

    this.drawn = false;
    this.highlight = false;
    this.count = 0;
    this.isDrawn = false;
  }

  draw(size) {
    if (this.drawn) {
      noStroke();
      fill(this.cellColor.color);
      rect(this.x, this.y, size, size);
      this.isDrawn = true;
    } else {
      this.isDrawn = false;
      stroke(0);

      if (this.highlight) {
        fill(180);
      } else if (this.currentColor) {
        fill(this.currentColor);
      } else {
        fill(150);
      }

      rect(this.x, this.y, size, size);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(size / 4);
      text(this.cellColor.text, this.x, this.y, size, size);
    }
  }

  isClicked(x, y, size) {
    if (
      this.x <= x &&
      this.x + size >= x &&
      this.y <= y &&
      this.y + size >= y
    ) {
      return true;
    }
    return false;
  }
}

class CellColor {
  constructor(color, text) {
    this.color = color;
    this.text = text;
  }
}
