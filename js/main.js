//Canvas and UI initialisation
var canvas = document.getElementById("canvas");
var tileSize = 16;
var hpbox = document.getElementById("hpbox");
var manabox = document.getElementById("manabox");
var killbox = document.getElementById("killbox");
var highbox = document.getElementById("highbox");
if (localStorage.getItem("highscore") !== undefined) {
	highbox.innerHTML = "Highscore: " + localStorage.getItem("highscore");
}
else {
	localStorage.setItem("highscore", "0");
	highbox.innerHTML = "Highscore: " + localStorage.getItem("highscore");
}
canvas.width = Math.floor((window.innerWidth-80)/tileSize)*tileSize;
canvas.height = Math.floor((window.innerHeight-80)/tileSize)*tileSize;
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
var water = document.getElementById("water");
//Character positions
var charx = tileSize/16;
var chary = 0;
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
var playerdir = [0, 1];
var attacking = false;

//Map Gen
function genMap(xlim, ylim) {
	protomap = [];
	monsters = [];
	for (k = 0; k<ylim; k++) {
		for (l = 0; l<xlim; l++) {
			maprand = Math.random();
			if (maprand <= 0.75) {
				tempmaprow.push(1);
			}
			if (maprand > 0.75 && maprand <= 0.875) {
				tempmaprow.push(0);
			}
			if (maprand > 0.875 && maprand <= 1 - 1/125) {
				tempmaprow.push(5);
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
		while (protomap[i].length < canvas.width/tileSize) {
			protomap[i].push(1);
		}
	}
}
genMap(Math.floor(canvas.width/tileSize), Math.floor(canvas.height/tileSize));
chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
drawScreen(protomap);
ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, tileSize*7/8, tileSize);
//End display
function dispEnd() {
	if (playerkills > parseInt(localStorage.getItem("highscore"))) {
		localStorage.setItem("highscore", playerkills.toString());
		highbox.innerHTML = "Highscore: " + localStorage.getItem("highscore");
	}
	clearInterval(loop);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Game over
function gameOver() {
	if (playerkills > parseInt(localStorage.getItem("highscore"))) {
		localStorage.setItem("highscore", playerkills.toString());
		highbox.innerHTML = "Highscore: " + localStorage.getItem("highscore");
	}
	clearInterval(loop);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Check monster vision
function monSee(x, y) {
	if ((charx - tileSize / 16) / tileSize === x) {
		if (y < chary / tileSize) {
			for (tempy = y + 1; tempy < chary / tileSize; tempy++) {
				if (protomap[tempy][(charx - tileSize / 16) / tileSize] !== 1) {
					return false;
				}
			}
		}
		if (y > chary / tileSize) {
			for (tempy = y - 1; tempy > chary / tileSize; tempy--) {
				if (protomap[tempy][(charx - tileSize / 16) / tileSize] !== 1) {
					return false;
				}
			}
		}
		return true;
	}
	if (chary / tileSize === y) {
		if (x < (charx - tileSize / 16) / tileSize) {
			for (tempx = x + 1; tempx < (charx - tileSize / 16) / tileSize; tempx++) {
				if (protomap[chary / tileSize][tempx] !== 1) {
					return false;
				}
			}
		}
		if (x > (charx - tileSize / 16)/tileSize) {
			for (tempx = x - 1; tempx > (charx - tileSize / 16) / tileSize; tempx--) {
				if (protomap[chary / tileSize][tempx] !== 1) {
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
		if (((chary > 0) && (protomap[(chary - tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 1)) || ((chary > 0) && (protomap[(chary - tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 3)) || ((chary > 0) && (protomap[(chary - tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 4))) {
			chary -= tileSize;
		}
		else if (((chary > 0) === false) && (chunkExists(chunkx, chunky - 1) !== false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky -= 1;
			chary = (canvas.height - tileSize);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunky += 1;
				chary = 0;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((chary > 0) === false) && (chunkExists(chunkx, chunky-1) === false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky -= 1;
			chary = (canvas.height - tileSize);
			protomap = [];
			genMap(Math.floor(canvas.width / tileSize), Math.floor(canvas.height / tileSize));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			mapindex = chunkmap.length-1;
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunky += 1;
				chary = 0;
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
		if (((charx > tileSize) && (protomap[chary / tileSize][(charx - tileSize - tileSize / 16) / tileSize] === 1)) || ((charx > tileSize) && (protomap[chary / tileSize][(charx - tileSize - tileSize / 16) / tileSize] === 3)) || ((charx > tileSize) && (protomap[chary / tileSize][(charx - tileSize - tileSize / 16) / tileSize] === 4))) {
			charx -= tileSize;
		}
		else if (((charx > tileSize) === false) && (chunkExists(chunkx - 1, chunky) !== false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx -= 1;
			charx = (canvas.width - tileSize + tileSize / 16);
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunkx += 1;
				charx = tileSize / 16;
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((charx > tileSize) === false) && (chunkExists(chunkx - 1, chunky) === false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx -= 1;
			charx = (canvas.width - tileSize + tileSize / 16);
			protomap = [];
			genMap(Math.floor(canvas.width / tileSize), Math.floor(canvas.height / tileSize));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			mapindex = chunkmap.length - 1;
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunkx += 1;
				charx = tileSize / 16;
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
		if (((chary + tileSize < canvas.height) && (protomap[(chary + tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 1)) || ((chary + tileSize < canvas.height) && (protomap[(chary + tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 3)) || ((chary + tileSize < canvas.height) && (protomap[(chary + tileSize) / tileSize][(charx - tileSize / 16) / tileSize] === 4))) {
			chary += tileSize;
		}
		else if (((chary + tileSize < canvas.height) === false) && (chunkExists(chunkx, chunky + 1) !== false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky += 1;
			chary = 0;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunky -= 1;
				chary = (canvas.height - tileSize);
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (((chary + tileSize < canvas.height) === false) && (chunkExists(chunkx, chunky + 1) === false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunky += 1;
			chary = 0;
			protomap = [];
			genMap(Math.floor(canvas.width / tileSize), Math.floor(canvas.height / tileSize));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			mapindex = chunkmap.length - 1;
			if ((protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 0) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 2) || (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 5)) {
				chunky -= 1;
				chary = (canvas.height - tileSize);
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
		if (((charx + tileSize < canvas.width) && (protomap[chary / tileSize][(charx + tileSize * 15 / 16) / tileSize] === 1)) || ((charx + tileSize < canvas.width) && (protomap[chary / tileSize][(charx + tileSize * 15 / 16) / tileSize] === 3)) || ((charx + tileSize < canvas.width) && (protomap[chary / tileSize][(charx + tileSize * 15 / 16) / tileSize] === 4))) {
			charx += tileSize;
		}
		else if (!(charx + tileSize < canvas.width) && (chunkExists(chunkx + 1, chunky) !== false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx += 1;
			charx = tileSize / 16;
			protomap = chunkExists(chunkx, chunky)[2];
			monsters = chunkExists(chunkx, chunky)[3];
			mapindex = chunkExists(chunkx, chunky)[4];
			if ((protomap[chary / tileSize][0] === 0) || (protomap[chary / tileSize][0] === 2) || (protomap[chary / tileSize][0] === 5)) {
				chunkx -= 1;
				charx = (canvas.width - tileSize * 15 / 16);
				protomap = chunkExists(chunkx, chunky)[2];
				monsters = chunkExists(chunkx, chunky)[3];
				mapindex = chunkExists(chunkx, chunky)[4];
			}
		}
		else if (!(charx + tileSize < canvas.width) && (chunkExists(chunkx + 1, chunky) === false)) {
			chunkmap[mapindex] = [chunkx, chunky, protomap, monsters, mapindex];
			chunkx += 1;
			charx = tileSize / 16;
			protomap = [];
			genMap(Math.floor(canvas.width / tileSize), Math.floor(canvas.height / tileSize));
			chunkmap.push([chunkx, chunky, protomap, monsters, chunkmap.length]);
			mapindex = chunkmap.length - 1;
			if ((protomap[chary / tileSize][0] === 0) || (protomap[chary / tileSize][0] === 2) || (protomap[chary / tileSize][0] === 5)) {
				chunkx -= 1;
				charx = (canvas.width - tileSize * 15 / 16);
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
				if (item[0] === chary / tileSize) {
					if (item[1] < (charx - tileSize / 16) / tileSize && item[1] + 1 !== (charx - tileSize / 16) / tileSize && protomap[item[0]][item[1] + 1] === 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]][item[1] + 1] = 2;
						tempmonsters[tempmonsters.length - 1][1]++;
					}
					if (item[1] > (charx - tileSize / 16) / tileSize && item[1] - 1 !== (charx - tileSize / 16) / tileSize && protomap[item[0]][item[1] - 1] === 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0]][item[1] - 1] = 2;
						tempmonsters[tempmonsters.length - 1][1]--;
					}
					if (Math.abs(item[1] - (charx - tileSize / 16) / tileSize) === 1) {
						playerhp -= 4;
					}
				}
				else if (item[1] === (charx - tileSize / 16) / tileSize) {
					if (item[0] < chary / tileSize && item[0] + 1 !== chary / tileSize && protomap[item[0] + 1][item[1]] === 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0] + 1][item[1]] = 2;
						tempmonsters[tempmonsters.length - 1][0]++;
					}
					if (item[0] > chary / tileSize && item[0] - 1 !== chary / tileSize && protomap[item[0] - 1][item[1]] === 1) {
						protomap[item[0]][item[1]] = 1;
						protomap[item[0] - 1][item[1]] = 2;
						tempmonsters[tempmonsters.length - 1][0]--;
					}
					if (Math.abs(item[0] - chary / tileSize) === 1) {
						playerhp -= 4;
					}
				}
			}
			else {
				dirs = [];
				if (item[0] + 1 < protomap.length) {
					if (protomap[item[0] + 1][item[1]] === 1 && !(item[0] + 1 === chary / tileSize && item[1] === (charx - tileSize / 16) / tileSize)) {
						dirs.push('d');
					}
				}
				if (item[0] - 1 >= 0) {
					if (protomap[item[0] - 1][item[1]] === 1 && !(item[0] - 1 === chary / tileSize && item[1] === (charx - tileSize / 16) / tileSize)) {
						dirs.push('u');
					}
				}
				if (item[1] - 1 >= 0) {
					if (protomap[item[0]][item[1] - 1] === 1 && !(item[0] === chary / tileSize && item[1] - 1 === (charx - tileSize / 16) / tileSize)) {
						dirs.push('l');
					}
				}
				if (item[1] + 1 < protomap[0].length) {
					if (protomap[item[0]][item[1] + 1] === 1 && !(item[0] === chary / tileSize && item[1] + 1 === (charx - tileSize / 16) / tileSize)) {
						dirs.push('r');
					}
				}
				dirnum = Math.random() * (dirs.length - 1);
				dir = dirs[Math.round(dirnum)];
				if (dir === 'd') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0] + 1][item[1]] = 2;
					tempmonsters[tempmonsters.length - 1][0]++;
				}
				else if (dir === 'u') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0] - 1][item[1]] = 2;
					tempmonsters[tempmonsters.length - 1][0]--;
				}
				else if (dir === 'l') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]][item[1] - 1] = 2;
					tempmonsters[tempmonsters.length - 1][1]--;
				}
				else if (dir === 'r') {
					protomap[item[0]][item[1]] = 1;
					protomap[item[0]][item[1] + 1] = 2;
					tempmonsters[tempmonsters.length - 1][1]++;
				}
			}
		});
		monsters = tempmonsters;
		badcounter = 0;
	}
	else if (badcounter < 30) {
		badcounter++;
	}
	drawScreen(protomap);
	if (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 3) {
		protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] = 1;
		playerhp += 5;
		if (playerhp > 100) {
			playerhp = 100;
		}
	}
	if (protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] === 4) {
		protomap[chary / tileSize][(charx - tileSize / 16) / tileSize] = 1;
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
	for (i = 0; i < map.length; i++) {
		for (j = 0; j < map[i].length; j++) {
			if (map[i][j] === 0) {
				ctx.drawImage(rock, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
			if (map[i][j] === 1) {
				ctx.drawImage(grass, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
			if (map[i][j] === 2) {
				ctx.drawImage(bad, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
			if (map[i][j] === 3) {
				ctx.drawImage(heart, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
			if (map[i][j] === 4) {
				ctx.drawImage(mana, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
			if (map[i][j] === 5) {
				ctx.drawImage(water, 0, 0, 16, 16, j * tileSize, i * tileSize, tileSize, tileSize);
			}
		}
	}
	if (attacking) {
		if (playerdir[0] === 0 && playerdir[1] === 1) {
			ctx.save();
			ctx.translate(charx + tileSize - tileSize / 16, chary + tileSize);
			ctx.rotate(Math.PI / 2);
			ctx.drawImage(attack, 0, 0, tileSize, tileSize);
			ctx.restore();
		}
		else if (playerdir[0] === 0 && playerdir[1] === -1) {
			ctx.save();
			ctx.translate(charx - tileSize / 16, chary);
			ctx.rotate(Math.PI * 1.5);
			ctx.drawImage(attack, 0, 0, tileSize, tileSize);
			ctx.restore();
		}
		else if (playerdir[0] == -1 && playerdir[1] == 0) {
			ctx.save();
			ctx.translate(charx - tileSize / 16, chary + tileSize);
			ctx.rotate(Math.PI);
			ctx.drawImage(attack, 0, 0, tileSize, tileSize);
			ctx.restore();
		}
		else {
			ctx.drawImage(attack, charx - tileSize / 16 + (playerdir[0] * tileSize), chary + (playerdir[1] * tileSize), tileSize, tileSize);
		}
		if (protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] !== undefined && protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] === 2) {
			for (q = 0; q < monsters.length; q++) {
				if (monsters[q][0] === chary / tileSize + playerdir[1] && monsters[q][1] === (charx - tileSize / 16) / tileSize + playerdir[0]) {
					monsters[q][2] -= 1/6;
					if (monsters[q][2] <= 0) {
						monsters.splice(q, 1);
						playerkills++;
						if (Math.random() > 0.5) {
							protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] = 3;
						}
						else {
							protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] = 4;
						}
					}
				}
			}
		}
		else if (protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] !== undefined && protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16) / tileSize + playerdir[0]] === 0) {
			protomap[chary / tileSize + playerdir[1]][(charx - tileSize / 16)/tileSize + playerdir[0]] = 1;
		}
	}
	ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, tileSize*7/8, tileSize);
}

//Chunk detection
function chunkExists(x, y) {
	for (i = 0; i < chunkmap.length; i++) {
		if ((chunkmap[i][0] === x) && (chunkmap[i][1] === y)) {
			return chunkmap[i];
		}
	}
	return false;
}
loop = setInterval(tick, 50/3);
