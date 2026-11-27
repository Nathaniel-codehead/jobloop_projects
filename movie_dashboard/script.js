"use strict";

// globals init
let displayed_movies = [];
let invert_sort = false;

const example_movie = {
	"id": "fish_2_the_fishening",
	"title": "Fish 2: The Fishening",
	"image": {
		"url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic01.nyt.com%2Fimages%2F2022%2F09%2F08%2Fworld%2F08queen-photos38%2Fmerlin_212192898_c7e9f237-4dac-4923-916c-9b7dd07e6bd5-videoSixteenByNine3000.jpg&f=1&nofb=1&ipt=5a8327a4623cff272327d0b1f8478bf1bc4f4bbdbff62184672aef3b87281b8d&ipo=images",
		"cover": true
	},
	"rating": 8,
	"duration": 152,
	"released": "20261120"
};



// functions
function display_movie(movie) {
	// setup
	const movie_section = document.getElementById("movie_section");
	const new_movie = {};

	new_movie.card = document.createElement("a");
	new_movie.title = document.createElement("p");
	new_movie.poster = document.createElement("div");
	new_movie.image = document.createElement("img");

	// set properties
	new_movie.card.setAttribute("href", `movie_editor.html?movie_id=${movie.id}`);
	new_movie.card.classList.add("movie_card");
	new_movie.title.textContent = movie.title;
	new_movie.poster.classList.add("movie_poster_background");

	if (movie.image) {
		new_movie.image.setAttribute("src", movie.image.url);
		new_movie.image.style.objectFit = (movie.image.cover) ? "cover" : "contain";
		new_movie.image.style.width = "100%";
		new_movie.image.style.height = "100%";
	} else {
		new_movie.image.setAttribute("src", "images/default_movie_icon.svg");
		new_movie.image.style.width = "100px";
		new_movie.image.style.height = "100px";
	}



	// push
	new_movie.poster.appendChild(new_movie.image);
	new_movie.card.appendChild(new_movie.poster);
	new_movie.card.appendChild(new_movie.title);

	movie_section.appendChild(new_movie.card);

	displayed_movies.push(new_movie);
}

function clear_movies() {
	for (let movie of displayed_movies) {
		movie.card.remove();
	}
}

function display_movies(movie_array) {
	clear_movies();

	for (let movie of movie_array) {
		display_movie(movie);
	}
}

function set_sort_type() {
	let sort_type_dropdown = document.getElementById("sort_type_dropdown");
	let stored_movies = get_stored_movies()

	clear_movies();

	if (!stored_movies) {
		return;
	}

	switch (sort_type_dropdown.value) {
		case "alphabetical":
			stored_movies.sort((movie_1, movie_2) => {
				return (movie_1.title <= movie_2.title) ? -1 : 1;
			});
			break;
		
		case "release_date":
			stored_movies.sort((movie_1, movie_2) => {
				if (!movie_1.released) {
					return 1;
				}
				
				if (!movie_2.released) {
					return -1;
				}

				return parseInt(movie_1.released.replaceAll("-", "")) - parseInt(movie_2.released.replaceAll("-", ""));
			});
			break;

		case "rating":
			stored_movies.sort((movie_1, movie_2) => {
				if (!movie_1.rating) {
					return 1;
				}
				
				if (!movie_2.rating) {
					return -1;
				}

				return movie_2.rating - movie_1.rating;
			});
			break;
		
		case "duration":
			stored_movies.sort((movie_1, movie_2) => {
				if (!movie_1.duration) {
					return 1;
				}
				
				if (!movie_2.duration) {
					return -1;
				}

				return movie_2.duration - movie_1.duration;
			});
			break;
	
		default:
			break;
	}

	if (invert_sort) {
		stored_movies.sort((a, b) => {
			return -1;
		})
	}

	display_movies(stored_movies);
}

function toggle_sort_direction() {
	let sort_direction_button = document.getElementById("sort_direction_button");
	let sort_image = sort_direction_button.childNodes[1];

	invert_sort = !invert_sort;
	set_sort_type();

	sort_image.style.transform = `rotate(${(invert_sort) ? 180 : 0}deg)`;
}

function get_stored_movies() {
	let stored_movies = localStorage.getItem("movies");

	if (!stored_movies) {
		return null;
	}

	return JSON.parse(stored_movies);
}



// initial movie load
let stored_movies = get_stored_movies()

if (stored_movies) {
	display_movies(stored_movies);
}