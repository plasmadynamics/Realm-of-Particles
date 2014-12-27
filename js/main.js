//Canvassy stuff
var canvas = document.getElementById("canvas");
canvas.width = Math.floor((window.innerWidth-40)/16)*16;
canvas.height = Math.floor((window.innerHeight-40)/16)*16;
var ctx = canvas.getContext("2d");
var char = document.getElementById("char");
var rock = document.getElementById("rock");
var grass = document.getElementById("grass");
var charx = 1.0;
var chary = 0.0;

//Map Gen
var protomap = [];
var tempmaprow = [];
for (i=0; i<Math.floor(canvas.height/16); i++) {
	for (j=0; j<Math.floor(canvas.width/16); j++) {
		tempmaprow.push(Math.round((Math.random()*3/4)+0.25));
	}
	protomap.push(tempmaprow);
	tempmaprow = [];
}
ctx.fillStyle = '#FFFFFF';
drawMap(protomap);
ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
//Keyboardy stuff
function keys(event) {
	switch (event.keyCode) {
		case 87: //W
			if ((chary > 0) && (protomap[(chary-16)/16][(charx-1)/16] == 1)) {
				chary-=16;
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 65: //A
			if ((charx > 16) && (protomap[chary/16][(charx-17)/16] == 1)) {
				charx-=16;
				drawMap(protomap);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 83: //S
			if ((chary+16 < canvas.height) && (protomap[(chary+16)/16][(charx-1)/16] == 1)) {
				chary+=16;
				drawMap(protomap);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 68: //D
			if ((charx+30 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 1)) {
				charx+=16;
				drawMap(protomap);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
	}
}
window.addEventListener('keydown', keys, false);

//Map drawing
function drawMap(map) {
	for (var i=0; i<map.length; i++) {
		for (var j=0; j<map[i].length; j++) {
			if (map[i][j] == 0) {
				ctx.drawImage(rock, 0, 0, 16, 16, j*16, i*16, 16, 16);
			}
			if (map[i][j] == 1) {
				ctx.drawImage(grass, 0, 0, 16, 16, j*16, i*16, 16, 16);
			}
		}
	}
}