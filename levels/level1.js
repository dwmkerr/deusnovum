/*
	Level 1: We have a particle orbiting a mass, 
	we can remove the mass only and we need to remove it
	at the right time to get it to hit the sink.
*/

function Level1() {
	this.name = "Level 1";
	this.instructions = "Sink the capricious particle. You can use the right mouse button to remove matter.";
}

Level1.prototype.initialise = function(universe) {

		//	Setup a particle spinning around a mass, with a sink to the right.
		var particle = new Particle(-50, 0, 0, 1, new Vector(0, 75, 0));
		var planet = new Planet(0, 0, 0, 500);
		universe.particles.push(particle);
		universe.planets.push(planet);

		var sink = new Sink(100, 0, 0, 20);
		sink.particlesNeeded = 1;
		universe.sinks.push(sink);

};