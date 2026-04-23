$(document).ready(function() {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    // 1. Session Guard
    if (!token || !storedUserId || storedUserId === "undefined" || storedUserId === "0") {
        alert("Please login to continue.");
        window.location.href = 'login.html';
        return;
    }

    // 2. Category Selection
    let selectedCategory = "WEDDING";
    $('.category-card').click(function() {
        $('.category-card').removeClass('active border-primary shadow-lg');
        $(this).addClass('active border-primary shadow-lg');
        selectedCategory = $(this).data('category');
    });

    // 3. Form Submit Logic
    $("#bookEventForm").off('submit').on('submit', function(e) {
        e.preventDefault();

        const currentUserId = parseInt(storedUserId);

        // --- වැදගත්ම වෙනස: EventDTO එකේ නමට (clientId) ගැලපෙන ලෙස දත්ත සැකසීම ---
        const eventData = {
            title: $("#eventTitle").val().trim(),
            type: selectedCategory || "OTHER",
            date: $("#eventDate").val(),
            location: $("#eventLocation").val() || $("#location").val(),
            description: $("#eventDescription").val() || $("#eventDesc").val() || "",
            status: "PENDING",
            // මෙතන තමයි කලින් වැරදුනේ. DTO එකේ තියෙන්නේ clientId (Long).
            clientId: currentUserId
        };

        // Validation
        if (!eventData.title || !eventData.date || !eventData.location) {
            alert("All mandatory fields (Title, Date, Location) are required.");
            return;
        }

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');

        console.log("🚀 Payload matching EventDTO:", JSON.stringify(eventData));

        // 4. AJAX Call
        $.ajax({
            url: "http://localhost:8080/api/v1/events/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(eventData),
            success: function(response) {
                console.log("✅ Success:", response);
                alert("Success! Your event has been booked. 🚀");
                window.location.href = "user_dashboard.html";
            },
            error: function(err) {
                console.error("❌ Error Response:", err.responseText);
                submitBtn.prop('disabled', false).text('Submit Booking Request');

                if (err.status === 400) {
                    alert("Error 400: Bad Request. Check your DTO mapping or IntelliJ logs.");
                } else {
                    alert("Error: Check if User ID: " + currentUserId + " is valid in Database.");
                }
            }
        });
    });
});