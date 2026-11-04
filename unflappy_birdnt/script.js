// init
const TPS = 5;
const player_size = {"x": 50, "y": 50}
let window_height = window.innerHeight;
let window_width = window.innerWidth;
let mouse = {"x": 0, "y": 0}



// event listeners
window.addEventListener("resize", () => {
	window_height = window.innerHeight;
	window_width = window.innerWidth;
});

document.addEventListener("mousemove", (event) => {
	mouse["x"] = event.clientX;
	mouse["y"] = event.clientY;
});



// general functions
function difference(x, y) {
	return Math.abs(x - y);
}

function distance(position_1, position_2) {
	return Math.round(Math.sqrt(difference(position_1["x"], position_2["x"]) ** 2 + difference(position_1["y"], position_2["y"]) ** 2));
}

function random_range(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function clamp(value, min, max) {
	return Math.max(Math.min(value, max), min);
}

function bound_position(position, max_x, max_y, size = {"x": 0, "y": 0}, min_x = 0, min_y = 0) {
	let element_radius = {"x": size["x"] / 2, "y": size["y"] / 2};
	position["x"] = clamp(position["x"], min_x + element_radius["x"], max_x - element_radius["x"])
	position["y"] = clamp(position["y"], min_y + element_radius["y"], max_y - element_radius["y"])
	return position
}

function vector_addition(vector_1, vector_2) {
	
}

function angle_to(position, target_position) {
	return Math.atan2()
}



// game functions
function set_position(id, x, y, size = {"x": 0, "y": 0}) {
	let element = document.getElementById(id);
	element.style.left = `${Math.round(x - size["x"] / 2)}`;
	element.style.top = `${Math.round(y - size["y"] / 2)}`;
}

function set_rotation(id, degrees) {
	let element = document.getElementById(id);
	element.style.transform = `rotate(${degrees}deg)`;
}



// define main loop
function main_tick() {
	return;
}



// start main loop
let main_loop_interval = setInterval(main_tick, 1000 / TPS)