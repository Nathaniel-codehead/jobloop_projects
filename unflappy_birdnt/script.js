// init
const TPS = 60;
const SPEED_MULTIPLIER = 6;
const ASTEROID_BASE_SPEED = 100;
const MAX_ASTEROID_DEVIATION = 60;
const TICK_SMOOTHING = 100;
const DEBUG = true;

let difficulty = 1;

let window_height = window.innerHeight;
let window_width = window.innerWidth;
let mouse = {"x": 0, "y": 0};
let player;
let asteroids = [];
let asteroid_ids = []
let next_asteroid_in = 1000;
const asteroid_sprites = ["cube_asteroid", "triangle_asteroid", "long_cuboid_asteroid"]

let recent_tick_durations = [];

// event listeners
window.addEventListener("resize", () => {
	window_height = window.innerHeight;
	window_width = window.innerWidth;
});

document.addEventListener("mousemove", (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});



// classes
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}

	set_vector(vector) {
		this.x = vector.x;
		this.y = vector.y;
	}

	distance_to(vector) {
		return Math.round(Math.sqrt(difference(this.x, this.y) ** 2 + difference(vector.y, vector.y) ** 2));
	}

	vector_to(vector) {
		return this.minus(vector);
	}

	angle_to(vector) {
		let vector_difference = this.minus(vector);
		return Math.atan2(vector_difference.x, vector_difference.y) / Math.PI * -180;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	}

	rounded() {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}

	clamp(min_x, max_x, min_y, max_y) {
		this.x = clamp(this.x, min_x, max_x);
		this.y = clamp(this.y, min_y, max_y);
	}

	length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize() {
		let length = this.length();
		this.x /= length;
		this.y /= length;
	}

	normalized() {
		return new Vector(this.x / this.length(), this.y /this.length());
	}



	// vector math
	plus(vector) {
		if (typeof(vector) == "number") {
			return new Vector(this.x + vector, this.y + vector);
		}

		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	minus(vector) {
		if (typeof(vector) == "number") {
			return new Vector(this.x - vector, this.y - vector);
		}

		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	multiplied_by(vector) {
		if (typeof(vector) == "number") {
			return new Vector(this.x * vector, this.y * vector);
		}

		return new Vector(this.x * vector.x, this.y * vector.y);
	}

	divided_by(vector) {
		if (typeof(vector) == "number") {
			return new Vector(this.x / vector, this.y / vector);
		}

		return new Vector(this.x / vector.x, this.y / vector.y);
	}

	exponentiate_by(vector) {
		if (typeof(vector) == "number") {
			return new Vector(this.x ** vector, this.y ** vector);
		}

		return new Vector(this.x ** vector.x, this.y ** vector.y);
	}

	add(vector) {
		if (typeof(vector) == "number") {
			this.x += vector;
			this.y += vector;
			return;
		}

		this.x += vector.x;
		this.y += vector.y;
	}

	subtract(vector) {
		if (typeof(vector) == "number") {
			this.x -= vector;
			this.y -= vector;
			return;
		}

		this.x -= vector.x;
		this.y -= vector.y;
	}

	multiply(vector) {
		if (typeof(vector) == "number") {
			this.x *= vector;
			this.y *= vector;
			return;
		}

		this.x *= vector.x;
		this.y *= vector.y;
	}

	divide(vector) {
		if (typeof(vector) == "number") {
			this.x /= vector;
			this.y /= vector;
			return;
		}

		this.x /= vector.x;
		this.y /= vector.y;
	}

	invert() {
		return this.multiplied_by(-1);
	}

	// statics
	static vector(x, y) {
		return {"x": x, "y": y};
	}
}



class Game_object {
	constructor(id, size, hitbox_radius) {
		this.id = id;
		this.size = new Vector(size.x, size.y);
		this.hitbox_radius = hitbox_radius;
		this.rotation = 0;
		this.position = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
	}

	clamp_within_window() {
		let side_lengths = this.size.divided_by(2).rounded()
		let min_x = side_lengths.x;
		let max_x = window_width - side_lengths.x;
		let min_y = side_lengths.y;
		let max_y = window_height - side_lengths.y;

		this.position.clamp(min_x, max_x, min_y, max_y)

		if (this.position.x == min_x) {
			this.velocity.x = Math.max(this.velocity.x, 0);
		} else if (this.position.x == max_x) {
			this.velocity.x = Math.min(this.velocity.x, 0);
		}

		if (this.position.y == min_y) {
			this.velocity.y = Math.max(this.velocity.y, 0);
		} else if (this.position.y == max_y) {
			this.velocity.y = Math.min(this.velocity.y, 0);
		}
	}

	update_sprite() {
		let element = document.getElementById(this.id);
		element.style.width = this.size.x
		element.style.height = this.size.y
		element.style.left = `${Math.round(this.position.x - this.size.x / 2)}`;
		element.style.top = `${Math.round(this.position.y - this.size.y / 2)}`;
		element.getElementsByTagName('img')[0].style.transform = `rotate(${Math.round(this.rotation)}deg)`;
	}

	is_colliding_with(game_object) {
		return (this.position.distance_to(game_object.position) < (this.hitbox_radius + game_object.hitbox_radius));
	}
}

class Timer {
	constructor() {
		this.reset_timer();
	}

	reset_timer() {
		let date = new Date();
		this.start_time = date.getTime();
	}

	current_time() {
		let date = new Date();
		return date.getTime() - this.start_time;
	}
}



// general functions
function difference(x, y) {
	return Math.abs(x - y);
}

function random_range(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function clamp(value, min, max) {
	return Math.max(Math.min(value, max), min);
}

function average(array) {
	let average = 0;

	for (item of array) {
		average += item / array.length;
	}

	return average;
}

function round(value, to_nearest) {
	return Math.round(value / to_nearest) * to_nearest;
}

function lerp(progress, start_value, end_value) {
	if (!(0 <= progress <= 1)) {
		throw new Error(`invalid progress: ${progress}`);
	}

	return start_value * (1 - progress) + end_value * progress
}



// game functions
function update_sprites() {
	player.update_sprite();

	for (asteroid of asteroids) {
		asteroid.update_sprite();
	}
}

function update_player() {
	player.velocity.subtract(player.position.vector_to(mouse).divided_by(TPS / SPEED_MULTIPLIER));
	player.rotation = player.position.angle_to(mouse);
	player.position.add(player.velocity.divided_by(TPS));
	player.clamp_within_window();
}

function log_average_tick_duration(current_tick_time, log = false) {
	if (!log) {
		return;
	}

	recent_tick_durations.unshift(current_tick_time);
	if (recent_tick_durations.length > TICK_SMOOTHING) {
		console.log(`${round(average(recent_tick_durations), 0.01)}ms`);
		recent_tick_durations = [];
	}
}

function spawn_asteroid() {
	let new_asteroid = document.createElement("div");
	let asteroid_sprite = document.createElement("img");

	asteroid_sprite.setAttribute("src", `sprites/${asteroid_sprites[random_range(0, 2)]}.svg`);
	new_asteroid.appendChild(asteroid_sprite);
	
	new_asteroid.classList.add("absolute");

	for (id = 0; true; id++) {
		if (!asteroid_ids.includes(id)) {
			new_asteroid.setAttribute("id", `asteroid_${id}`);
			asteroid_ids.push(id);
			break;
		}
	}

	let size = random_range(50 * difficulty, 100 * difficulty);
	let new_asteroid_game_object = new Game_object(`asteroid_${asteroid_ids[asteroid_ids.length - 1]}`, Vector.vector(size * 2, size * 2), size);
	
	let position = new Vector(0, 0);
	let velocity = new Vector(0, 0);
	let margin = 100 * difficulty;
	let min_sideways_velocity;
	let max_sideways_velocity;

	switch (random_range(1, 4)) {
		case 1:
			position.y = -margin;
			position.x = random_range(0, window_width);

			min_sideways_velocity = lerp(position.x / window_width, -MAX_ASTEROID_DEVIATION, 0);
			max_sideways_velocity = lerp(position.x / window_width, 0, MAX_ASTEROID_DEVIATION);

			velocity.y = 100;
			velocity.x = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 2:
			position.x = window_width + margin;
			position.y = random_range(0, window_height);

			min_sideways_velocity = lerp(position.y / window_height, -MAX_ASTEROID_DEVIATION, 0);
			max_sideways_velocity = lerp(position.y / window_height, 0, MAX_ASTEROID_DEVIATION);
			
			velocity.x = -100;
			velocity.y = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 3:
			position.y = window_height + margin;
			position.x = random_range(0, window_width);

			min_sideways_velocity = lerp(position.x / window_width, -MAX_ASTEROID_DEVIATION, 0);
			max_sideways_velocity = lerp(position.x / window_width, 0, MAX_ASTEROID_DEVIATION);

			velocity.y = -100;
			velocity.x = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 4:
			position.x = -margin;
			position.y = random_range(0, window_height);

			min_sideways_velocity = lerp(position.y / window_height, -MAX_ASTEROID_DEVIATION, 0);
			max_sideways_velocity = lerp(position.y / window_height, 0, MAX_ASTEROID_DEVIATION);
			
			velocity.x = 100;
			velocity.y = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
	}

	velocity.normalize();
	velocity.multiply(random_range(ASTEROID_BASE_SPEED, ASTEROID_BASE_SPEED * 2));

	new_asteroid_game_object.position.set_vector(position);
	new_asteroid_game_object.velocity.set_vector(velocity);

	asteroids.push(new_asteroid_game_object);
	document.body.getElementsByTagName("main")[0].appendChild(new_asteroid);
}

function remove_asteroid(asteroid) {
	const asteroid_id = asteroid.id;

	document.getElementById(asteroid_id).remove();
	asteroid_ids.splice(asteroid_ids.indexOf(asteroid_id), 1);
	asteroids.splice(asteroids.indexOf(asteroid), 1);
}

function update_asteroids() {
	for (asteroid of asteroids) {
		asteroid.position.add(asteroid.velocity.divided_by(TPS));
	}
}



// define main loop
function initialize_game() {
	player = new Game_object("player", Vector.vector(50, 50), 50);
	player.position.set(100, window_height / 2);
}

function main_tick() {
	const tick_timer = new Timer();

	update_player();
	update_asteroids();
	// check_for_collision();

	update_sprites();

	// log_average_tick_duration(tick_timer.current_time(), DEBUG)
}



// start main loop
initialize_game();
let main_loop_interval = setInterval(main_tick, 1000 / TPS);



// todo
// add asteroid spin
// make collision
// make game over sequence
// add asteroid collisions
// UI
// add automatic asteroid spawning
// add automatic asteroid deletion