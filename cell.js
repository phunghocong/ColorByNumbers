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
    }

    draw(size) {

        if (this.drawn) {
            noStroke();
            fill(this.cellColor.color);
            rect(this.x, this.y, size, size);
        }
        else {
            stroke(0);
            
            if (this.highlight) {
                fill(180);
            }
            else if (this.currentColor) {
                fill(this.currentColor);
            }
            else {
                fill(150);
            }
            
            rect(this.x, this.y, size, size);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(size / 4);
            text(this.cellColor.text, this.x, this.y, size, size);
        }
    }
}

class CellColor {
    constructor(color, text) {
        this.color = color;
        this.text = text;
    }
}