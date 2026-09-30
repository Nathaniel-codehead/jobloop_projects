let darkmode = {"enabled": true, "black_percentage": 100, "white_percentage": 0};
let darkmode_interval_id = 0;
let darkmode_interval = 10;
let darkmode_increment = 2;

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function dark_mode_toggle() {
    darkmode["enabled"] = !darkmode["enabled"];
    document.getElementById("darkmode_button_image").setAttribute("src", `images/${(darkmode["enabled"]) ? "sun" : "moon"}.svg`);
    if (darkmode["black_percentage"] == 100 || darkmode["black_percentage"] == 0) {
        darkmode_interval_id = setInterval(change_background_color, darkmode_interval);
    }
}

function change_background_color() {
    if (darkmode["enabled"]) {
        if (darkmode["black_percentage"] >= 100) {
            clearInterval(darkmode_interval_id);
            return;
        }
        
        darkmode["black_percentage"] = clamp(darkmode["black_percentage"] + darkmode_increment, 0, 100);
        darkmode["white_percentage"] = clamp(darkmode["white_percentage"] - darkmode_increment, 0, 100);
    }

    if (!darkmode["enabled"]) {
        if (darkmode["white_percentage"] >= 100) {
            clearInterval(darkmode_interval_id);
            return;
        }

        darkmode["white_percentage"] = clamp(darkmode["white_percentage"] + darkmode_increment, 0, 100);
        darkmode["black_percentage"] = clamp(darkmode["black_percentage"] - darkmode_increment, 0, 100);
    }

    document.documentElement.style.setProperty("--background", `color-mix(in srgb, var(--black) ${darkmode["black_percentage"]}%, var(--white) ${darkmode["white_percentage"]}%)`);
    document.documentElement.style.setProperty("--main_text", `color-mix(in srgb, var(--black) ${darkmode["white_percentage"]}%, var(--white) ${darkmode["black_percentage"]}%)`);
}

function get_url_parameter(target_parameter_name) {
    let url = window.location.search.substring(1);
    let url_parameters = url.split('&');

    for (let url_parameter_index = 0; i < url_parameters.length; i++) {
        let url_parameter = url_parameters[url_parameter_index].split('=');

        if (url_parameter[0] == target_parameter_name) {
            return url_parameter[1];
        }
    }
}

window.addEventListener('resize', () => {
    if (innerWidth < 900) {
        document.getElementById("location_card_container").setAttribute("class", "flex column small_gap")
    } else {
        document.getElementById("location_card_container").setAttribute("class", "flex")
    }
})