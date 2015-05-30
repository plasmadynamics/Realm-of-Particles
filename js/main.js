//Canvas and UI initialisation
var canvas = document.getElementById("canvas");
var hpbox = document.getElementById("hpbox");
var manabox = document.getElementById("manabox");
var killbox = document.getElementById("killbox");
canvas.width = Math.floor((window.innerWidth-80)/16)*16;
canvas.height = Math.floor((window.innerHeight-80)/16)*16;
var ctx = canvas.getContext("2d");
var loop = 0;
//Getting images
var char = document.getElementById("char");
var rock = document.getElementById("rock");
var grass = document.getElementById("grass");
var bad = document.getElementById("bad");
var heart = document.getElementById("heart");
var attack = document.getElementById("attack");
var mana = document.getElementById("mana");
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
//Gameplay
var badcounter = 0;
var monsters = [];
var mapindex = 0;
var tempmonsters = [];
var playerhp = 20;
var playermana = 20;
var playerkills = 0;
//Keyboard
var wpress = false;
var apress = false;
var spress = false;
var dpress = false;
var playerdir = [0, -1];
var attacking = false;

//Map Gen
function genMap(xlim, ylim) {
	protomap = [];
	monsters = [];
	for (k=0; k<ylim; k++) {
		for (l=0; l<xlim; l++) {
			maprand = Math.random();
			if (maprand <= 0.75) {
				tempmaprow.push(1);
			}
			if (maprand > 0.75 && maprand <= 1 - 1/125) {
				tempmaprow.push(0);
			}
			if (maprand > 1 - 1/125 && maprand <= 1 - 1/250) {
				tempmaprow.push(2);
				monsters.push([k, l, 10]);
			}
			if (maprand > 1 - 1/250 && maprand <= 1 - 1/500) {
				tempmaprow.push(3);
			}
			if (maprand > 1 - 1/500 && maprand <= 1) {
				tempmaprow.push(4);
			}
		}
		protomap.push(tempmaprow);
		tempmaprow = [];
	}
	if ((chunkx==0) && (chunky==0)){
		protomap[0][0]=1;
	}
	for (i=0; i<protomap.length; i++) {
		while (protomap[i].length < canvas.width/16) {
			protomap[i].push(1);
		}
	}
}
genMap(Math.floor(canvas.width/16), Math.floor(canvas.height/16));
chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
drawScreen(protomap);
ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
//End display
function dispEnd() {
	clearInterval(loop);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	hpbox.hidden = true;
	manabox.hidden = true;
}
//Game over
function gameOver() {
	clearInterval(loop);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Check monster vision
function monSee(x, y) {
	if ((charx-1)/16 == x) {
		if (y < chary/16) {
			for (tempy = y+1; tempy < chary/16; tempy++) {
				if (protomap[tempy][(charx-1)/16] != 1) {
					return false;
				}
			}
		}
		if (y > chary/16) {
			for (tempy = y-1; tempy > chary/16; tempy--) {
				if (protomap[tempy][(charx-1)/16] != 1) {
					return false;
				}
			}
		}
		return true;
	}
	if (chary/16 == y) {
		if (x < (charx-1)/16) {
			for (tempx = x+1; tempx < (charx-1)/16; tempx++) {
				if (protomap[chary/16][tempx] != 1) {
					return false;
				}
			}
		}
		if (x > (charx-1)/16) {
			for (tempx = x-1; tempx > (charx-1)/16; tempx--) {
				if (protomap[chary/16][tempx] != 1) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}
//Game loop
function tick() {
	if (Key.isDown(Key.W) && !wpress) {
		playerdir = [0, -1];
		wpress = true;
		if (((chary > 0) && (protomap[(chary-16)/16][(charx-1)/16] == 1)) || ((chary > 0) && (protomap[(chary-16)/16][(charx-1)/16] == 3)) || ((chary > 0) && (protomap[(chary-16)/16][(charx-1)/16] == 4))) {
			chary-=16;
		}
		else if (((chary > 0) == false) && (chunkExists(chunkx, chunky-1) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky-=1;
			chary=(canvas.height-16);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
			mapindex = chunkmap.length-1;
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
		playerdir = [-1, 0];
		apress = true;
		if (((charx > 16) && (protomap[chary/16][(charx-17)/16] == 1)) || ((charx > 16) && (protomap[chary/16][(charx-17)/16] == 3)) || ((charx > 16) && (protomap[chary/16][(charx-17)/16] == 4))) {
			charx-=16;
		}
		else if (((charx > 16) == false) && (chunkExists(chunkx-1, chunky) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx-=1;
			charx=(canvas.width-15);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 0)) {
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
			mapindex = chunkmap.length-1;
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
		playerdir = [0, 1];
		spress = true;
		if (((chary+16 < canvas.height) && (protomap[(chary+16)/16][(charx-1)/16] == 1)) || ((chary+16 < canvas.height) && (protomap[(chary+16)/16][(charx-1)/16] == 3)) || ((chary+16 < canvas.height) && (protomap[(chary+16)/16][(charx-1)/16] == 4))) {
			chary+=16;
		}
		else if (((chary + 16 < canvas.height) == false) && (chunkExists(chunkx, chunky+1) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky+=1;
			chary=0;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
			mapindex = chunkmap.length-1;
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
		playerdir = [1, 0];
		dpress = true;
		if (((charx+1 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 1)) || ((charx+1 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 3)) || ((charx+1 < canvas.width) && (protomap[chary/16][(charx+15)/16] == 4))) {
			charx+=16;
		}
		else if (((charx + 30 < canvas.width) == false) && (chunkExists(chunkx+1, chunky) != false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx+=1;
			charx=1;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
			mapindex = chunkmap.length-1;
			if ((protomap[chary/16][(charx-1)/16] == 0) || (protomap[chary/16][(charx-1)/16] == 2)) {
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
	//Monster movement
	if (badcounter >= 30) {
		tempmonsters = [];
		monsters.forEach(function(item) {
			tempmonsters.push(item);
			if (monSee(item[1], item[0])) {
				if (item[0] == chary/16) {
					if (item[1] < (charx-1)/16 && item[1]+1 != (charx-1)/16 && protomap[item[0]][item[1]+1] == 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]][item[1]+1] = 2;
						tempmonsters[tempmonsters.length-1][1]++;
					}
					if (item[1] > (charx-1)/16 && item[1]-1 != (charx-1)/16 && protomap[item[0]][item[1]-1] == 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]][item[1]-1] = 2;
						tempmonsters[tempmonsters.length-1][1]--;
					}
					if (Math.abs(item[1] - (charx-1)/16) == 1) {
						playerhp -= 4;
					}
				}
				else if (item[1] == (charx-1)/16) {
					if (item[0] < chary/16 && item[0]+1 != chary/16 && protomap[item[0]+1][item[1]] == 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]+1][item[1]] = 2;
						tempmonsters[tempmonsters.length-1][0]++;
					}
					if (item[0] > chary/16 && item[0]-1 != chary/16 && protomap[item[0]-1][item[1]] == 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]-1][item[1]] = 2;
						tempmonsters[tempmonsters.length-1][0]--;
					}
					if (Math.abs(item[0] - chary/16) == 1) {
						playerhp -= 4;
					}
				}
			}
			else {
				dirs = [];
				if (item[0]+1 < protomap.length) {
					if (protomap[item[0]+1][item[1]] == 1 && !(item[0]+1 == chary/16 && item[1] == (charx-1)/16)) {
						dirs.push('d');
					}
				}
				if (item[0]-1 >= 0) {
					if (protomap[item[0]-1][item[1]] == 1 && !(item[0]-1 == chary/16 && item[1] == (charx-1)/16)) {
						dirs.push('u');
					}
				}
				if (item[1]-1 >= 0) {
					if (protomap[item[0]][item[1]-1] == 1 && !(item[0] == chary/16 && item[1]-1 == (charx-1)/16)) {
						dirs.push('l');
					}
				}
				if (item[1]+1 < protomap[0].length) {
					if (protomap[item[0]][item[1]+1] == 1 && !(item[0] == chary/16 && item[1]+1 == (charx-1)/16)) {
						dirs.push('r');
					}
				}
				dirnum = Math.random()*(dirs.length-1);
				dir = dirs[Math.round(dirnum)];
				if (dir=='d') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]+1][item[1]] = 2;
					tempmonsters[tempmonsters.length-1][0]++;
				}
				else if (dir=='u') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]-1][item[1]] = 2;
					tempmonsters[tempmonsters.length-1][0]--;
				}
				else if (dir=='l') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]][item[1]-1] = 2;
					tempmonsters[tempmonsters.length-1][1]--;
				}
				else if (dir=='r') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]][item[1]+1] = 2;
					tempmonsters[tempmonsters.length-1][1]++;
				}
			}
		});
		monsters=tempmonsters;
		badcounter = 0;
	}
	else if (badcounter < 30) {
		badcounter++;
	}
	drawScreen(protomap);
	if (protomap[chary/16][(charx-1)/16] == 3) {
		protomap[chary/16][(charx-1)/16] = 1;
		playerhp += 5;
		if (playerhp > 20) {
			playerhp = 20;
		}
	}
	if (protomap[chary/16][(charx-1)/16] == 4) {
		protomap[chary/16][(charx-1)/16] = 1;
		playermana += 5;
		if (playerhp > 100) {
			playerhp = 100;
		}
	}
	if (playerhp <= 0) {
		gameOver();
	}
	if (playerhp < 0) {
		playerhp = 0;
	}
	hpbox.innerHTML = 'HP: ' + Math.ceil(playerhp).toString();
	manabox.innerHTML = 'Mana: ' + Math.ceil(playermana).toString();
	killbox.innerHTML = 'Kills: ' + Math.ceil(playerkills).toString();
	if (Key.isDown(Key.ESC)) {
		dispEnd();
	}
	if (Key.isDown(Key.SPACE) && playermana > 0) {
		playermana -= 1/6;
		if (playermana < 0) {
			playermana = 0;
		}
		attacking = true;
	}
	if (!Key.isDown(Key.SPACE) || playermana <= 0) {
		attacking = false;
	}
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
function drawScreen(map) {
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
			if (map[i][j] == 3) {
				ctx.drawImage(heart, 0, 0, 16, 16, j*16, i*16, 16, 16);
			}
			if (map[i][j] == 4) {
				ctx.drawImage(mana, 0, 0, 16, 16, j*16, i*16, 16, 16);
			}
		}
	}
	if (attacking) {
		if (playerdir[0] == 0 && playerdir[1] == 1) {
			ctx.save();
			ctx.translate(charx+15, chary+16);
			ctx.rotate(Math.PI/2);
			ctx.drawImage(attack, 0, 0);
			ctx.restore();
		}
		else if (playerdir[0] == 0 && playerdir[1] == -1) {
			ctx.save();
			ctx.translate(charx-1, chary);
			ctx.rotate(Math.PI*3/2);
			ctx.drawImage(attack, 0, 0);
			ctx.restore();
		}
		else if (playerdir[0] == -1 && playerdir[1] == 0) {
			ctx.save();
			ctx.translate(charx-1, chary+16);
			ctx.rotate(Math.PI);
			ctx.drawImage(attack, 0, 0);
			ctx.restore();
		}
		else {
			ctx.drawImage(attack, charx-1+(playerdir[0]*16), chary+(playerdir[1]*16), 16, 16);
		}
		if (protomap[chary/16+playerdir[1]][(charx-1)/16+playerdir[0]] != undefined && protomap[chary/16+playerdir[1]][(charx-1)/16+playerdir[0]] == 2) {
			for (q = 0; q < monsters.length; q++) {
				if (monsters[q][0] == chary/16+playerdir[1] && monsters[q][1] == (charx-1)/16+playerdir[0]) {
					monsters[q][2] -= 1/6;
					if (monsters[q][2] <= 0) {
						monsters.splice(q, 1);
						playerkills++;
						if (Math.random > 0.5) {
							protomap[chary/16+playerdir[1]][(charx-1)/16+playerdir[0]] = 3;
						}
						else {
							protomap[chary/16+playerdir[1]][(charx-1)/16+playerdir[0]] = 4;
						}
					}
				}
			}
		}
	}
	ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
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
