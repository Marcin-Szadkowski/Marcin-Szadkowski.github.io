var photoHeight = getHeight();
var photoIdx = [5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17];

var context = document.getElementById("puzzle").getContext("2d");
context.canvas.width = photoHeight;
context.canvas.height = photoHeight;

var img = new Image();
img.src = createPath(0);
img.addEventListener("load", drawTiles, false);
var boardSize = document.getElementById("puzzle").width;
var tileCount = document.getElementById("scale").value;
var tileSize = boardSize / tileCount;
var clickLoc = new Object();
clickLoc.x = 0;
clickLoc.y = 0;
var emptyLoc = new Object();
emptyLoc.x = 0;
emptyLoc.y = 0;
var solved = false;
var boardParts;

var left = new Object();
left.x = 0;
left.y = 0;

var right = new Object();
right.x = 1;
right.y = 0;

var bottom = new Object();
bottom.x = 0;
bottom.y = 1;

var top = new Object();
top.x = 0;
top.y = 0;

draw(photoHeight);

function getHeight() {
  var ratioH = 0.8;
  var ratioW = 0.9;
  return Math.min(
    Math.ceil(((window.innerWidth * ratioW) / 2) * 2),
    Math.ceil(((window.innerHeight * ratioH) / 2) * 2)
  );
}

function draw(width) {
  photoHeight = width;
  context = document.getElementById("puzzle").getContext("2d");
  context.canvas.width = photoHeight;
  context.canvas.height = photoHeight;
  //console.log(window.innerWidth);
  boardSize = document.getElementById("puzzle").width;
  tileCount = document.getElementById("scale").value;
  tileSize = boardSize / tileCount;
  clickLoc.x = 0;
  clickLoc.y = 0;
  emptyLoc.x = 0;
  emptyLoc.y = 0;
  solved = false;
  boardParts;
  setBoard();
}

function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = new Object();
      boardParts[i][j].x = tileCount - 1 - i;
      boardParts[i][j].y = tileCount - 1 - j;
    }
  }
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;

  solved = false;
}

//report the mouse position on click - mousemove
context.canvas.addEventListener(
  "mousemove",
  function (evt) {
    //UPDATE CURRENT LOCATION OF NEIGHBOURS

    var mousePos = getMousePos(context.canvas, evt);

    if (
      mousePos.x < top.x * tileSize + tileSize &&
      mousePos.x > top.x * tileSize &&
      mousePos.y < top.y * tileSize + tileSize &&
      mousePos.y > top.y * tileSize &&
      top.x >= 0 &&
      top.y >= 0
    ) {
      context.beginPath();
      context.strokeStyle = "orange";
      context.rect(top.x * tileSize, top.y * tileSize, tileSize, tileSize);
      context.stroke();
      context.closePath();
    } else if (
      mousePos.x < bottom.x * tileSize + tileSize &&
      mousePos.x > bottom.x * tileSize &&
      mousePos.y < bottom.y * tileSize + tileSize &&
      mousePos.y > bottom.y * tileSize &&
      bottom.x >= 0 &&
      bottom.y >= 0
    ) {
      context.beginPath();
      context.strokeStyle = "orange";
      context.rect(
        bottom.x * tileSize,
        bottom.y * tileSize,
        tileSize,
        tileSize
      );
      context.stroke();
      context.closePath();
    } else if (
      mousePos.x < left.x * tileSize + tileSize &&
      mousePos.x > left.x * tileSize &&
      mousePos.y < left.y * tileSize + tileSize &&
      mousePos.y > left.y * tileSize &&
      left.x >= 0 &&
      left.y >= 0
    ) {
      context.beginPath();
      context.strokeStyle = "orange";
      context.rect(left.x * tileSize, left.y * tileSize, tileSize, tileSize);
      context.stroke();
      context.closePath();
    } else if (
      mousePos.x < right.x * tileSize + tileSize &&
      mousePos.x > right.x * tileSize &&
      mousePos.y < right.y * tileSize + tileSize &&
      mousePos.y > right.y * tileSize &&
      right.x >= 0 &&
      right.y >= 0
    ) {
      context.beginPath();
      context.strokeStyle = "orange";
      context.rect(right.x * tileSize, right.y * tileSize, tileSize, tileSize);
      context.stroke();
      context.closePath();
    } else {
      img.width = getHeight();
      img.height = getHeight();

      for (var i = 0; i < tileCount; ++i) {
        for (var j = 0; j < tileCount; ++j) {
          var x = boardParts[i][j].x;
          var y = boardParts[i][j].y;

          if (i != top.x || j != top.y || solved == true) {
            context.beginPath();
            context.strokeStyle = "black";
            context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  },
  true
);

//Get Mouse Position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;

    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;

    //console.log(toLoc.x+"  "+toLoc.y)
    checkSolved();
  }
}

function createPath(idx) {
  return (
    `https://picsum.photos/id/` +
    photoIdx[idx].toString() +
    `/${photoHeight}/${photoHeight}`
  );
}

document.getElementById("scale").onchange = function () {
  tileCount = this.value;
  tileSize = boardSize / tileCount;
  setBoard();
  drawTiles();
};

document.getElementById("img").onclick = function () {
  restart(createPath(0));
};

document.getElementById("img2").onclick = function () {
  restart(createPath(1));
};

document.getElementById("img3").onclick = function () {
  restart(createPath(2));
};

document.getElementById("img4").onclick = function () {
  restart(createPath(3));
};

document.getElementById("img5").onclick = function () {
  restart(createPath(4));
};
document.getElementById("img6").onclick = function () {
  restart(createPath(5));
};

document.getElementById("img7").onclick = function () {
  restart(createPath(6));
};

document.getElementById("img8").onclick = function () {
  restart(createPath(7));
};

document.getElementById("img9").onclick = function () {
  restart(createPath(8));
};

document.getElementById("img10").onclick = function () {
  restart(createPath(9));
};

document.getElementById("img11").onclick = function () {
  restart(createPath(10));
};
document.getElementById("img12").onclick = function () {
  restart(createPath(11));
};

document.getElementById("puzzle").onclick = function (e) {
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);

  generateNeighbours(clickLoc);
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if (solved) {
    setTimeout(function () {
      alert("You solved it!");
      restart(createPath(0));
    }, 500);
  }
};

function generateNeighbours(clickLocation) {
  context.strokeStyle = "black";
  context.rect(top.x * tileSize, top.y * tileSize, tileSize, tileSize);
  context.stroke();

  redX = clickLocation.x;
  redY = clickLocation.y;

  left.x = clickLocation.x - 1;
  left.y = clickLocation.y;

  right.x = clickLocation.x + 1;
  right.y = clickLocation.y;

  top.x = clickLocation.x;
  top.y = clickLocation.y - 1;

  bottom.x = clickLocation.x;
  bottom.y = clickLocation.y + 1;
}

function drawTiles() {
  tileSize = boardSize / tileCount;
  context.clearRect(0, 0, boardSize, boardSize);
  context.fillStyle = "#FF0000";
  context.fillRect(0, 0, boardSize, boardSize);

  img.width = getHeight();
  img.height = getHeight();
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;

      context.beginPath();
      context.strokeStyle = "black";
      context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      context.stroke();
      context.closePath();

      if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(
          img,
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize,
          i * tileSize,
          j * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

function scalePreserveAspectRatio(imgW, imgH, maxW, maxH) {
  return Math.min(maxW / imgW, maxH / imgH);
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; ++i) {
    for (var j = 0; j < tileCount; ++j) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}

function restartTheSame() {
  tileSize = boardSize / tileCount;
  clickLoc.x = 0;
  clickLoc.y = 0;
  emptyLoc.x = 0;
  emptyLoc.y = 0;
  solved = false;
  tileCount = 4;
  tileSize = boardSize / tileCount;
  setBoard();
  drawTiles();
}

function restartWithRandomImage() {
  var randomInt = getRandomInt(0, photoIdx.length - 1);

  restart(createPath(randomInt));
}

function restart(path) {
  loadImage(path)
    .then(() => {
      console.log("end");
      setBoard();
      drawTiles();
    })
    .catch((error) => console.error(error));

  clickLoc.x = 0;
  clickLoc.y = 0;
  emptyLoc.x = 0;
  emptyLoc.y = 0;
  solved = false;
  tileCount = 4;
  tileSize = boardSize / tileCount;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    img.addEventListener("load", (e) => resolve(img));
    img.addEventListener("error", () => {
      reject(new Error(`Failed to load image's URL: ${url}`));
    });
    console.log("loading");
    img.src = url;
  });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
