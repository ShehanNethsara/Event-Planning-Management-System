$(document).ready(function() {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    // 1. පද්ධතියට ඇතුළු වී ඇත්දැයි පරීක්ෂා කිරීම
    if (!token || !storedUserId || storedUserId === "undefined") {
        alert("Session expired. Please login again.");
        window.location.href = 'login.html';
        return;
    }

    $("#bookEventForm").submit(function(e) {
        e.preventDefault();

        // localStorage එකේ තියෙන string ID එක integer එකක් කරනවා
        const currentUserId = parseInt(storedUserId);

        // 2. Form එකේ දත්ත ලබා ගැනීම
        const eventData = {
            title: $("#eventTitle").val(),
            type: $("#eventType").val(),
            date: $("#eventDate").val(),
            description: $("#eventDesc").val() || $("#eventDescription").val() || "",
            status: "PENDING",
            clientId: currentUserId // දැන් මෙතනට නිවැරදි අංකය යනවා
        };

        if (!eventData.title || !eventData.date) {
            alert("Please fill in the Event Title and Date!");
            return;
        }

        console.log("Sending Event Data:", eventData);

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).text('Processing...');

        // 3. Backend එකට AJAX Request එක යැවීම
        $.ajax({
            url: "http://localhost:8080/api/v1/events/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(eventData),
            success: function(response) {
                alert("Success! Your event request has been sent to Admin. 🚀");
                window.location.href = "user_dashboard.html";
            },
            error: function(err) {
                console.error("Booking Error:", err);
                submitBtn.prop('disabled', false).text('Submit Booking Request');

                let errorMsg = "Failed to book event.";
                if (err.status === 500) {
                    errorMsg = "Internal Server Error (500). The server couldn't link the event to User ID: " + currentUserId;
                }
                alert("Error: " + errorMsg);
            }
        });
    });
});