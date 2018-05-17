let CELLSIZE = 90;
let COLS = 10;
let ROWS = 10;

let picture = [];
let drawn = [];
let choice = []
let curChoice;

let count = 0;
let isDrawn = false;
let DRAWNBUTTON;

function setup() {

  createCanvas(COLS * CELLSIZE + 1, ROWS * CELLSIZE + 100);

  //Create CellColors
  let cColors = [];
  for (let i = 0; i < COLS; i++) {
    choice.push(new CellColor(color(random(255), random(255), random(255)), i + 1, i, 1));
  }

  //Fill "picture" and 
  for (let i = 0; i < COLS; i++) {
    //picture[i] = [];
    for (let j = 0; j < ROWS; j++) {
      let newCell = new Cell(i, j, choice[floor(random(choice.length))]);
      newCell.draw(CELLSIZE);
      picture.push(newCell);
    }
  }


  //Draw Control Panel on bottom
  for (let c of choice) {
    c.draw(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
  }

  //Preset choice
  choice[0].highlight(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
  curChoice = choice[0];
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
      frameRate(5);
    }
  }
  else {
    drawn[count].draw(CELLSIZE);
    count++;
    if (count == drawn.length) {
      count = 0;
      fill(255);
      rect(0, 0, width, height);
    }
  }
}

function mousePressed() {
  switchColor();
  return false;
}

function switchColor() {
  let oldChoice = curChoice;
  if (mouseY > ROWS * (CELLSIZE - 1) + 10 && mouseY < ROWS * (CELLSIZE - 1) + 10 + CELLSIZE) {
    //New Color Picker

    curChoice = choice[floor(mouseX / CELLSIZE)];

    for (let c of choice) {
      c.draw(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
    }
    curChoice.highlight(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);

  }

  if (curChoice != oldChoice) {
    for (let cell of picture) {
      //console.log(cell.CellColor === curChoice);
      if (cell.cellColor === curChoice) {
        cell.highlight(CELLSIZE);
      }
      else {
        cell.draw(CELLSIZE);
      }
    }

    for(let cell of drawn){
      cell.draw(CELLSIZE);
    }
  }
}

function fillOut() {
  if (mouseY > ROWS * CELLSIZE - 1) {
    return;
  }

  if (mouseX < 0 || mouseX > COLS * CELLSIZE - 1) {
    return;
  }

  let x = floor(mouseX / CELLSIZE);
  let y = floor(mouseY / CELLSIZE);
  let cellIndex = picture.indexOf(picture.find(o => o.x == x && o.y == y));

  let cell = picture[cellIndex];

  if (!cell) { return; }

  if (!cell.filled) {
    if (cell.cellColor === curChoice) {
      cell.filled = true;
      cell.count = count++;
      cell.draw(CELLSIZE);
      drawn.push(picture.splice(cellIndex, 1)[0]);
    }
    else {
      cell.currentColor = curChoice.color;
      cell.draw(CELLSIZE);
    }
  }
}

function checkFinished() {
  if (picture.length == 0) {
    drawn.sort(function (a, b) {
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
