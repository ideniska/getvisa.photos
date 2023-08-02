function submitForm() {
    var form = document.getElementById("document-type-form");
    var formData = new FormData(form);

    // Start the spinner
    // document.querySelector(".loading span:nth-of-type(n)").style.display = "inline-block";
    const spanList = document.querySelectorAll(".loading span");
    spanList.forEach((span) => {
        span.style.display = "inline-block";
    });

    // Send a request to start your function
    $.ajax({
        url: '/prepare-backend/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.success) {
                // Check if your function finished its execution after 3 seconds
                setTimeout(CheckTaskStatus, 1000);
            }
        }
    });
}

$(document).ready(function () {
    $('#document-type-form').on('submit', function (event) {
        event.preventDefault();
        submitForm();
    });
});

function CheckTaskStatus() {
    $.ajax({
        url: '/check_status/',
        method: 'get',
        success: function (data) {
            console.log(data.task_status);
            if (data.task_status) {
                // task completed, redirect
                window.location.href = "/prepared"
            } else {
                // task not completed, call this function again after some time
                setTimeout(CheckTaskStatus, 1000);
            }
        }
    });
}