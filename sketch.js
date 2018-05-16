let CELLSIZE = 32;
let COLS = 16;
let ROWS = 16;

let picture = [];
let choice = []
let curChoice;
let displayP;

function setup() {

  frameRate(2);
  createCanvas(COLS * CELLSIZE + 1, ROWS * CELLSIZE + 100);

  //Create CellColors
  let cColors = [];
  for (let i = 0; i < 16; i++) {
    choice.push(new CellColor(color(random(255), random(255), random(255)), i + 1, i, 1));
  }

  //2D Array + Population
  for (let i = 0; i < COLS; i++) {
    picture[i] = [];
    for (let j = 0; j < ROWS; j++) {
      picture[i][j] = new Cell(i, j, choice[floor(random(choice.length))]);
      picture[i][j].draw(CELLSIZE);
    }
  }

  for (let c of choice) {
    c.draw(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
  }

  choice[1].highlight(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
  curChoice = choice[1];
}

function draw() {

}

function mousePressed() {

  let oldChoice = curChoice;
  console.log(mouseX + " " + mouseY);
  if (mouseY > ROWS * (CELLSIZE - 1) && mouseY < ROWS * (CELLSIZE - 1) + 10 + CELLSIZE) {
    //New Color Picker

    console.log("New color");
    curChoice = choice[floor(mouseX / CELLSIZE)];

    for (let c of choice) {
      c.draw(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);
    }
    curChoice.highlight(CELLSIZE, 0, CELLSIZE * (ROWS - 1) + 10);

  }


  if (curChoice != oldChoice) {
    for (let column of picture) {
      for (let cell of column) {
        //console.log(cell.CellColor === curChoice);
        if (cell.cellColor === curChoice) {
          cell.highlight(CELLSIZE);
        }
        else {
          cell.draw(CELLSIZE);
        }
      }
    }
  }
}

function mouseMoved() {
  if (mouseY > ROWS * CELLSIZE) {
    return;
  }

  let x = floor(mouseX / CELLSIZE);
  let y = floor(mouseY / CELLSIZE);

  let cell = picture[x][y];

  if(cell.cellColor === curChoice && !cell.filled){
    cell.filled = true;
    cell.draw(CELLSIZE);
  }
}