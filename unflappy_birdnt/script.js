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

	get_axes() {
		return [this.x, this.y];
	}

	distance_to(vector) {
		return Math.round(Math.sqrt(difference(this.x, vector.x) ** 2 + difference(this.y, vector.y) ** 2));
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
		return new Vector(this.x / this.length(), this.y / this.length());
	}

	average(vector) {
		return new Vector(average([this.x, vector.x]), average([this.y, vector.y]))
	}

	rotated_by(degrees) {
		let rotation_radians = degrees / 180 * Math.PI;
		let cosine_factor = Math.cos(rotation_radians);
		let sine_factor = Math.sin(rotation_radians);
		
		return new Vector(this.x * cosine_factor - this.y * sine_factor, this.y * cosine_factor + this.x * sine_factor);
	}

	rotated_to(degrees) {
		let current_rotation = new Vector(0, 0).angle_to(this);
		
		return this.rotated_by(current_rotation - degrees);
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
		return new Vector(x, y);
	}
}

class Game_object {
	constructor(id, size, hitbox_radius) {
		this.id = id;
		this.size = new Vector(size.x, size.y);
		this.hitbox_radius = hitbox_radius;
		this.rotation = 0;
		this.spin = 0;
		this.center_offset = new Vector(0, 0);
		this.position = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.is_child = false;
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
		let offset = this.get_offset_for_current_rotation();
		element.style.width = this.size.x;
		element.style.height = this.size.y;
		element.style.left = `${Math.round(this.position.x - this.size.x / 2 - offset.x)}px`;
		element.style.top = `${Math.round(this.position.y - this.size.y / 2 - offset.y)}px`;
		element.getElementsByTagName('img')[0].style.transform = `rotate(${Math.round(this.rotation)}deg)`;

		if (DEBUG) {
			let hitbox_element = element.getElementsByClassName("hitbox")[0];
			let x = this.size.x / 2 - this.hitbox_radius;
			let y = this.size.x / 2 - this.hitbox_radius;

			hitbox_element.style.top = `${y + Math.round(offset.y)}px`;
			hitbox_element.style.left = `${x + Math.round(offset.x)}px`;
		}
	}

	is_colliding_with(game_object) {
		return (this.position.distance_to(game_object.position) < (this.hitbox_radius + game_object.hitbox_radius));
	}

	get_offset_for_current_rotation() {
		return this.center_offset.rotated_by(this.rotation);
	}
}

class Simple_game_object {
	constructor(id) {
		this.id = id;
		this.position = new Vector(0, 0);
		this.rotation = 0;
	}

	update_sprite() {
		let element = document.getElementById(this.id);
		element.style.width = this.size.x;
		element.style.height = this.size.y;
		element.style.left = `${Math.round(this.position.x - this.size.x / 2)}px`;
		element.style.top = `${Math.round(this.position.y - this.size.y / 2)}px`;
		element.style.transform = `rotate(${Math.round(this.rotation)}deg)`;
	}
}

class Timer {
	constructor() {
		this.start_time = 0;
		this.reset_timer();
		this.last_lap = this.start_time;
	}

	reset_timer() {
		let date = new Date();
		this.start_time = date.getTime();
	}

	current_time() {
		let date = new Date();
		return date.getTime() - this.start_time;
	}

	lap() {
		let date = new Date();
		let time_since_last_lap = date.getTime() - this.last_lap;
		this.last_lap = date.getTime();
		return time_since_last_lap;
	}
}



// variable init
const TPS = 60;
const SPEED_MULTIPLIER = 6;
const ASTEROID_BASE_SPEED = 100;
const MAX_ASTEROID_DEVIATION = 70;
const TICK_SMOOTHING = TPS * 2;
const DEBUG = false;
const PLAYER_SIZE = 50;
const ASTEROID_SPAWN_MARGIN = 100;
const HITBOX_SCALE = 0.8;
const ASTEROID_SPRITES = [
	{
		"name": "cube_asteroid",
		"offset": new Vector(0, 0),
		"hitbox_scale": 1
	},
	{
		"name": "triangle_asteroid",
		"offset": new Vector(0.12, 0.12),
		"hitbox_scale": 0.9
	},
	{
		"name": "long_cuboid_asteroid",
		"offset": new Vector(0, 0),
		"hitbox_scale": 1
	}
];
const WARNING_SPRITES = ["orange_warning", "red_warning"]

let difficulty = 1;
let score = 0;

let window_height = window.innerHeight;
let window_width = window.innerWidth;
let mouse = new Vector(0, 0);
let game_timer;
let main_loop_interval_id;

let player;
let asteroids = [];
let warnings = [];
let next_asteroid_id = 0;
let next_asteroid_at = 0;

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



// general functions
function difference(x, y) {
	return Math.abs(x - y);
}

function random_range(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function random_bool(percentage_chance = 0.5) {
	return (Math.random() < percentage_chance);
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

function round(value, to_nearest = 1) {
	return Math.round(value / to_nearest) * to_nearest;
}

function lerp(progress, start_value, end_value) {
	if ((progress > 1) || (progress < 0)) {
		throw new Error(`invalid progress: ${progress}`);
	}

	return start_value * (1 - progress) + end_value * progress
}

function array_max(array) {
	let highest_value = array [0];

	for (item of array) {
		highest_value = Math.max(highest_value, item);
	}

	return highest_value;
}

function short_number_string(number, decimals) {
	let number_string = `${round(number, 1 / 10 ** decimals)}`;
	let output_string = "";
	let passed_decimals = 0;

	for (letter of number_string) {
		if (passed_decimals > decimals) {
			break;
		}

		if (passed_decimals > 0) {
			passed_decimals += 1;
		}

		if (letter == ".") {
			passed_decimals += 1;
		}

		output_string += letter;
	}
	return output_string;
}

function debug_log(message) {
	if (DEBUG) {
		console.log(message);
	}
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

	score += round(player.velocity.length() / TPS * difficulty / 10 + 100 / TPS);

	for (asteroid of asteroids) {
		if (player.is_colliding_with(asteroid)) {
			game_over();
			return;
		}
	}
}

function log_tick_duration(current_tick_time, log = false) {
	if (!log) {
		return;
	}

	recent_tick_durations.unshift(current_tick_time);
	if (recent_tick_durations.length > TICK_SMOOTHING) {
		console.log(`avg: ${short_number_string(average(recent_tick_durations), 2)}ms, max: ~${array_max(recent_tick_durations)}ms`);
		recent_tick_durations = [];
	}
}

function spawn_asteroid(position, velocity, size, spin, asteroid_sprite, is_child = false) {
	let new_asteroid_element = document.createElement("div");
	let asteroid_sprite_element = document.createElement("img");

	asteroid_sprite_element.setAttribute("src", `sprites/${asteroid_sprite.name}.svg`);
	new_asteroid_element.appendChild(asteroid_sprite_element);

	if (DEBUG) {
		let hitbox_element = document.createElement("div");
		hitbox_element.classList.add("hitbox");
		new_asteroid_element.appendChild(hitbox_element);
		hitbox_element.style.width = `${Math.round(size.x * HITBOX_SCALE * asteroid_sprite.hitbox_scale)}px`;
		hitbox_element.style.height = `${Math.round(size.y * HITBOX_SCALE * asteroid_sprite.hitbox_scale)}px`;
	}
	
	new_asteroid_element.classList.add("asteroid");

	next_asteroid_id += 1;
	new_asteroid_element.setAttribute("id", `asteroid_${next_asteroid_id}`);

	let new_asteroid_game_object = new Game_object(`asteroid_${next_asteroid_id}`, size, size.x / 2 * HITBOX_SCALE * asteroid_sprite.hitbox_scale);

	new_asteroid_game_object.position.set_vector(position);
	new_asteroid_game_object.velocity.set_vector(velocity);
	new_asteroid_game_object.spin = spin;
	new_asteroid_game_object.center_offset.set_vector(size.multiplied_by(asteroid_sprite.offset));
	new_asteroid_game_object.is_child = is_child;

	spawn_warning(new_asteroid_game_object);

	asteroids.push(new_asteroid_game_object);
	
	document.body.getElementsByTagName("main")[0].appendChild(new_asteroid_element);

	return new_asteroid_game_object;
}

function spawn_regular_randomized_asteroid() {
	let size = new Vector(1, 1).multiplied_by(random_range(50 * difficulty, 80 * difficulty) * 2);
	let position = new Vector(0, 0);
	let velocity = new Vector(0, 0);
	let spin = random_range(60, 180) * (random_bool() ? -1 : 1);

	let margin = ASTEROID_SPAWN_MARGIN * difficulty;

	let min_sideways_velocity;
	let max_sideways_velocity;

	switch (random_range(1, 4)) {
		case 1:
			position.y = -margin;
			position.x = random_range(0, window_width);

			min_sideways_velocity = lerp(position.x / window_width, 0, -MAX_ASTEROID_DEVIATION);
			max_sideways_velocity = lerp(position.x / window_width, MAX_ASTEROID_DEVIATION, 0);

			velocity.y = 100;
			velocity.x = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 2:
			position.x = window_width + margin;
			position.y = random_range(0, window_height);

			min_sideways_velocity = lerp(position.y / window_height, 0, -MAX_ASTEROID_DEVIATION);
			max_sideways_velocity = lerp(position.y / window_height, MAX_ASTEROID_DEVIATION, 0);
			
			velocity.x = -100;
			velocity.y = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 3:
			position.y = window_height + margin;
			position.x = random_range(0, window_width);

			min_sideways_velocity = lerp(position.x / window_width, 0, -MAX_ASTEROID_DEVIATION);
			max_sideways_velocity = lerp(position.x / window_width, MAX_ASTEROID_DEVIATION, 0);

			velocity.y = -100;
			velocity.x = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
		case 4:
			position.x = -margin;
			position.y = random_range(0, window_height);

			min_sideways_velocity = lerp(position.y / window_height, 0, -MAX_ASTEROID_DEVIATION);
			max_sideways_velocity = lerp(position.y / window_height, MAX_ASTEROID_DEVIATION, 0);
			
			velocity.x = 100;
			velocity.y = random_range(min_sideways_velocity, max_sideways_velocity);
			break;
	}

	velocity.normalize();
	velocity.multiply(random_range(ASTEROID_BASE_SPEED, ASTEROID_BASE_SPEED * 2));
	velocity.multiply(difficulty);

	spawn_asteroid(position, velocity, size, spin, ASTEROID_SPRITES[random_range(0, 2)]);
}

function remove_asteroid(asteroid) {
	let asteroid_id = asteroid.id;

	document.getElementById(asteroid_id).remove();
	asteroids.splice(asteroids.indexOf(asteroid), 1);
}

function get_asteroid_by_id(id) {
	for (asteroid in asteroids) {
		if (asteroid.id == id) {
			return asteroid;
		}
	}
}

function update_asteroids() {
	for (asteroid of asteroids) {
		asteroid.position.add(asteroid.velocity.divided_by(TPS));
		asteroid.rotation += asteroid.spin / TPS;
		asteroid.rotation %= 360;

		let despawn_margin = ASTEROID_SPAWN_MARGIN * difficulty * 1.5;

		// asteroid out of bounds check
		if (asteroid.position.x < (0 - despawn_margin)) {
			remove_asteroid(asteroid);
			continue;
		}

		if (asteroid.position.x > (window_width + despawn_margin)) {
			remove_asteroid(asteroid);
			continue;
		}

		if (asteroid.position.y < (0 - despawn_margin)) {
			remove_asteroid(asteroid);
			continue;
		}

		if (asteroid.position.y > (window_height + despawn_margin)) {
			remove_asteroid(asteroid);
			continue;
		}

		// asteroid collision check
		for (target_asteroid of asteroids) {
			check_collision(asteroid, target_asteroid)
		}
	}
}

function check_collision(asteroid, target_asteroid) {
	if (target_asteroid == asteroid) {
		return;
	}

	if (asteroid.position.distance_to(target_asteroid.position) > (asteroid.hitbox_radius + target_asteroid.hitbox_radius)) {
		return;
	}

	if (asteroid.is_child && target_asteroid.is_child) {
		return;
	}

	let number_of_child_asteroids = random_range(3, 5);

	if (asteroid.is_child) {
		remove_asteroid(asteroid);
		debug_log(`${asteroid.id} was too young to survive the crash`);

		number_of_child_asteroids = 0;
	}

	if (target_asteroid.is_child) {
		remove_asteroid(target_asteroid);
		debug_log(`${target_asteroid.id} was too young to survive the crash`);

		number_of_child_asteroids = 0;
	}

	for (let index = 0; index < number_of_child_asteroids; index++) {
		let position = asteroid.position.average(target_asteroid.position);
		let average_velocity = average([asteroid.velocity.length(), target_asteroid.velocity.length()])
		let velocity = new Vector(0, average_velocity).rotated_to(random_range(0, 359));
		let size = asteroid.size.average(target_asteroid.size).divided_by(1 + (number_of_child_asteroids / 2));
		let spin = random_range(60, 180) * (random_bool() ? -1 : 1);

		let new_asteroid = spawn_asteroid(position, velocity, size, spin, ASTEROID_SPRITES[random_range(0, 2)], true);

		debug_log(`${new_asteroid.id} was born`);
	}

	if (number_of_child_asteroids != 0) {
		remove_asteroid(asteroid);
		remove_asteroid(target_asteroid);

		debug_log(`${asteroid.id} died during birth`);
		debug_log(`${target_asteroid.id} died during birth`);
	}
}

function try_to_spawn_new_asteroid() {
	let current_game_time = game_timer.current_time();
	if (next_asteroid_at <= current_game_time) {
		spawn_regular_randomized_asteroid();
		next_asteroid_at = current_game_time + random_range(2000, 5000) / difficulty;
	}
}

function game_over() {
	clearInterval(main_loop_interval_id);
}

function clear_asteroids() {
	for (asteroid of asteroids) {
		remove_asteroid(asteroid);
	}
}

function update_ui() {
	update_score();
}

function update_score() {
	const score_display = document.getElementById("score_display");
	score_display.textContent = `${score}`;
}

function spawn_warning(asteroid) {
	let id = asteroid.id;
	let out_of_bounds_warning_element = document.createElement("img");
	out_of_bounds_warning_element.setAttribute("id", `warning_${id}`);
	out_of_bounds_warning_element.setAttribute("src", `sprites/${WARNING_SPRITES[0]}.svg`);
	out_of_bounds_warning_element.style.width = `${70}px`;
	out_of_bounds_warning_element.style.height = `${70}px`;

	let out_of_bounds_warning_game_object = new Simple_game_object(`warning_${id}`);
	out_of_bounds_warning_game_object.position = asteroid.position;

	warnings.push(out_of_bounds_warning_game_object);
	document.body.getElementsByTagName("main")[0].appendChild(out_of_bounds_warning_element);
}



// define main loop
function initialize_game() {
	difficulty = 1;
	score = 0;
	next_asteroid_id = 0;

	clear_asteroids();

	player = new Game_object("player", new Vector(PLAYER_SIZE, PLAYER_SIZE), PLAYER_SIZE / 2 * HITBOX_SCALE);
	player.position.set(window_width / 2, window_height / 2);

	if (DEBUG) {
		let player_hitbox = document.createElement(div);
		player_hitbox.classList.add("hitbox");
		player_hitbox.style.width = `${Math.round(PLAYER_SIZE * HITBOX_SCALE)}px`;
		player_hitbox.style.height = `${Math.round(PLAYER_SIZE * HITBOX_SCALE)}px`;
		document.getElementById("player").appendChild(player_hitbox);

		// spawn_asteroid(Vector.vector(900, 400), Vector.vector(0,0), Vector.vector(100, 100), 60, ASTEROID_SPRITES[1]);
	}

	game_timer = new Timer();
}

function main_tick() {
	game_timer.lap()

	difficulty += 0.01 / TPS

	update_player();
	try_to_spawn_new_asteroid();
	update_asteroids();
	update_sprites();
	update_ui();

	log_tick_duration(game_timer.lap(), DEBUG)
}



// start main loop
initialize_game();
main_loop_interval_id = setInterval(main_tick, 1000 / TPS);



// todo
// finish warnings
// make game over sequence
// UI