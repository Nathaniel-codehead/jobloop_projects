let refund_button_timeout;

function refund_button_clicked() {
    clearTimeout(refund_button_timeout);
    document.getElementById("refund_button_text").textContent = "TOO BAD!";
    refund_button_timeout = setTimeout(refund_button_return, 3000);

}

function refund_button_return() {
    document.getElementById("refund_button_text").textContent = "I Want a Refund";
}