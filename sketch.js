const SPRITESIZE = 32;
let sheet;

let tools;
let game;

let moveOrigin;
let cas;

let logo;

//Control Game
const hold_toggle_timer = 0.3;

let hold_toggle = 0;
let move = false;

function preload() {
  sheet = loadImage("assets/cute_bug_1.png");
  logo = loadImage("assets/logo.png");
  bg = loadImage("assets/bg.png");
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
    let colorIndex = tmpCellColors.indexOf(
      tmpCellColors.find((c) => c.color.toString() == pixelColor.toString())
    );

    if (colorIndex == -1) {
      tmpCellColors.push(new CellColor(pixelColor, (count += 1)));
      tmpCells.push(new Cell(x, y, tmpCellColors[tmpCellColors.length - 1]));
    } else {
      tmpCells.push(new Cell(x, y, tmpCellColors[colorIndex]));
    }

    x++;
    if (x == tmpImage.width) {
      x = 0;
      y++;
    }
  }

  colors = tmpCellColors;
  return tmpCells;
}

function windowResize() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  let rows = sheet.width / SPRITESIZE;
  let cols = sheet.height / SPRITESIZE;
  let col = floor(random(0, cols));
  let row = floor(random(0, rows));

  //Get Random image from SpriteSheet
  let img = sheet.get(
    col * SPRITESIZE,
    row * SPRITESIZE,
    SPRITESIZE,
    SPRITESIZE
  );

  //Create the Canvas
  cas = createCanvas(windowWidth, windowHeight);
  // cas.style("z-index", 1);
  //Initate game and tools
  game = new Game(pre_populate(img), img.height, img.width);
  tools = new ToolBox(64);
  createToolbox();

  //Draw the game
  drawIt(true, true);

  frameRate(60);
}

function draw() {
  // image(bg, 0, 0, windowHeight, windowHeight);
  // background(175);

  if (mouseIsPressed) {
    hold_toggle++;
  }

  if (hold_toggle / frameRate() >= hold_toggle_timer && !move) {
    move = true;
    window.navigator.vibrate(200);
    moveOrigin = createVector(mouseX, mouseY);
    // console.log("move");
  }

  if (move) {
    game.move(mouseX - moveOrigin.x, mouseY - moveOrigin.y);
    moveOrigin = createVector(mouseX, mouseY);
    drawIt(true, true);
  }
  image(logo, 1200, 20, 600, 400);
  // noLoop();
  switch (game.sceneNum) {
    case 0:
      break;
    case 1:
      createCanvas(windowWidth, windowHeight);
      image(logo, 1200, 20, 600, 400);

      break;
  }
}

function mouseReleased() {
  hold_toggle = 0;
  move = false;
}

function mouseDragged() {
  hold_toggle = 0;
  let gameArea = min(height, width);
  if (mouseY > gameArea || mouseX > gameArea) {
    //Do not draw
    return;
  } else {
    //Execute Game action

    let ac = "";
    if (move) {
      ac = "move";
    } else {
      ac = "drawCell";
    }
    game.action(mouseX, mouseY, ac);
  }

  //prevent default
  return false;
}
function mouseClicked() {
  // console.log(game.count1);
}

function mousePressed() {
  let gameArea = min(height, width);

  if (mouseY > gameArea || mouseX > gameArea) {
    //Do not draw
    tools.findAndExecute(mouseX, mouseY);
  } else {
    mouseDragged();
  }

  //prevent default
  return false;
}

function drawIt(drawG, drawT) {
  let gameArea = min(width, height);
  let horiz = height > width;

  if (drawG) {
    game.draw(gameArea);
  }

  if (drawT) {
    tools.draw(horiz ? 0 : gameArea, horiz ? gameArea : 0, horiz);
  }
}

function createToolbox() {
  let tG = new ToolGroup("tools");

  //---------
  let black = createGraphics(tools.iconSize, tools.iconSize);
  black.background(0);
  //---------

  tG.addTools(
    new Tool(loadImage("assets/magGlassesPlus.png"), function () {
      if (game.cellSize < min(height, width)) {
        //background(255);
        game.cellSize++;
        drawIt(true, true);
      }
    })
  );

  tG.addTools(
    new Tool(loadImage("assets/magGlassesMin.png"), function () {
      if (game.cellSize > 1) {
        //background(255);
        game.cellSize--;
        drawIt(true, true);
      }
    })
  );

  // tG.addTools(
  //   new Tool(black, function () {
  //     console.log("Place Moving Func here");
  //     drawIt(true, true);
  //   })
  // );

  let cS = new ToolGroup("colors");

  for (let c of colors) {
    let graph = createGraphics(tools.iconSize, tools.iconSize);
    graph.fill(c.color);
    graph.strokeWeight(1);
    graph.ellipseMode(CORNERS);
    graph.ellipse(0, 0, tools.iconSize);

    graph.strokeWeight(3);
    graph.fill(255);
    graph.stroke(0);
    graph.textAlign(CENTER, CENTER);
    graph.textSize(tools.iconSize / 1.5);
    graph.text(c.text, tools.iconSize / 2, tools.iconSize / 2);
    cS.addTools(
      new Tool(
        graph,
        function (color) {
          game.changeColor(color);
          drawIt(true, false);
        },
        c
      )
    );
  }

  tools.addGroup(tG);
  tools.addGroup(cS);
}
