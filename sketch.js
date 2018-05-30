let CELLSIZE = 90;

let sheet;
let image;
let openCells = [];
let drawnCells = [];
let choice = []
let curChoice;

let count = 0;
let isDrawn = false;

function preload() {
  sheet = loadImage("assets/sheet.png")
}

function setup() {

  console.log(sheet);

  let rows = sheet.width / 16;
  let cols = sheet.height / 16;
  let col = floor(random(0, cols + 1));
  let row = floor(random(0, rows + 1));

  image = sheet.get(col * 16, row * 16, 16, 16);

  choice = populateColors(image);
  openCells = populateCells(image);

  createCanvas(image.width * CELLSIZE + 1, image.height * CELLSIZE + 100);

  //Draw Cells
  for (let c of openCells) {
    c.draw(CELLSIZE);
  }
  //Draw Control Panel on bottom
  for (let c of choice) {
    c.draw(CELLSIZE, 0, CELLSIZE * (image.height - 1) + 10);
  }
  //Preset choice
  choice[0].highlight(CELLSIZE, 0, CELLSIZE * (image.height - 1) + 10);
  curChoice = choice[0];

  frameRate(60);
}

function draw() {

  if (!isDrawn) {
    if (mouseIsPressed) {
      fillOut();
    }

    if (checkFinished()) {
      isDrawn = true;
      count = 0;
      fill(255);
      rect(0, 0, width, height);
      background(150);
      frameRate(30);
    }
  }
  else {
    drawnCells[count].draw(CELLSIZE);
    count++;
    if (count == drawnCells.length) {
      background(150);
      count = 0;
    }
  }
}

function mousePressed() {
  switchColor();
  return false;
}

function switchColor() {

  let lastChoice = curChoice;
  if (mouseY > image.height * (CELLSIZE - 1) + 10 && mouseY < image.height * (CELLSIZE - 1) + 10 + CELLSIZE) {
    //New Color Picker
    curChoice = choice[floor(mouseX / CELLSIZE)];

    for (let c of choice) {
      c.draw(CELLSIZE, 0, CELLSIZE * (image.height - 1) + 10);
    }
    curChoice.highlight(CELLSIZE, 0, CELLSIZE * (image.height - 1) + 10);
  }

  if (curChoice != lastChoice) {
    for (let cell of openCells) {
      if (cell.cellColor === curChoice) {
        cell.highlight(CELLSIZE);
      }
      else {
        cell.draw(CELLSIZE);
      }
    }
    for (let cell of drawnCells) {
      cell.draw(CELLSIZE);
    }
  }
}

function fillOut() {

  //Check if Mouse is NOT in Image Area or OUT of X Axis of Canvas 
  if (mouseY > image.height * CELLSIZE - 1) {
    return;
  }
  if (mouseX < 0 || mouseX > image.width * CELLSIZE - 1) {
    return;
  }

  let x = floor(mouseX / CELLSIZE);
  let y = floor(mouseY / CELLSIZE);
  let cellIndex = openCells.indexOf(openCells.find(o => o.x == x && o.y == y));

  let cell = openCells[cellIndex];

  //If no Cell has been chosen, exit fillOut
  if (!cell) { return; }


  if (!cell.filled) {
    if (cell.cellColor === curChoice) {
      cell.filled = true;
      cell.count = count++;
      cell.draw(CELLSIZE);
      drawnCells.push(openCells.splice(cellIndex, 1)[0]);
    }
    else {
      cell.currentColor = curChoice.color;
      cell.draw(CELLSIZE);
    }
  }
}

function checkFinished() {
  if (openCells.length == 0) {
    drawnCells.sort(function (a, b) {
      if (a.count > b.count) {
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

function populateColors(tmpImage) {
  let cellColors = [];
  let count = 0;

  tmpImage.loadPixels();

  for (let i = 0; i < tmpImage.pixels.length; i += 4) {
    let r = tmpImage.pixels[i];
    let g = tmpImage.pixels[i + 1];
    let b = tmpImage.pixels[i + 2];
    let alpha = tmpImage.pixels[i + 3];

    let pixelColor = color(r, g, b, alpha);
    //console.log(_color);
    if (!cellColors.find(o => o.color.toString() == pixelColor.toString())) {
      cellColors.push(new CellColor(pixelColor, count + 1, count, 1));
      count++;
    }
  }

  return cellColors;
}

function populateCells(tmpImage) {
  let tmpCells = [];

  let x = 0;
  let y = 0;

  for (let i = 0; i < tmpImage.pixels.length; i += 4) {
    let r = tmpImage.pixels[i];
    let g = tmpImage.pixels[i + 1];
    let b = tmpImage.pixels[i + 2];
    let alpha = tmpImage.pixels[i + 3];

    let pixelColor = color(r, g, b, alpha);
    let colorIndex = choice.indexOf(choice.find(o => o.color.toString() === pixelColor.toString()));

    tmpCells.push(new Cell(x, y, choice[colorIndex]));

    x++;

    if (x == image.width) {
      x = 0;
      y++;
    }
  }

  return tmpCells;
}