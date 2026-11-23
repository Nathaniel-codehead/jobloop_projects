"use strict";

const example_movie = {
	"id": "fish_the_movie",
	"title": "Fish: The Movie",
	"image": {
		"url": "https://example.com/example.png",
		"cover": true
	}
};

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
	} else {
		new_movie.image.setAttribute("src", "images/default_movie_icon.svg");
	}

	// push
	new_movie.poster.appendChild(new_movie.image);
	new_movie.card.appendChild(new_movie.poster);
	new_movie.card.appendChild(new_movie.title);

	movie_section.appendChild(new_movie.card);
}