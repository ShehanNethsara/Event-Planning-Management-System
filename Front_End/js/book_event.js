$(document).ready(function() {
    const token = localStorage.getItem("token");

    // 1. පේජ් එකට එද්දීම ලොග් වෙලාද කියලා බලනවා
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    $("#bookEventForm").submit(function(e) {
        e.preventDefault();

        // --- වැදගත් ---
        // ඔයා MySQL එකේ SELECT query එක ගැහුවම ආපු අලුත් ID එක මෙතනට දාන්න.
        // මම දැනට 18 කියලා දානවා (ඔයාගේ Table එකේ අගය බලන්න).
        const currentUserId = 22;

        // 2. Form එකේ දත්ත ලබා ගැනීම
        const eventData = {
            title: $("#eventTitle").val(),
            type: $("#eventType").val(),
            date: $("#eventDate").val(), // Format: yyyy-MM-dd
            description: $("#eventDesc").val() || $("#eventDescription").val(),
            status: "PENDING",
            clientId: currentUserId
        };

        // 3. සරල Validation එකක් (හිස්ව Submit කිරීම වැළැක්වීමට)
        if (!eventData.title || !eventData.date) {
            alert("Please fill in the Event Title and Date!");
            return;
        }

        console.log("Attempting to save event:", eventData);

        // Button එක Disable කරමු double clicks වළක්වන්න
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).text('Processing...');

        // 4. Backend එකට AJAX Request එක යැවීම
        $.ajax({
            url: "http://localhost:8080/api/v1/events/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(eventData),
            success: function(response) {
                console.log("Server Response:", response);
                alert("Success! Your event request has been sent to Admin. 🚀");
                window.location.href = "user_dashboard.html";
            },
            error: function(err) {
                console.error("Booking Error:", err);
                submitBtn.prop('disabled', false).text('Submit Booking Request');

                let errorMsg = "Failed to book event.";
                if (err.status === 500) {
                    errorMsg = "Internal Server Error (500). Please check if Client ID " + currentUserId + " exists in Database.";
                } else if (err.responseJSON && err.responseJSON.message) {
                    errorMsg = err.responseJSON.message;
                }

                alert("Error: " + errorMsg);
            }
        });
    });
});