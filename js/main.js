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
var chunkx = 0;
var chunky = 0;
var chunkmap = [];
var protomap = [];
var tempmaprow = [];
var protorow = [];

//Map Gen
function genMap(xlim, ylim) {
	for (k=0; k<ylim; k++) {
		for (l=0; l<xlim; l++) {
			tempmaprow.push(Math.round((Math.random()*3/4)+0.25));
		}
		protomap.push(tempmaprow);
		tempmaprow = [];
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
				protoline = protomap[0];
				protomap = chunkExists(chunkx, chunky);
				protomap.push(protoline);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) == false)) {
				chunky-=1;
				chary=(canvas.height-16);
				protoline = protomap[0];
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16)-1);
				chunkmap.push([chunkx, chunky, protomap]);
				protomap.push(protoline);
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
			else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) != false)) {
				chunkx-=1;
				charx=(canvas.width-15);
				protoline = [];
				for (var h = 0; h < protomap.length; h++) {
					protoline.push(protomap[h][0]);
				}
				protomap = chunkExists(chunkx, chunky);
				for (var g = 0; g < protomap; g++) {
					protomap[g].push(protoline[g]);
				}
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) == false)) {
				chunkx-=1;
				charx=(canvas.width-15);
				protoline = [];
				for (var f = 0; f < protomap.length; f++) {
					protoline.push(protomap[f][0]);
				}
				protomap = [];
				genMap(Math.floor(canvas.width/16)-1, Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				for (var e = 0; e < protomap; e++) {
					protomap[e].push(protoline[e]);
				}
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
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
				protoline = protomap[protomap.length-1];
				protomap = chunkExists(chunkx, chunky);
				protomap.splice(0, 0, protoline);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) == false)) {
				chunky+=1;
				chary=0;
				protoline = protomap[protomap.length-1];
				protomap = [];
				genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16)-1);
				chunkmap.push([chunkx, chunky, protomap]);
				protomap.splice(0, 0, protoline);
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
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
				protoline = [];
				for (var d = 0; d < protomap.length; d++) {
					protoline.push(protomap[d][protomap[d].length-1]);
				}
				protomap = chunkExists(chunkx, chunky);
				for (var c = 0; c < protomap; c++) {
					protomap[c].splice(0, 0, protoline[c]);
				}
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) == false)) {
				chunkx+=1;
				charx=1;
				protoline = [];
				for (var b = 0; b < protomap.length; b++) {
					protoline.push(protomap[b][protomap[b].length-1]);
				}
				protomap = [];
				genMap(Math.floor(canvas.width/16)-1, Math.floor(canvas.height/16));
				chunkmap.push([chunkx, chunky, protomap]);
				for (var a = 0; a < protomap; a++) {
					protomap[a].splice(0, 0, protoline[a]);
				}
				drawMap(protomap);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
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
function chunkExists(x, y) {
	for (var i = 0; i < chunkmap.length; i++) {
		if ((chunkmap[i][0] == x) && (chunkmap[i][1] == y)) {
			return chunkmap[i][2];
		}
	}
	return false;
}