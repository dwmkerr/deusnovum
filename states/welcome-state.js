
function WelcomeState() {

	this.creatingSpace = false;
	this.timeLeftToCreateSpace = 1;
	this.createdSpace = false;

	this.fillStyle = "rgba(255, 255, 255, 1)"

};

WelcomeState.prototype.enter = function(game) {

};

WelcomeState.prototype.update = function(game, dt) {

	if(this.creatingSpace) {
		this.timeLeftToCreateSpace -= dt;
		if(this.timeLeftToCreateSpace <= 0) {
			this.creatingSpace = false;
			this.createdSpace = true;
		}

		var val = Math.round((255 * (this.timeLeftToCreateSpace / 1)), 0);
		if(val < 0) { 
			val = 0;
		}
		this.fillStyle = "rgba(" + val + "," + val + "," + val + ",1)";
	}

};

WelcomeState.prototype.draw = function(game, dt, canvas) {

	//	Get the drawing context.
	var ctx = canvas.getContext("2d");

	//	Clear the background.
	ctx.fillStyle = this.fillStyle;
	ctx.fillRect(0, 0, game.width, game.height);
	
	//	Draw info.
	ctx.font="72px Arial";
	ctx.fillStyle = '#eeeeee';
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("deus novum", game.width/2, game.height/2 - 100);
	ctx.font="14px Arial";
	ctx.fillStyle = '#676767';

	var text = this.createdSpace ? "Press 't' to create time." : "Press 'space' to create space.";

	ctx.fillText(text, game.width/2, game.height/2);

};

WelcomeState.prototype.keyDown = function(game, keyCode, event) {

	if(keyCode == 32 && (!this.creatingSpace && !this.createdSpace)) {
		this.creatingSpace = true;
		//	Move into the create time state.
		//game.moveToState(new CreateTimeState());
	}
	else if (keyCode == 84 && (!this.creatingTime && !this.createdTime)) {
		game.moveToState(new MainState(new Level1()));
	}
};

WelcomeState.prototype.keyUp = function(game, keyCode, event) {

};
