class Cell {

    constructor(x, y, cellColor) {
        this.x = x;
        this.y = y;
        this.cellColor = cellColor;

        this.filled = false;
        this.count = 0;
    }

    draw(size) {

        if (this.filled) {
            noStroke();
            fill(this.cellColor.color);
            rect(this.x * size, this.y * size, size, size);
        }
        else {
            stroke(0);
            fill(150);
            rect(this.x * size, this.y * size, size, size);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(size / 4);
            text(this.cellColor.text, this.x * size, this.y * size, size, size);
        }
    }

    highlight(size) {
        if (this.filled) {
            noStroke();
            fill(this.cellColor.color);
            rect(this.x * size, this.y * size, size, size);
        }
        else {
            stroke(0);
            fill(200);
            rect(this.x * size, this.y * size, size, size);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(size / 4);
            text(this.cellColor.text, this.x * size, this.y * size, size, size);
        }
    }
}

class CellColor {
    constructor(color, text, x, y) {
        this.color = color;
        this.text = text;
        this.x = x;
        this.y = y;
    }

    draw(cellSize, xOffset, yOffset) {
        fill(this.color);
        ellipseMode(CORNER);
        ellipse(this.x * cellSize + xOffset, this.y * cellSize + yOffset, cellSize);
        fill(0);
        text(this.text, this.x * cellSize + xOffset, this.y * CELLSIZE + yOffset, cellSize, cellSize);
    }

    highlight(cellSize, xOffset, yOffset) {
        fill(this.color);
        ellipseMode(CORNER);
        ellipse(this.x * cellSize + xOffset, this.y * cellSize + yOffset, cellSize);
        fill(255);
        text(this.text, this.x * cellSize + xOffset, this.y * CELLSIZE + yOffset, cellSize, cellSize);
    }
}