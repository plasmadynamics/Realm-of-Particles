//Canvas initialisation
var canvas = document.getElementById("canvas");
canvas.width = Math.floor((window.innerWidth-80)/16)*16;
canvas.height = Math.floor((window.innerHeight-80)/16)*16;
var ctx = canvas.getContext("2d");
//Getting images
var char = document.getElementById("char");
var rock = document.getElementById("rock");
var grass = document.getElementById("grass");
//Character positions
var charx = 1.0;
var chary = 0.0;
//Chunk and world gen variables
var chunkx = 0;
var chunky = 0;
var chunkmap = [];
var protomap = [];
var tempmaprow = [];

//Map Gen
function genMap(xlim, ylim) {
	for (k=0; k<ylim; k++) {
		for (l=0; l<xlim; l++) {
			tempmaprow.push(Math.round((Math.random()*3/4)+0.25));
		}
		protomap.push(tempmaprow);
		tempmaprow = [];
	}
	if ((chunkx==0) && (chunky==0)){
		protomap[0][0]=1;
	}
}
genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
chunkmap.push([chunkx, chunky, protomap]);
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
			else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) != false)) {
				chunky-=1;
				chary=(canvas.height-16);
				protomap = chunkExists(chunkx, chunky);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunky+=1;
					chary=0;
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) == false)) {
				chunky-=1;
				chary=(canvas.height-16);
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunky+=1;
					chary=0;
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
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
			else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) != false)) {
				chunkx-=1;
				charx=(canvas.width-15);
				protomap = chunkExists(chunkx, chunky);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunkx+=1;
					charx=1;
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) == false)) {
				chunkx-=1;
				charx=(canvas.width-15);
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunkx+=1;
					charx=1;
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
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
			else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) != false)) {
				chunky+=1;
				chary=0;
				protomap = chunkExists(chunkx, chunky);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunky-=1;
					chary=(canvas.height-16);
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) == false)) {
				chunky+=1;
				chary=0;
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunky-=1;
					chary=(canvas.height-16);
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			break;
		case 68: //D
			if ((charx+1 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 1)) {
				charx+=16;
				drawMap(protomap);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) != false)) {
				chunkx+=1;
				charx=1;
				protomap = chunkExists(chunkx, chunky);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunkx-=1;
					charx=(canvas.width-15);
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) == false)) {
				chunkx+=1;
				charx=1;
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				if (protomap[chary/16][(charx-1)/16] == 0) {
					chunkx-=1;
					charx=(canvas.width-15);
					protomap = chunkExists(chunkx, chunky);
					drawMap(protomap);
					ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				}
				break;
			}
			break;
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

//Chunk detection
function chunkExists(x, y) {
	for (var i = 0; i < chunkmap.length; i++) {
		if ((chunkmap[i][0] == x) && (chunkmap[i][1] == y)) {
			return chunkmap[i][2];
		}
	}
	return false;
}