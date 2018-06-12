class Cell {

    constructor(x, y, cellColor) {
        this.x = x;
        this.y = y;
        this.cellColor = cellColor;
        this.currentColor = undefined;

        this.filled = false;
        this.count = 0;
    }

    draw(size) {

        if (this.filled) {
            stroke(this.cellColor.color);
            fill(this.cellColor.color);
            rect(this.x * size, this.y * size, size, size);
        }
        else {
            stroke(0);
            if (this.currentColor) {
                fill(this.currentColor);
            }
            else {
                fill(150);
            }
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
    constructor(color, text) {
        this.color = color;
        this.text = text;
    }
}