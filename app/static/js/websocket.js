// var websocket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws/progress/");

// websocket.onclose = OnClose
// websocket.onmessage = ReceiveMessage
// websocket.onopen = OnOpen

function submitForm() {
    var form = document.getElementById("document-type-form");
    var formData = new FormData(form);


    $.ajax({
        url: '/prepare-backend/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            // handle success response from server
            console.log(data);
        },
        error: function (xhr, status, error) {
            // handle error response from server
            console.log(xhr.responseText);
        }
    });
}

$(document).ready(function () {
    $('#document-type-form').on('submit', function (event) {
        event.preventDefault();
        submitForm();
    });
});



function ReceiveMessage(e) {
    const data = JSON.parse(e.data);
    console.log('Receive Message:', data.event);
    if (data.event == 'started') {
        $("#loading-animation").css({
            'display': 'block',
        })
    } else if (data.event == 'finished') {
        window.location.href = '/prepared/'
    }
}

function CheckTaskStatus() {
    $.ajax({
        url: '/check_status/',
        method: 'get',
        success: function (data) {
            if (!data.task_status) {
                // task completed, redirect
                window.location.href = "/prepared"
            } else {
                // task not completed, call this function again after some time
                setTimeout(CheckTaskStatus, 3000);
            }
        }
    });
}

$("#YourButtonId").click(function () {
    // Start the spinner
    $("#YourSpinnerGifId").css("display", "block");
    // Send a request to start your function
    $.ajax({
        url: '/your_url/',
        method: 'post',
        success: function (data) {
            if (data.success) {
                // Check if your function finished its execution after 3 seconds
                setTimeout(CheckTaskStatus, 3000);
            }
        }
    });
});