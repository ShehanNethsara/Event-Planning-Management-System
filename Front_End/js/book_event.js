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

        // 2. Form එකේ දත්ත ලබා ගැනීම (Entity එකට ගැලපෙන ලෙස)
        const eventData = {
            title: $("#eventTitle").val(),
            type: $("#eventType").val(),
            date: $("#eventDate").val(),
            location: $("#eventLocation").val(),
            description: $("#eventDesc").val() || "",
            status: "PENDING",
            userId: currentUserId // Backend Entity එකේ තිබිය යුතු නම
        };

        if (!eventData.title || !eventData.date || !eventData.location) {
            alert("Please fill in all the required fields!");
            return;
        }

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');

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
                if (err.status === 403) {
                    errorMsg = "Your session has expired or you do not have permission.";
                } else if (err.status === 500) {
                    errorMsg = "Internal Server Error. Please check if the User ID: " + currentUserId + " exists in DB.";
                }
                alert("Error: " + errorMsg);
            }
        });
    });
});