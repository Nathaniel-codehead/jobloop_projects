// global init
let current_movie = {
	"image": null
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

	if (current_movie.image != null) {
		current_movie.image.cover = is_cover_enabled;
	}

	preview_image.style.objectFit = (is_cover_enabled) ? "cover" : "contain";
}

window.addEventListener("load", () => {
	let movie_id = get_url_parameter("movie_id");

	if (!movie_id) {
		return;
	}

	let stored_movies = JSON.parse(localStorage.getItem("movies"));

	if (!stored_movies) {
		return;
	}

	for (movie of stored_movies) {
		if (movie.id == movie_id) {
			current_movie = movie;
			return;
		}
	}

	console.error(`couldn't find ${movie_id}`);
});