class Game {

    constructor(cells, rows, cols) {

        this.drawingOffSetX = 0;
        this.drawingOffSetY = 0;
        this.size = min(height, width);;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = this.size / min(rows, cols)
        this.cells = cells;
        this.currentColor = cells[0].cellColor;

        this.drawingOrder = 0;
    }

    recalculatePositions() {
        for (let c of this.cells) {
            c.x = c.col * this.cellSize + this.drawingOffSetX;
            c.y = c.row * this.cellSize + this.drawingOffSetY;
        }
    }

    draw(lengthX, lengthY) {

        this.recalculatePositions();

        if (!lengthY || lengthY == 0) { lengthY = lengthX; }

        fill(220);
        rect(0, 0, lengthX, lengthY);

        for (let i = 0; i < this.cells.length; i++) {
            //As X and Y Offset are only used to scale back to 0,0
            //we check if the lower sides of the cells are below (above) 0,0

            let left = this.cells[i].x;
            let right = this.cells[i].x + this.cellSize;
            let up = this.cells[i].y;
            let down = this.cells[i].y + this.cellSize;

            if (right < 0 ||
                left > lengthX ||
                down < 0 ||
                up > lengthY) {
                console.log("Skip", this.cells[i]);
            }
            else {
                this.cells[i].draw(this.cellSize);
            }
        }
    }

    move(x, y) {
        this.drawingOffSetX += x;
        this.drawingOffSetY += y;

        for (let c of this.cells) {
            c.x -= x;
            c.y -= y;
        }
    }

    checkFinished() {
        for (let c of this.cells) {
            if (!c.filled) {
                //If at least one cell is not finished
                return false;
            }
        }
        return true;
    }

    changeColor(cellColor) {
        this.currentColor = cellColor;

        for (let c of this.cells) {
            if (!c.drawn && c.cellColor == this.currentColor) {
                c.highlight = true;
            }
            else {
                c.highlight = false;
            }
        }
    }

    fillOut(x, y, sizeOfCell) {

    }

    action(x, y, action) {

        switch (action) {
            case "drawCell":
                let x_ = floor(x / this.cellSize);
                let y_ = floor(y / this.cellSize);
                let cellIndex = this.cells.indexOf(
                    this.cells.find(
                        c =>
                            c.col == x_ &&
                            c.row == y_));
                if (cellIndex >= 0) {

                    let cell = this.cells[cellIndex];
                    if (cell.cellColor == this.currentColor) {
                        cell.drawn = true;
                    }
                    if (!cell.drawn) {
                        this.cells[cellIndex].currentColor = this.currentColor.color;
                    }
                    this.cells[cellIndex].draw(this.cellSize);
                    this.count = this.drawingOrder++;
                    return true;
                }
                break;

            case "move":
                this.drawingOffSetX += x;
                this.drawingOffSetY += y;
                this.draw(drawingLength);
                break;
        }

    }
}