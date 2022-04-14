class Game {
  constructor(cells, rows, cols) {
    this.drawingOffSetX = 0;
    this.drawingOffSetY = 0;
    this.size = min(height, width);
    this.rows = rows;
    this.cols = cols;
    this.cellSize = this.size / min(rows, cols);
    this.cells = cells;
    this.currentColor = cells[0].cellColor;

    this.drawingOrder = 0;
    this.count1 = 0;
    this.sceneNum = 0;
  }

  recalculatePositions() {
    for (let c of this.cells) {
      c.x = c.col * this.cellSize + this.drawingOffSetX;
      c.y = c.row * this.cellSize + this.drawingOffSetY;
    }
  }

  draw(lengthX, lengthY) {
    this.recalculatePositions();

    if (!lengthY || lengthY == 0) {
      lengthY = lengthX;
    }

    fill(220);
    rect(0, 0, lengthX, lengthY);

    for (let i = 0; i < this.cells.length; i++) {
      //As X and Y Offset are only used to scale back to 0,0
      //we check if the lower sides of the cells are below (above) 0,0

      let left = this.cells[i].x;
      let right = this.cells[i].x + this.cellSize;
      let up = this.cells[i].y;
      let down = this.cells[i].y + this.cellSize;

      if (right < 0 || left > lengthX || down < 0 || up > lengthY) {
        //console.log("Skip", this.cells[i]);
      } else {
        this.cells[i].draw(this.cellSize);
      }
    }
  }

  move(x, y) {
    this.drawingOffSetX += x;
    this.drawingOffSetY += y;
  }

  checkFinished() {
    if (this.count1 == 256) {
      console.log("Check finished");
      this.sceneNum = 1;
    }
  }

  changeColor(cellColor) {
    this.currentColor = cellColor;

    for (let c of this.cells) {
      if (!c.drawn && c.cellColor == this.currentColor) {
        c.highlight = true;
      } else {
        c.highlight = false;
      }
    }
  }

  action(x, y, action) {
    switch (action) {
      case "drawCell":
        let x_ = floor(x / this.cellSize);
        let y_ = floor(y / this.cellSize);

        let cell;
        for (let c of this.cells) {
          if (c.isClicked(x, y, this.size)) {
            cell = c;
          }
        }
        if (cell) {
          if (cell.cellColor == this.currentColor) {
            cell.drawn = true;
          }
          if (!cell.drawn) {
            // console.log("Sai màu");
            // cell.currentColor = this.currentColor.color;
          }
          if (!cell.isDrawn && cell.drawn) {
            this.count1++;
            // console.error("Counbt: " + this.count1);
          }
          this.checkFinished();
          cell.draw(this.cellSize);
          this.count = this.drawingOrder++;
          return true;
        }
        break;

      case "move":
        break;
    }
  }
}
