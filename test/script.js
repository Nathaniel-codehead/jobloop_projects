function query_selector_test(test_size) {
	const start_time = new Date().getTime();

	for (let index = 0; index < test_size; index++) {
		let element = document.querySelector("#fish");
	}

	return new Date().getTime() - start_time;
}

function get_id_test(test_size) {
	const start_time = new Date().getTime();

	for (let index = 0; index < test_size; index++) {
		let element = document.getElementById("fish");
	}

	return new Date().getTime() - start_time;
}