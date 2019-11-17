//	Creates an instance of the Game class.
function Game() {

	//	Updates and Frames per second. ups controls
	//	the frequency of the update loop, fps controls
	//	the frequency of the draw loop.
	this.ups = 50;
	this.fps = 50;

	//	Interval ids for the timers.
	this.updateLoopIntervalId = null;
	this.drawLoopIntervalId = null;

	//	Input/output
	this.pressedKeys = {};
	this.inputElement = {};
	this.gameCanvas =  null;

	//	The state stack.
	this.stateStack = new Stack();

	//	The width and height of the game.
	this.width = 0;
	this.height = 0;
}

//	Initialis the Game with an input element which will delegate
//	keyboard and mouse events to the states, and an output
//	canvas which can be used for drawing.
Game.prototype.initialise = function(inputElement, gameCanvas, fullscreen) {

	var self = this;

	//	Store the input element and game canvas.
	this.inputElement = inputElement;
	this.gameCanvas	= gameCanvas;

	//	If we're a fullscreen game, we set the size.
	if(fullscreen) {
		window.onresize = function(event) {
			self.width = window.innerWidth;
			self.height = window.innerHeight;
			self.gameCanvas.width = self.width;
			self.gameCanvas.height = self.height;
			if(self.stateStack.any() && self.stateStack.top().draw) {
				self.draw();
			}
	 	}
		self.gameCanvas.width = window.innerWidth;
		self.gameCanvas.height = window.innerHeight;
	}

	//	Set the game width and height.
	this.width = self.gameCanvas.width;
	this.height = self.gameCanvas.height;

	//	Start the update loop.
	this.updateLoopIntervalId = setInterval(function () {
		var dt = 1 / self.ups;
		if(self.stateStack.any() && self.stateStack.top().update) {
			self.stateStack.top().update(self, dt);
		}
	}, 1000 / this.ups);

	//	Start the draw loop.
	this.drawLoopIntervalId = setInterval(function () {
		var dt = 1 / self.fps;
		if(self.stateStack.any() && self.stateStack.top().update) {
			self.stateStack.top().draw(self, dt, self.gameCanvas);
		}
	}, 1000 / this.fps);

	//	Disable the context menu.
	inputElement.oncontextmenu = function(e) {return false;};

	//	If we don't have an input element we're done, otherwise we'll
	//	need to wire up event handlers.
	if(!inputElement) {
		return;
	}

	//	Wire up keyboard access.
	inputElement.addEventListener("keydown", function keydown(e) {
			var keycode = e.which || window.event.keycode;
		    if(!self.pressedKeys[keycode])
		    	self.pressedKeys[keycode] = true;
		    if(self.stateStack.any() && self.stateStack.top().keyDown) {
		    	self.stateStack.top().keyDown(game, keycode, e);
		    }
		});
	inputElement.addEventListener("keyup", function keydown(e) {
		var keycode = e.which || window.event.keycode;
		if(self.pressedKeys[keycode])
		   	delete self.pressedKeys[keycode];
		if(self.stateStack.any() && self.stateStack.top().keyDown) {
		  	self.stateStack.top().keyDown(game, keycode, e);
		}
	});
	inputElement.addEventListener("mousedown", function(e) {
		if(self.stateStack.any() && self.stateStack.top().mouseDown) {
			self.stateStack.top().mouseDown(game, e.x, e.y, e);
		}
	});
	inputElement.addEventListener("mousewheel", function(e) {
		if(self.stateStack.any() && self.stateStack.top().mouseWheel) {
			self.stateStack.top().mouseWheel(game, e.x, e.y, e.wheelDelta, e);
		}
	});
};

//	Pushes a game state.
Game.prototype.pushState = function(state) {

	//	If there's an enter function for the new state, call it.
	if(state.enter) {
		state.enter(game);
	}

	//	Push the state.
	this.stateStack.push(state);
};

//	Pops a game state.
Game.prototype.popState = function() {
	if(this.stateStack.any()) {
		//	Call the leave function if there is o fne.
		if(this.stateStack.top().leave) {
			this.stateStack.top().leave(this);
		}
		this.stateStack.pop();
	}
};

//	Move to a state.
Game.prototype.moveToState = function(state) {

	//	Pop the current state...
	this.popState();

	//	...and push the new one.
	this.pushState(state);
};