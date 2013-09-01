
function CreateTimeState() {

};

CreateTimeState.prototype.enter = function(game) {

};

CreateTimeState.prototype.update = function(game, dt) {

};

CreateTimeState.prototype.draw = function(game, dt, canvas) {

	//	Get the drawing context.
	var ctx = canvas.getContext("2d");

	//	Clear the background.
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, game.width, game.height);
	
	//	Draw info.
	ctx.font="72px light Arial";
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("Deus Novae", game.width/2, game.height/2 - 100);
	ctx.font="14px Arial";
	ctx.fillStyle = '#676767';
	ctx.fillText("Press 't' to create time.", game.width/2, game.height/2);
};

CreateTimeState.prototype.keyDown = function(game, keyCode, event) {

	if(keyCode == 84) {
		//	Fire when space is pressed.
		game.shipFire();
	}
};

CreateTimeState.prototype.keyUp = function(game, keyCode, event) {

};
