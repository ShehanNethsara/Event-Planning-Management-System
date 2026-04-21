$(document).ready(function() {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    // 1. පේජ් එකට එද්දීම ලොග් වෙලාද කියලා බලනවා
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    $("#bookEventForm").submit(function(e) {
        e.preventDefault();

        // පද්ධතියේ දැනට ඉන්න Admin ගේ ID එක 13 කියලා ඔයාගේ DB එකේ තිබුණ නිසා
        // මම දැනට ඒක පාවිච්චි කරනවා.
        // (Login වෙද්දී ID එක localStorage එකේ සේව් කරගත්තොත් මෙය තවත් ලේසියි)
        const currentUserId = 13;

        // 2. Form එකේ දත්ත ලබා ගැනීම
        const eventData = {
            title: $("#eventTitle").val(),
            type: $("#eventType").val(),
            date: $("#eventDate").val(),
            description: $("#eventDesc").val(),
            status: "PENDING",
            clientId: currentUserId // මෙන්න මේක අනිවාර්යයෙන්ම ඕනේ!
        };

        console.log("Sending Data:", eventData);

        // 3. Backend එකට දත්ත යැවීම
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

                // Server එකෙන් එන නියම Error message එක බලමු
                let errorMsg = "Failed to book event.";
                if (err.responseJSON && err.responseJSON.message) {
                    errorMsg = err.responseJSON.message;
                } else if (err.responseText) {
                    errorMsg = err.responseText;
                }

                alert("Error: " + errorMsg);
            }
        });
    });
});