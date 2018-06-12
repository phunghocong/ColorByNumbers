const SPRITESIZE = 16;

let CELLSIZE = 0;

let sheet;
let img;

let openCells = [];
let drawnCells = [];

let colors = []
let color_;

let tools;

let drawnTile = 0;
let isDrawn = false;

function preload() {
  sheet = loadImage("assets/sheet.png")
}

function setup() {

  let rows = sheet.width / SPRITESIZE;
  let cols = sheet.height / SPRITESIZE;
  let col = floor(random(0, cols));
  let row = floor(random(0, rows));

  img = sheet.get(col * SPRITESIZE, row * SPRITESIZE, SPRITESIZE, SPRITESIZE);

  pre_populate(img);

  tools = new ToolBox(30);
  createToolbox();

  createCanvas(windowWidth - 5, windowHeight - 5);
  CELLSIZE = min(width - 1, height - 1) / SPRITESIZE;

  //Draw Cells
  drawGame();

  color_ = colors[0];

  frameRate(60);
}

function draw() {

  if (!isDrawn) {

    if (mouseIsPressed) {
      fillOut();
    }

    if (checkFinished()) {
      isDrawn = true;
      drawnTile = 0;
      fill(255);
      rect(0, 0, width, height);
      background(150);
      frameRate(30);
    }
  }
  else {
    drawAuto();
  }
}

function mousePressed() {
  let gameArea = min(height, width);

  if (mouseY > gameArea || mouseX > gameArea) {
    //Do not draw
    tools.findAndExecute(mouseX, mouseY);
  }
}

function switchColor(newColor) {
  color_ = newColor;
  drawGame();
}

function fillOut() {

  let gameArea = min(height, width);
  //Check if Mouse is NOT in img Area or OUT of X Axis of Canvas 
  if (mouseY > gameArea || mouseX > gameArea) {
    return;
  }

  let x = floor(mouseX / CELLSIZE);
  let y = floor(mouseY / CELLSIZE);
  let cellIndex = openCells.indexOf(openCells.find(o => o.x == x && o.y == y));

  let cell = openCells[cellIndex];

  //If no Cell has been chosen, exit fillOut
  if (!cell) { return; }


  if (!cell.filled) {
    if (cell.cellColor === color_) {
      cell.filled = true;
      cell.drawnTile = drawnTile++;
      cell.draw(CELLSIZE);
      drawnCells.push(openCells.splice(cellIndex, 1)[0]);
    }
    else {
      cell.currentColor = color_.color;
      cell.draw(CELLSIZE);
    }
  }
}

function checkFinished() {
  if (openCells.length == 0) {
    drawnCells.sort(function (a, b) {
      if (a.drawnTile > b.drawnTile) {
        return 1;
      }
      else {
        return -1;
      }
    });
    return true;
  }
  return false;
}

function createToolbox() {

  let tG = new ToolGroup("tools");

  //---------
  let black = createGraphics(tools.iconSize, tools.iconSize);
  black.fill(0);
  black.rect(0, 0, tools.iconSize - 2, tools.iconSize - 2);

  //---------

  tG.addTools(new Tool(black, function () {
    if (CELLSIZE < min(height, width)) {
      background(255);
      CELLSIZE++;
      drawGame();
    }
  }));

  tG.addTools(new Tool(black, function () {
    if (CELLSIZE > 1) {
      background(255);
      CELLSIZE--;
      drawGame();
    }
  }));


  let cS = new ToolGroup("colors");

  for (let c of colors) {
    let graph = createGraphics(tools.iconSize, tools.iconSize);
    graph.fill(c.color);
    graph.strokeWeight(1);
    graph.ellipseMode(CORNERS);
    graph.ellipse(0, 0, tools.iconSize / 2);

    graph.strokeWeight(3);
    graph.fill(255);
    graph.stroke(0);
    graph.textAlign(CENTER, CENTER);
    graph.textSize(tools.iconSize / 3);
    graph.text(c.text, tools.iconSize / 4, tools.iconSize / 4);
    cS.addTools(new Tool(graph, switchColor, c));
  }

  tools.addGroup(tG);
  tools.addGroup(cS);
}

function drawGame() {

  let gameArea = min(height, width);

  for (let c of openCells) {
    if (c.cellColor === color_ && !c.filled) {
      c.highlight(CELLSIZE);
    }
    else {
      c.draw(CELLSIZE);
    }
  }

  for (let c of drawnCells) {
    c.draw(CELLSIZE);
  }

  let horiz = height > width;

  fill(255);
  rect(0, gameArea, width, height);
  rect(gameArea, 0, width, height);

  tools.draw(
    horiz ? 0 : gameArea,
    horiz ? gameArea : 0,
    horiz);
}

function drawAuto() {
  drawnCells[drawnTile].draw(CELLSIZE);
  drawnTile++;
  if (drawnTile == drawnCells.length) {
    background(150);
    drawnTile = 0;
  }
}

function pre_populate(tmpImage) {
  let tmpCellColors = [];
  let tmpCells = [];

  let count = 0;
  let x = 0;
  let y = 0;

  tmpImage.loadPixels();

  for (let i = 0; i < tmpImage.pixels.length; i += 4) {
    let r = tmpImage.pixels[i];
    let g = tmpImage.pixels[i + 1];
    let b = tmpImage.pixels[i + 2];
    let alpha = tmpImage.pixels[i + 3];

    let pixelColor = color(r, g, b, alpha);
    let colorIndex = tmpCellColors.indexOf(tmpCellColors.find(
      c => c.color.toString() == pixelColor.toString())
    );

    if (colorIndex == -1) {
      tmpCellColors.push(new CellColor(pixelColor, count+=1));
      tmpCells.push(new Cell(x, y, tmpCellColors[tmpCellColors.length - 1]));
    }
    else {
      tmpCells.push(new Cell(x, y, tmpCellColors[colorIndex]));
    }

    x++;
    if (x == tmpImage.width) {
      x = 0;
      y++;
    }
  }

  colors = tmpCellColors;
  openCells = tmpCells;

  //return cellColors;
}
/* 
function pre_populateCells(tmpImage) {
  let tmpCells = [];

  let x = 0;
  let y = 0;

  for (let i = 0; i < tmpImage.pixels.length; i += 4) {
    let r = tmpImage.pixels[i];
    let g = tmpImage.pixels[i + 1];
    let b = tmpImage.pixels[i + 2];
    let alpha = tmpImage.pixels[i + 3];

    let pixelColor = color(r, g, b, alpha);
    let colorIndex = colors.indexOf(colors.find(o => o.color.toString() === pixelColor.toString()));

    tmpCells.push(new Cell(x, y, colors[colorIndex]));

    x++;

    if (x == img.width) {
      x = 0;
      y++;
    }
  }

  return tmpCells;
} */