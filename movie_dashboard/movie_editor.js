// global init
let current_movie = {
	"id": null,
	"title": null,
	"image": null,
	"rating": null,
	"duration": null,
	"released": null
};
let is_cover_enabled = false;



// function
function get_url_parameter(parameter_name) {
	let url = window.location.search.substring(1);
	let url_parameters = url.split("&");

	for (let url_parameter of url_parameters) {
		if (url_parameter.split("=")[0] == parameter_name) {
			return url_parameter.split("=")[1];
		}
	}

	return null;
}

function get_id(string) {
	let filtered_string = "";

	let invalid_characters = false;

	for (let letter of string.toLowerCase().trim()) {
		if (letter.search(/[a-z0-9]|_/) == -1) {
			invalid_characters = true;
			continue;
		}

		if (invalid_characters) {
			filtered_string += "_";
			invalid_characters = false;
		}

		filtered_string += letter;
	}

	return filtered_string;
}

function display_movie_properties(movie) {
	let poster_url_input = document.getElementById("poster_url_input");
	let title_input = document.getElementById("title_input");
	let rating_slider = document.getElementById("rating_slider");
	let minutes_input = document.getElementById("duration_minutes_input");
	let release_date_input = document.getElementById("release_date_input");

	if (current_movie.image) {
		poster_url_input.value = current_movie.image.url;
		is_cover_enabled = !current_movie.image.cover;
		toggle_image_cover();
		set_movie_poster_url();
	}

	if (current_movie.title) {
		title_input.value = current_movie.title;
		set_movie_title();
	}

	if (current_movie.rating) {
		rating_slider.value = current_movie.rating;
		set_movie_rating();
	}

	if (current_movie.duration) {
		minutes_input.value = current_movie.duration;
		set_movie_duration();
	}

	if (current_movie.released) {
		release_date_input.value = current_movie.released;
		set_movie_release_date();
	}
	
}

function set_movie_poster_url() {
	let poster_url_input = document.getElementById("poster_url_input");

	let preview_image = document.getElementById("preview_image");
	if (poster_url_input.value == "") {
		preview_image.setAttribute("src", "images/default_movie_icon.svg");
		preview_image.style.width = "200px";
		preview_image.style.height = "200px";

		current_movie.image = null;
	} else {
		preview_image.setAttribute("src", poster_url_input.value);
		preview_image.style.width = "100%";
		preview_image.style.height = "100%";

		current_movie.image = {
			"url": poster_url_input.value,
			"cover": is_cover_enabled
		};
	}
}

function toggle_image_cover() {
	let cover_button = document.getElementById("cover_toggle_button");
	let preview_image = document.getElementById("preview_image");

	is_cover_enabled = !is_cover_enabled;
	if (is_cover_enabled) {
		cover_button.style.borderColor = "#DB504A";
	} else {
		cover_button.style.borderColor = "#2A2D34";
	}

	if (current_movie.image) {
		current_movie.image.cover = is_cover_enabled;
	}

	preview_image.style.objectFit = (is_cover_enabled) ? "cover" : "contain";
}

function set_movie_title() {
	let title_input = document.getElementById("title_input");
	let save_button = document.getElementById("save_button");
	let error_display = document.getElementById("title_error_display");
	let movie_id = get_url_parameter("movie_id");
	let current_title_id = get_id(title_input.value);

	let error_message = "";

	if (title_input.value == "") {
		error_message = "MUST INCLUDE TITLE TO SAVE!";
	} 
	
	if (current_title_id != movie_id) {
		let stored_movies = get_stored_movies();

		if (!stored_movies) {
			stored_movies = [{"id":"eee"}];
		}

		for (let movie of stored_movies) {
			if (movie.id == current_title_id) {
				error_message = "THIS TITLE WILL OVERWRITE AN ALREADY EXISTING MOVIE!";
				break;
			}
		}
	}

	if (title_input.value == "") {
		save_button.setAttribute("disabled");
	} else {
		save_button.removeAttribute("disabled");
	}

	error_display.textContent = error_message;
	current_movie.title = title_input.value;
	current_movie.id = get_id(title_input.value);
}

function set_movie_rating() {
	let rating_slider = document.getElementById("rating_slider");
	let rating_display = document.getElementById("rating_display");
	rating_display.textContent = `${rating_slider.value}/10`;
	current_movie.rating = rating_slider.value;
}

function set_movie_duration() {
	let hours_input = document.getElementById("duration_hours_input");
	let minutes_input = document.getElementById("duration_minutes_input");

	minutes_input.value = Math.round(minutes_input.value);

	if (minutes_input.value > 59) {
		hours_input.value = Math.floor(minutes_input.value / 60);
		minutes_input.value = minutes_input.value % 60;
	}

	if (hours_input.value != Math.round(hours_input.value)) {
		minutes_input.value = Math.round((hours_input.value % 1) * 60);
		hours_input.value = Math.floor(hours_input.value);
	}

	current_movie.duration = parseInt(hours_input.value * 60) + parseInt(minutes_input.value);
}

function set_movie_release_date() {
	let release_date_input = document.getElementById("release_date_input");
	current_movie.released = release_date_input.value;
}

function save_changes() {
	let stored_movies = get_stored_movies()
	let movie_id = get_url_parameter("movie_id");

	if (!stored_movies) {
		stored_movies = [];
	}

	if (!movie_id) {
		stored_movies.push(current_movie);
	} else {
		let overwrote_movie = false;

		if (current_movie.id != movie_id) {
			for (let movie_index in stored_movies) {
				movie = stored_movies[movie_index];
				if (movie.id == current_movie.id) {
					stored_movies.splice(movie_index, 1);
					break;
				}
			}
		}

		for (let movie_index in stored_movies) {
			let movie = stored_movies[movie_index];
			if (movie.id == movie_id) {
				stored_movies[movie_index] = current_movie;
				overwrote_movie = true;
				break;
			}
		}

		if (!overwrote_movie) {
			console.error(`Couldn't find movie \"${movie_id}\" to overwrite.`);
		}
	}

	localStorage.setItem("movies", JSON.stringify(stored_movies));
	window.location.replace("index.html");
}

function get_stored_movies() {
	let stored_movies = localStorage.getItem("movies");

	if (!stored_movies) {
		return null;
	}

	return JSON.parse(stored_movies);
}

function delete_movie() {
	let stored_movies = get_stored_movies();
	let movie_id = get_url_parameter("movie_id");

	if (!stored_movies) {
		return;
	}

	for (let movie_index in stored_movies) {
		let movie = stored_movies[movie_index];
		if (movie.id == movie_id) {
			stored_movies.splice(movie_index, 1);
			break;
		}
	}

	localStorage.setItem("movies", JSON.stringify(stored_movies));
	window.location.replace("index.html");
}



window.addEventListener("load", () => {
	let movie_id = get_url_parameter("movie_id");

	if (!movie_id) {
		return;
	}

	let stored_movies = get_stored_movies()

	if (!stored_movies) {
		console.error(`couldn't find ${movie_id}`);
		return;
	}

	for (let movie of stored_movies) {
		if (movie.id == movie_id) {
			current_movie = movie;
			display_movie_properties(current_movie);
			return;
		}
	}

	console.error(`couldn't find \"${movie_id}\"`);
});