$(document).ready(function() {
    const token = localStorage.getItem("token");

    // පේජ් එකට එද්දීම ලොග් වෙලාද කියලා බලනවා
    if (!token) {
        window.location.href = 'login.html';
    }

    $("#bookEventForm").submit(function(e) {
        e.preventDefault();

        // Form එකේ දත්ත ලබා ගැනීම
        const eventData = {
            title: $("#eventTitle").val(),
            type: $("#eventType").val(),
            date: $("#eventDate").val(),
            description: $("#eventDesc").val(),
            status: "PENDING"
        };

        // Backend එකට දත්ත යැවීම
        $.ajax({
            url: "http://localhost:8080/api/v1/events/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(eventData),
            success: function(response) {
                alert("Success! Your event request has been sent to Admin.");
                window.location.href = "user_dashboard.html";
            },
            error: function(err) {
                console.error("Booking Error:", err);
                alert("Error: Failed to book event. Make sure your server is running.");
            }
        });
    });
});