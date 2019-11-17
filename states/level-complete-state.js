
function LevelCompleteState(var level) {

	this.level = level;
};

MainState.prototype.enter = function(game) {

};

MainState.prototype.update = function(game, dt) {
	
};

MainState.prototype.draw = function(game, dt, canvas) {

	//	Get the drawing context.
	var ctx = canvas.getContext("2d");
	ctx.save();

	//	Clear the background.
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, game.width, game.height);
	ctx.translate(game.width/2, game.height/2);
	
	//	Draw every particle.
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var p = this.particles[i];
		ctx.fillStyle = "rgba(" + p.red + "," + p.green + "," + p.blue + "," + p.alpha + ")";
		ctx.fillRect(p.x, p.y, 2, 2);
	};

	//	Draw every planet.
	for(var i=this.planets.length - 1; i >= 0; i--) {
		var p = this.planets[i];
		ctx.fillStyle = "#660000";
		//ctx.fillRect(p.x, p.y, 10, 10);
		fillCircle(ctx, p.x, p.y, p.getRadius(), p.getRadius());
	}

	//	Draw all the sinks.
	ctx.strokeStyle = "#6666FF";
	for (var i = this.sinks.length - 1; i >= 0; i--) {
		var sink = this.sinks[i];
 		strokeCircle(ctx, sink.x, sink.y, sink.radius, sink.radius);
	};


	ctx.font="14px Arial";
	ctx.fillStyle = '#676767';
	ctx.textAlign = "right";
	ctx.textBaseline = "center";
	ctx.fillText("particles: " + this.particles.length, game.width/2 - 20, game.height/2 - 20);
	ctx.textAlign = "left";
	ctx.fillText("left/right click for matter, scroll in/out for energy", -game.width/2 + 20, game.height/2 - 20);

	var text = this.createdSpace ? "Press 't' to create time." : "Press 'space' to create space.";

	ctx.fillText(text, game.width/2, game.height/2);


	ctx.strokeStyle = "#006600";
	var timeY = 3*game.height/8;
	var timerRad = 15;
	strokeCircle(ctx, 0, timeY, timerRad);
	var dotx = Math.sin( -(this.currentTime) * Math.PI * 2) * timerRad;
	var doty = Math.cos( -(this.currentTime) * Math.PI * 2) * timerRad;
	ctx.strokeStyle = "#00FF00";
	strokeCircle(ctx, dotx, doty + timeY, 3);
	ctx.restore();

};

function strokeCircle(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();
}

function fillCircle(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}


MainState.prototype.keyDown = function(game, keyCode, event) {

	if(keyCode == 84) {
	}
};

MainState.prototype.keyUp = function(game, keyCode, event) {

};

MainState.prototype.mouseDown = function(game, x, y, event) {

	//	Move to universe coordinates.
	x -= game.width/2;
	y -= game.height/2;
	var pos = new Vector(x, y, 0);

	//	Get the button - 0 is left, 1 is middle, 2 is right.	
	var button = event.button;

	//	Find the planet we're over (if we're over a planet).
	for (var i = this.planets.length - 1; i >= 0; i--) {
		var between = vecDiff(pos, this.planets[i]);
		if(vecMag(between) <= this.planets[i].getRadius()) {
			
			//	If we right click on a button, we remove the planet entirely.
			if(button === 2) {
				//	Remove the planet.
				this.planets.splice(i, 1);

				//	We're done.
				event.canceleBubble = true;
			}
			return;
		}
	}

	//	If we left click on empty space, we add a new planet.
	if(button === 0) {
		this.planets.push(new Planet(x, y, 0, 500));
	}
}

MainState.prototype.mouseWheel = function(game, x, y, delta, event) {

	//	Move to universe coordinates.
	x -= game.width/2;
	y -= game.height/2;
	var pos = new Vector(x, y, 0);

	//	Are we over a planet?
	var planet = this.hitTestPlanets(x, y);

	//	If we are, we can increase or decrease the planet's mass.
	if(planet) {
		planet.setMass(planet.mass + delta);
	}

	//	Go through each particle.
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var d = vecMag(vecDiff(this.particles[i], pos));
		if(Math.abs(d) < 1) {
			continue;
		}
		//	Energy pull is inversely proportional to distance squared.
		var energyPull = delta / d*d;
	};

};

//	Returns the planet that the coordinate is over (if any).
MainState.prototype.hitTestPlanets = function(x, y) {

	var pos = new Vector(x, y, 0);

	for (var i = this.planets.length - 1; i >= 0; i--) {
		var between = vecDiff(pos, this.planets[i]);
		if(vecMag(between) <= this.planets[i].radius) {
			return this.planets[i];
		}
	}
}

function Particle(x, y, z, mass, velocity) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.mass = mass;
	this.velocity = velocity;

	this.red = 255;
	this.green = 255;
	this.blue = 255;
	this.alpha = 1;
}

function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

function Planet(x, y, z, mass) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.setMass(mass);
}

Planet.prototype.setMass = function(mass) {
	this.mass = mass;
	this.radius = Math.pow(mass, (1/3));
};

Planet.prototype.getRadius = function() {
	return this.radius;
};


function Sink(x, y, z, radius) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.radius = radius;
	this.particlesSunk = 0;
}

function vecDiff(v1, v2) {
	return new Vector(v2.x-v1.x, v2.y-v1.y, v2.z-v1.z);
}

function vecAdd(v1, v2) {
	return new Vector(v2.x+v1.x, v2.y+v1.y, v2.z+v1.z);
}

function vecMag(v) {
	return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}

function vecNorm(v) {
	var mag = vecMag(v);
	return new Vector(v.x/mag, v.y/mag, v.z/mag);
}

function vecMult(v, s) {
	return new Vector(v.x*s, v.y*s, v.z*s);
}

//	Force between two bodies:
//	F = m1*m2*G = (r1 - r2)

function CreateLevel1(particles, planets, sinks) {

	//	Create one particle.
	var particle = new Particle(-50, 0, 0, 1, new Vector(0, 75, 0));
	var planet = new Planet(0, 0, 0, 500);
	particles.push(particle);
	planets.push(planet);
	sinks.push(new Sink(100, 0, 0, 20));
}