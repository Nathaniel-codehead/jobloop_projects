let darkmode = {"enabled": true, "black_percentage": 100};
let darkmode_interval_id = 0;
let darkmode_interval = 10;
let darkmode_increment = 2;

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function dark_mode_toggle() {
    darkmode["enabled"] = !darkmode["enabled"];
    document.getElementById("darkmode_button_image").setAttribute("src", `images/${(darkmode["enabled"]) ? "sun" : "moon"}.svg`);
    if ([0, 100].includes(darkmode["black_percentage"])) {
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
    }

    if (!darkmode["enabled"]) {
        if (darkmode["black_percentage"] <= 0) {
            clearInterval(darkmode_interval_id);
            return;
        }

        darkmode["black_percentage"] = clamp(darkmode["black_percentage"] - darkmode_increment, 0, 100);
    }

    document.documentElement.style.setProperty("--background", `color-mix(in srgb, var(--black) ${darkmode["black_percentage"]}%, var(--white) ${100 - darkmode["black_percentage"]}%)`);
    document.documentElement.style.setProperty("--main_text", `color-mix(in srgb, var(--black) ${100 - darkmode["black_percentage"]}%, var(--white) ${darkmode["black_percentage"]}%)`);
}

function get_url_parameter(target_parameter_name) {
    let url = window.location.search.substring(1);
    let url_parameters = url.split('&');

    for (let url_parameter_index = 0; url_parameter_index < url_parameters.length; url_parameter_index++) {
        let url_parameter = url_parameters[url_parameter_index].split('=');

        if (url_parameter[0] == target_parameter_name) {
            return url_parameter[1];
        }
    }
}

window.addEventListener('resize', () => {
    let location_card_container = document.getElementById("location_card_container");
    let main_footer_link_container = document.getElementById("main_footer_link_container");

    if (innerWidth < 1000) {
        if (location_card_container) {
            location_card_container.setAttribute("class", "flex column small_gap");
        }

        if (main_footer_link_container) {
            main_footer_link_container.setAttribute("class", "flex column center small_gap");
        }
        
    } else {
        if (location_card_container) {
            location_card_container.setAttribute("class", "flex");
        }

        if (main_footer_link_container) {
            main_footer_link_container.setAttribute("class", "flex");
        }
    }
})

function booking_submitted() {
    window.location.redirect("fake_loading.html?message=Confirming Your Purchase");
}