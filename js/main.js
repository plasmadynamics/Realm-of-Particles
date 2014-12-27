var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var char = document.getElementById("char");
var charx = 0.0;
var chary = 0.0;
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
function keys(event) {
	switch (event.keyCode) {
		case 87: //W
			if (chary > 0) {
				chary--;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0 , 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 65: //A
			if (charx > 0) {
				charx--;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 83: //S
			if (chary+16 < canvas.height) {
				chary++;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
		case 68: //D
			if (charx+14 < canvas.width) {
				charx++;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.drawImage(char, 0, 0, 14, 16, charx, chary, 14, 16);
				break;
			}
			break;
	}
}
window.addEventListener('keydown', keys, false);