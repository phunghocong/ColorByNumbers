class Tool {

    constructor(icon, func, param) {
        this.icon = icon;
        this.func = func;
        this.param = param;
    }

    execute() {
        this.func(this.param);
    }

    draw(x, y) {
        image(this.icon, x, y);
        this.x = x;
        this.y = y;
    }
}

class ToolGroup {
    constructor(name, tools) {
        this.name = name;
        this.offSet = 0;
        this.tools = [];

        if (tools) {
            this.tools.push(tools);
        }
    }

    addTools(tools) {
        this.tools.push(tools);
    }

    move(pixels) {
        this.offSet += pixels;
    }

    draw(x, y, isVertical, iconSize) {

        fill(255);
        noStroke();
        
        if (isVertical) {
            x -= this.offSet;
            rect(0, y, width, iconSize);
        }
        else {
            y -= this.offSet;
            rect(x, 0, iconSize, height);
        }

        for (let t of this.tools) {

            t.draw(x, y);

            if (isVertical) {
                x += iconSize;
            }
            else {
                y += iconSize;
            }
        }
    }
}

class ToolBox {
    constructor(iconSize) {
        this.groups = [];
        this.iconSize = iconSize;
    }

    addGroup(group) {
        if (this.groups.find(g => g.name == group.name) == undefined) {
            this.groups.push(group);
        }
    }

    removeGroup(name) {
        let index = this.groups.indexOf(g => g.name == name);
        if (index >= 0) {
            this.groups.splice(index, 1);
        }
    }

    draw(x, y, isVertical) {
        for (let g of this.groups) {
            g.draw(x, y, isVertical, this.iconSize);

            if (isVertical) {
                //Start a new Row
                y += this.iconSize;
            }
            else {
                //Start a new Column
                x += this.iconSize;
            }
        }
    }

    findAndExecute(x, y) {

        for (let g of this.groups) {
            for (let t of g.tools) {
                if (t.x < x &&
                    t.x + this.iconSize > x &&
                    t.y < y &&
                    t.y + this.iconSize > y) {
                    t.execute();

                    break;
                }
            }
        }
    }
}