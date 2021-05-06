const PUZZLE_DIFFICULTY = 3;
const PUZZLE_HOVER_TINT = '#009900';
 
var _canvas;
var _stage;
 
var _img;
var _imgSrc;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
var _redPiece;
var _difficulty;
 
var _mouse;

var _images = ["gal1.jpg", "gal2.jpg", "gal3.jpg", "gal4.jpg", "gal5.jpg", "gal6.jpg", "gal7.jpg", "gal8.jpg", "gal9.jpg", "gal10.jpg", "gal11.jpg", "gal12.jpg"];

const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });

function loadGallery(){
    var galleryDiv = document.getElementById("gallery-div");
    var i;
    for(i=0;i<_images.length;i++){
        let photoDiv = document.createElement('div');
        photoDiv.classList.add('project__photo');
        photoDiv.classList.add('swiper-slide');

        let imageUrl = "assets/img/".concat(_images[i]);
        loadImage(imageUrl).then(img => {
            img.classList.add('project__img');
            img.addEventListener("click", function(){ imageSelected(imageUrl); });
            photoDiv.appendChild(img);
        }).catch(err => console.error(err));
        galleryDiv.appendChild(photoDiv);
    }
}

function imageSelected(imageUrl) {
    _imgSrc = imageUrl;
    document.getElementById('number-input').focus();
}

function init(){
    if(_imgSrc != null) {
        _difficulty = document.getElementById('number-input').value;
        if(_difficulty == ""){
            _difficulty = PUZZLE_DIFFICULTY;
        }
        _img = new Image();
        _img.addEventListener('load',onImage,false);
        _img.src = _imgSrc;
    }
}

function onImage(e){
    _pieceWidth = Math.floor(_img.width / _difficulty)
    _pieceHeight = Math.floor(_img.height / _difficulty)
    _puzzleWidth = _pieceWidth * _difficulty;
    _puzzleHeight = _pieceHeight * _difficulty;
    setCanvas();
    initPuzzle();
}

function setCanvas(){
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "1px solid black";
    //document.onmouseover = onPieceOver
}

function initPuzzle(){
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Click to Start Puzzle");
    buildPieces();
}

function createTitle(msg){
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
}

function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _difficulty * _difficulty;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
        // piece.addEventListener('mouseenter', function () {
        //     this.set('background', 'blue');
        //   });
          
        // piece.addEventListener('mouseleave', function () {
        //     this.set('background', 'red');
        // });
    }
    document.onmousedown = shufflePuzzle;
}

function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        piece.hover = false; // onMouseOver
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
        console.log(`PiecePos----- x: ${piece.xPos} y: ${piece.yPos}`);
    }
    _redPiece = _pieces[0];
    _stage.fillStyle = "#FF0000";   //Kolor wypelnienia
    _stage.fillRect(_redPiece.xPos, _redPiece.yPos, _pieceWidth, _pieceHeight);  //Lewy gorny jest czerwony
    document.onmousedown = onPuzzleClick;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){
        console.log(`Layer----- x: ${e.layerX} y: ${e.layerY}`);
        _mouse.x = e.layerX //- _canvas.offsetLeft;
        _mouse.y = e.layerY //- _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        console.log(`Offset----- x: ${e.offsetX} y: ${e.offsetY}`);
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        if(_currentPiece == _redPiece) {
            _stage.fillRect(_redPiece.sx, _redPiece.sy, _pieceWidth, _pieceHeight);  //Lewy gorny jest czerwony
        }
        else {
            _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        }
        _stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}

function checkPieceClicked(){
    var i;
    var piece;
    console.log(`Mouse----- x: ${_mouse.x} y: ${_mouse.y}`);
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT          
        }
        else{
            if(piece != _redPiece && isRedNeighbour(piece)) {
                return piece;
            }
        }
    }
    console.log("Not hit");
    return null;
}

function isRedNeighbour(piece){
    var cords = [[0, -_pieceWidth], [0, _pieceWidth],
                [_pieceHeight, 0], [-_pieceHeight, 0]];
    var i;
    
    for(i = 0; i < cords.length;i++){
        if(piece.xPos - cords[i][1] == _redPiece.xPos && piece.yPos - cords[i][0] == _redPiece.yPos){
            return true;
        }
    }
    return false;
}

function updatePuzzle(e){
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX //- _canvas.offsetLeft;
        _mouse.y = e.layerY //- _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(piece == _currentPiece){
            continue;
        }
        if(piece.sx == _redPiece.sx && piece.sy == _redPiece.sy) {
            _stage.fillRect(_redPiece.xPos, _redPiece.yPos, _pieceWidth, _pieceHeight);  //Lewy gorny jest czerwony
        }
        else {
            _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        }
        
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(_currentDropPiece == null){
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER
            }
            else{
                //We can drop only on red piece
                if(piece.sx == _redPiece.sx && piece.sy == _redPiece.sy) {
                    _currentDropPiece = piece;
                    _stage.save();
                    _stage.globalAlpha = .4;
                    _stage.fillStyle = PUZZLE_HOVER_TINT;
                    //_stage.fillStyle = "#FF0000";   //Kolor wypelnienia
                    _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                    _stage.restore();
                }
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function pieceDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
        //update red
        _redPiece = _currentDropPiece;
    }
    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(piece == _redPiece) {
            _stage.fillStyle = "#FF0000";   //Kolor wypelnienia
            _stage.fillRect(_redPiece.xPos, _redPiece.yPos, _pieceWidth, _pieceHeight);  //Lewy gorny jest czerwony
        }
        else {
            _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        }
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(gameOver,500);
    }
}

function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}

function onPieceOver(e) {

    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            if(piece != _redPiece) {
                //do hover
                _stage.globalAlpha = .9;
                _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }

}
/*===== SWIPER CAROUSEL =====*/ 
const mySwiper = new Swiper('.hobby__container', {
    spaceBetween: 16,
    loop: true,
    grabCursor: true,

  
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints:{
        640:{
            slidesPerView: 2,
        },
        1024:{
            slidesPerView: 3,
        }
    }
});