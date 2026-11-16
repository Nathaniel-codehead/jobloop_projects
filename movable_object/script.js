"use strict";

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

	get_length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize() {
		let length = this.get_length();
		this.x /= length;
		this.y /= length;
	}

	normalized() {
		if (this.get_length() == 0) {
			return new Vector(0, 0);
		}
		return new Vector(this.x / this.get_length(), this.y / this.get_length());
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
}

class Game_object {
	constructor(id, size) {
		this.id = id;
		this.size = new Vector(size.x, size.y);
		this.position = new Vector(0, 0);
	}

	clamp_within_window() {
		let side_lengths = this.size.divided_by(2).rounded();
		let min_x = side_lengths.x;
		let max_x = window_dimensions.x - side_lengths.x;
		let min_y = side_lengths.y;
		let max_y = window_dimensions.y - side_lengths.y;

		this.position.clamp(min_x, max_x, min_y, max_y);
	}

	update_sprite() {
		const element = document.getElementById(this.id);
		element.style.width = this.size.x;
		element.style.height = this.size.y;
		element.style.left = `${Math.round(this.position.x - this.size.x / 2)}px`;
		element.style.top = `${Math.round(this.position.y - this.size.y / 2)}px`;
	}
}

class Keyboard {
	static keyboard_keys = {};
	static update_function = null;

	static initialize(update_function = null) {
		Keyboard.update_function = update_function;
		document.addEventListener("keydown", (event) => {
			Keyboard.set_key(event.code, true);
			if (Keyboard.update_function) {
				Keyboard.update_function(event.code.toLowerCase(), Keyboard.keyboard_keys[event.code.toLowerCase()]);
			}
		});

		document.addEventListener("keyup", (event) => {
			Keyboard.set_key(event.code, false);
			if (Keyboard.update_function) {
				Keyboard.update_function(event.code.toLowerCase(), Keyboard.keyboard_keys[event.code.toLowerCase()]);
			}
		});
	}

	static set_key(key_code, press) {
		let key_object = Keyboard.keyboard_keys[key_code.toLowerCase()];

		if (!key_object) {
			key_object = {"is_pressed": false, "just_pressed": false};
		}

		key_object = {"is_pressed": press, "just_pressed": !key_object.is_pressed && press};
		Keyboard.keyboard_keys[key_code.toLowerCase()] = key_object;
	}

	static get_key(key_code) {
		let key_object = Keyboard.keyboard_keys[key_code.toLowerCase()];

		if (!key_object) {
			key_object = {"is_pressed": false, "just_pressed": false};
		}

		return key_object.is_pressed;
	}
}



// global variable init
const TPS = 60;
const PLAYER_SPEED = 10;
const PLAYER_SIZE = 50;

let window_dimensions = new Vector(window.innerWidth, window.innerHeight);
let mouse_position = new Vector(0, 0);
let main_loop_interval_id;
let player;
let move_to_mouse = false;



// event listeners
window.addEventListener("resize", () => {
	window_dimensions.set(window.innerWidth, window.innerHeight);
});

// document.addEventListener("mousemove", (event) => {
// 	mouse_position.set(event.clientX, event.clientY)
// });

document.addEventListener("click", (event) => {
	mouse_position.set_vector(event);
	move_to_mouse = true;
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

	for (let item of array) {
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



// game functions
function update_player() {
	let velocity = new Vector(0, 0);
	velocity.x = (Keyboard.get_key("arrowRight") ? 1 : 0) - (Keyboard.get_key("arrowLeft") ? 1 : 0);
	velocity.y = (Keyboard.get_key("arrowDown") ? 1 : 0) - (Keyboard.get_key("arrowUp") ? 1 : 0);

	if ((velocity.get_length() != 0) || (player.position == mouse_position)) {
		move_to_mouse = false;
	}

	if (move_to_mouse) {
		player.position.x += (mouse_position.x - player.position.x) / (TPS / 15);
		player.position.y += (mouse_position.y - player.position.y) / (TPS / 15);
	}

	player.position.add(velocity.normalized().multiplied_by(PLAYER_SPEED * 60 / TPS));
	player.clamp_within_window();
}



// define main loop
function initialize_game() {
	player = new Game_object("player", new Vector(PLAYER_SIZE, PLAYER_SIZE));
	player.position.set(window_dimensions.x / 2, window_dimensions.y / 2);

	Keyboard.initialize(console.log)

	main_loop_interval_id = setInterval(main_tick, 1000 / TPS);
}

function main_tick() {
	update_player();
	player.update_sprite();
}



// start main loop
initialize_game();