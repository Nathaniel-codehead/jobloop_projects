"use strict";

// variable init
let displayed_movies = [];

const example_movie = {
	"id": "fish_the_movie",
	"title": "Fish: The Movie",
	"image": {
		"url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic01.nyt.com%2Fimages%2F2022%2F09%2F08%2Fworld%2F08queen-photos38%2Fmerlin_212192898_c7e9f237-4dac-4923-916c-9b7dd07e6bd5-videoSixteenByNine3000.jpg&f=1&nofb=1&ipt=5a8327a4623cff272327d0b1f8478bf1bc4f4bbdbff62184672aef3b87281b8d&ipo=images",
		"cover": true
	},
	"rating": 8,
	"duration": 152
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
	new_movie.card.setAttribute("href", `pages/movie_editor?${movie.id}`);
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
	clear_movies()

	for (let movie of movie_array) {
		display_movie(movie);
	}
}



// initial movie load
let stored_movies = JSON.parse(localStorage.getItem("movies"));

if (stored_movies) {
	display_movies(stored_movies);
}