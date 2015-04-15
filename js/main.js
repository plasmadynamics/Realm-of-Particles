//Canvas initialisation
var canvas = document.getElementById("canvas");
canvas.width = Math.floor((window.innerWidth-80)/16)*16;
canvas.height = Math.floor((window.innerHeight-80)/16)*16;
var ctx = canvas.getContext("2d");
var loop = 0;
//Getting images
var char = document.getElementById("char");
var rock = document.getElementById("rock");
var grass = document.getElementById("grass");
var bad = document.getElementById("bad");
//Character positions
var charx = 1.0;
var chary = 0.0;
//Chunk and world gen variables
var chunkx = 0;
var chunky = 0;
var chunkmap = [];
var protomap = [];
var tempmaprow = [];
var maprand = 0;
var badcounter = 0;
var monsters = [];
var mapindex = 0;
//Keyboard
var wpress = false;
var apress = false;
var spress = false;
var dpress = false;

//Map Gen
function genMap(xlim, ylim) {
	monsters = [];
	for (k=0; k<ylim; k++) {
		for (l=0; l<xlim; l++) {
			maprand = Math.random();
			if (maprand <= 0.75) {
				tempmaprow.push(1);
			}
			if (maprand > 0.75 && maprand <= 1 - 2/495) {
				tempmaprow.push(0);
			}
			if (maprand > 1 - 2/495 && maprand <= 1) {
				tempmaprow.push(2);
				monsters.push([k, l]);
			}
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
ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
//End display
function dispEnd() {
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Game loop
function tick() {
	drawMap(protomap);
	ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
	if (Key.isDown(Key.W) && !wpress) {
		wpress = true;
		if ((chary > 0) && (protomap[(chary-16)/16][(charx-1)/16] == 1)) {
			chary-=16;
		}
		else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky-=1;
			chary=(canvas.height-16);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunky+=1;
				chary=0;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) == false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky-=1;
			chary=(canvas.height-16);
			protomap = [];
			genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunky+=1;
				chary=0;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
	}
	if (!Key.isDown(Key.W)) {
		wpress = false;
	}
	if (Key.isDown(Key.A) && !apress) {
		apress = true;
		if ((charx > 16) && (protomap[chary/16][(charx-17)/16] == 1)) {
			charx-=16;
		}
		else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx-=1;
			charx=(canvas.width-15);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunkx+=1;
				charx=1;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) == false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx-=1;
			charx=(canvas.width-15);
			protomap = [];
			genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunkx+=1;
				charx=1;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
	}
	if (!Key.isDown(Key.A)) {
		apress = false;
	}
	if (Key.isDown(Key.S) && !spress) {
		spress = true;
		if ((chary+16 < canvas.height) && (protomap[(chary+16)/16][(charx-1)/16] == 1)) {
			chary+=16;
		}
		else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky+=1;
			chary=0;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunky-=1;
				chary=(canvas.height-16);
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) == false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky+=1;
			chary=0;
			protomap = [];
			genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunky-=1;
				chary=(canvas.height-16);
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
	}
	if (!Key.isDown(Key.S)) {
		spress = false;
	}
	if (Key.isDown(Key.D) && !dpress) {
		dpress = true;
		if ((charx+1 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 1)) {
			charx+=16;
		}
		else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx+=1;
			charx=1;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunkx-=1;
				charx=(canvas.width-15);
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) == false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx+=1;
			charx=1;
			protomap = [];
			genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			if (protomap[chary/16][(charx-1)/16] == 0) {
				chunkmap[mapindex] = [];
				chunkx-=1;
				charx=(canvas.width-15);
				chunkmap[mapindex] = [];
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
	}
	if (!Key.isDown(Key.D)) {
		dpress = false;
	}
	if (Key.isDown(Key.ESC)) {
		dispEnd();
		clearInterval(loop);
	}
	if (badcounter >= 30) {
		monsters.forEach(function(item){
			dirs = [];
			if (item[0]+1 < protomap.length) {
				if (protomap[item[0]+1][item[1]] == 1 && item[0]+1 != chary/16) {
					dirs.push('d');
				}
			}
			if (item[0]-1 >= 0) {
				if (protomap[item[0]-1][item[1]] == 1 && item[0]-1 != chary/16) {
					dirs.push('u');
				}
			}
			if (item[1]-1 >= 0) {
				if (protomap[item[0]][item[1]-1] == 1 && item[1]-1 != (charx-1)/16) {
					dirs.push('l');
				}
			}
			if (item[1]+1 < protomap[0].length) {
				if (protomap[item[0]][item[1]+1] == 1 && item[1]+1 != (charx-1)/16) {
					dirs.push('r');
				}
			}
			dirnum = Math.random()*(dirs.length-1);
			dir = dirs[Math.round(dirnum)];
			if (dir=='d') {
				protomap[item[0]][item[1]] = 1;
				protomap[item[0]+1][item[1]] = 2;
			}
			else if (dir=='u') {
				protomap[item[0]][item[1]] = 1;
				protomap[item[0]-1][item[1]] = 2;
			}
			else if (dir=='l') {
				protomap[item[0]][item[1]] = 1;
				protomap[item[0]][item[1]-1] = 2;
			}
			else if (dir=='r') {
				protomap[item[0]][item[1]] = 1;
				protomap[item[0]][item[1]+1] = 2;
			}
		});
		badcounter = 0;
	}
	else if (badcounter < 30) {
		badcounter++;
	}
	monsters=[];
	for (monproa = 0; monproa < protomap.length; monproa++) {
		for (monprob = 0; monprob < protomap[monproa].length; monprob++) {
			if (protomap[monproa][monprob] == 2) {
				monsters.push([monproa, monprob]);
			}
		}
	}
	drawMap(protomap);
	ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
}
var Key = {
_pressed: {},	
   	A: 65,
	W: 87,
    D: 68,
    S: 83,
    SPACE: 32,
	ESC: 27,
    
    isDown: function(keyCode) {
		return this._pressed[keyCode];
    },
  
    onKeydown: function(keyevent) {
      this._pressed[keyevent.keyCode] = true;
    },
  
    onKeyup: function(keyevent) {
      delete this._pressed[keyevent.keyCode];
    }
};
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

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
			if (map[i][j] == 2) {
				ctx.drawImage(bad, 0, 0, 16, 16, j*16, i*16, 16, 16);
			}
		}
	}
}

//Chunk detection
function chunkExists(x, y) {
	for (var i = 0; i < chunkmap.length; i++) {
		if ((chunkmap[i][0] == x) && (chunkmap[i][1] == y)) {
			return chunkmap[i];
		}
	}
	return false;
}
loop = setInterval(tick, 50/3);