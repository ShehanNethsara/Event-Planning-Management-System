$(document).ready(function() {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = 'login.html'; return; }

    loadVendorTasks();
});

function loadVendorTasks() {
    const vendorEmail = localStorage.getItem('userEmail');

    $.ajax({
        url: `http://localhost:8080/api/v1/events/vendor-requests?email=${vendorEmail}`,
        method: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
        success: function(events) {
            let rows = "";
            if (events.length === 0) {
                rows = '<tr><td colspan="3" class="text-center text-muted">No pending requests</td></tr>';
            } else {
                events.forEach(event => {
                    rows += `
                    <tr>
                        <td class="fw-bold">${event.type}</td>
                        <td>${event.date}</td>
                        <td>
                            <button class="btn btn-success btn-sm rounded-pill px-3" onclick="respondToRequest(${event.id}, 'CONFIRMED')">Accept</button>
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="respondToRequest(${event.id}, 'REJECTED')">Reject</button>
                        </td>
                    </tr>`;
                });
            }
            $("#vendorTaskBody").html(rows);
        },
        error: function() {
            $("#vendorTaskBody").html('<tr><td colspan="3" class="text-center text-danger">Error loading tasks</td></tr>');
        }
    });
}

function respondToRequest(eventId, newStatus) {
    if(!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this request?`)) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/events/${eventId}/status?status=${newStatus}`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
        success: function() {
            alert("Response updated successfully!");
            loadVendorTasks();
        },
        error: function() { alert("Failed to update status."); }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}