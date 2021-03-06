//  Kintamieji ir prieiga prie canvas »
const canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), width = canvas.width, height = canvas.height;
const blockSize = 15, widthInBlocks = width / blockSize ,heightInBlocks = height / blockSize;
// klavisu kodai
const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "left",
    68: "right",
    83: "down",
    87: "up"
};
// sienos
 const drawCage = function () {
	 ctx.fillStyle = "RED";
	 ctx.fillRect(0, 0, width, blockSize);
	 ctx.fillRect(0, height - blockSize, width, blockSize);
	 ctx.fillRect(0, 0, blockSize, height);
	 ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// gameover funkcija
const gameOver = function () {
	 clearInterval(intervalId);
	 ctx.font = "60px Times New Roman";
	 ctx.fillStyle = "Black";
	 ctx.textAlign = "center";
	 ctx.textBaseline = "middle";
	 ctx.fillText("GameOver", width / 2, height / 2);
};
// bloko konstruktorius
 const Block = function (col, row) {
 this.col = col;
 this.row = row;
};
// piesiame kvadrata taske
Block.prototype.drawSquare = function (color) {
	 const x = this.col * blockSize;
	 const y = this.row * blockSize;
	 ctx.fillStyle = color;
	 ctx.fillRect(x, y, blockSize, blockSize);
};

// patikrinam ar sis taskas toje pacioje pozicijoje kaip ir otherBlock
Block.prototype.equal = function (otherBlock) {
 return this.col === otherBlock.col && this.row === otherBlock.row;
};
// gyvates konstruktorius
const Snake = function () {
	 this.segments = [
	 new Block(7, 5),
	 new Block(6, 5),
	 new Block(5, 5)
	 ];
	 this.direction = "right";
	 this.nextDirection = "right";
};
// piesiame gyvate
Snake.prototype.draw = function () {
 for (let i = 0; i < this.segments.length; i++) {
     this.segments[i].drawSquare("GREEN");
 }
};
// sukuriame nauja galva ir pridedame ja prie gyvates  pradzios kad gyvate pajudetu sekancia kryptimi
Snake.prototype.move = function () {
 const head = this.segments[0];
 let newHead;
 this.direction = this.nextDirection;
 if (this.direction === "right") {
	 newHead = new Block(head.col + 1, head.row);
	 } else if (this.direction === "down") {
	 newHead = new Block(head.col, head.row + 1);
	 } else if (this.direction === "left") {
	 newHead = new Block(head.col - 1, head.row);
	 } else if (this.direction === "up") {
	 newHead = new Block(head.col, head.row - 1);
 }
 if (this.checkCollision(newHead)) {
	 gameOver();
	 return;
 }
 this.segments.unshift(newHead);
 if (newHead.equal(food.position)) {
 	food.move();
 } else {
 	this.segments.pop();
 }
};
// Patikriname ar gyvate susidure su siena arba su savimi
Snake.prototype.checkCollision = function (head) {
	 const leftCollision = (head.col === 0);
	 const topCollision = (head.row === 0);
	 const rightCollision = (head.col === widthInBlocks - 1);
	 const bottomCollision = (head.row === heightInBlocks - 1);
	 const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	 let selfCollision = false;
 for (let i = 0; i < this.segments.length; i++) {
 	if (head.equal(this.segments[i])) {
 		selfCollision = true;
 }
 }
 return wallCollision || selfCollision;
};
// užbindiname atitinkamo klavišo paspaudima atitinkama  judejimo krypti
Snake.prototype.setDirection = function (newDirection) {
	 if (this.direction === "up" && newDirection === "down") {
	 return;
	 } else if (this.direction === "right" && newDirection === "left") {
	 return;
	 } else if (this.direction === "down" && newDirection === "up") {
	 return;
	 } else if (this.direction === "left" && newDirection === "right") {
	 return;
 }
 	this.nextDirection = newDirection;
};
// Food konstruktorius
const Food = function () {
 	this.position = new Block(10, 10);
};
// maisto nupiesimas
Food.prototype.draw = function () {
 	this.position.drawSquare("Blue");
};
// randomiai pakeiciam maisto vieta bloke
	Food.prototype.move = function () {
	let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	 this.position = new Block(randomCol, randomRow);
};

// sukuriame gyvates ir maisto objekta
const snake = new Snake(), food = new Food();

// paleidziame animacija
const intervalId = setInterval(function () {
	 ctx.clearRect(0, 0, width, height);
	 snake.move();
	 snake.draw();
	 food.draw();
	 drawCage();
}, 70);

// handler
$('body').keydown(function (event) {
 const newDirection = directions[event.keyCode];
 if (newDirection !== undefined) {
 snake.setDirection(newDirection);
 }
});

$(document).ready(function(){$("input").click(function(){setTimeout(function() {location.reload();}, 1000);});});