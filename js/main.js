//Canvassy stuff
var canvas = document.getElementById("canvas");
canvas.width = Math.floor((window.innerWidth-40)/16)*16;
canvas.height = Math.floor((window.innerHeight-40)/16)*16;
var ctx = canvas.getContext("2d");
var char = document.getElementById("char");
var charx = 1.0;
var chary = 0.0;

//WIP Map Gen
var map = [];
var tempmaprow = [];
for (i=0; i<Math.floor(canvas.height/16); i++) {
	for (j=0; j<Math.floor(canvas.width/16); j++) {
		tempmaprow.push(Math.round((Math.random()*3/4)+0.25));
	}
	map.push(tempmaprow);
	tempmaprow = [];
}
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
//Keyboardy stuff
function keys(event) {
	switch (event.keyCode) {
		case 87: //W
			if (chary > 0) {
				chary-=16;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 65: //A
			if (charx > 16) {
				charx-=16;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 83: //S
			if (chary+16 < canvas.height) {
				chary+=16;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 68: //D
			if (charx+30 < canvas.width) {
				charx+=16;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
	}
}
window.addEventListener('keydown', keys, false);