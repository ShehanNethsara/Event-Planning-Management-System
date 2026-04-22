const EVENT_API = "http://localhost:8080/api/v1/events";
const token = localStorage.getItem('token');
const vEmail = localStorage.getItem('userEmail');

$(document).ready(function() {
    if (!token) { window.location.href = 'login.html'; return; }
    loadVendorRequests();
});

function loadVendorRequests() {
    $.ajax({
        url: `${EVENT_API}/vendor-requests?email=${vEmail}`,
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            let rows = "";
            if (events.length === 0) {
                rows = '<tr><td colspan="4" class="text-center py-4 text-muted">No pending job requests found.</td></tr>';
            } else {
                events.forEach(event => {
                    rows += `
                    <tr>
                        <td class="fw-bold">#${event.id}</td>
                        <td>${event.type}</td>
                        <td>${event.date}</td>
                        <td class="text-center">
                            <button class="btn btn-success btn-sm rounded-pill px-3" onclick="respondToJob(${event.id}, 'CONFIRMED')">Accept</button>
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3 ms-1" onclick="respondToJob(${event.id}, 'REJECTED')">Reject</button>
                        </td>
                    </tr>`;
                });
            }
            $("#vendorRequestsBody").html(rows);
            $("#reqCount").text(events.length + " New");
        },
        error: function() {
            alert("Could not load vendor requests. Check backend connection.");
        }
    });
}

function respondToJob(id, status) {
    if(!confirm(`Do you want to ${status.toLowerCase()} this job?`)) return;

    $.ajax({
        url: `${EVENT_API}/${id}/status?status=${status}`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        success: function() {
            alert("Success! Status updated to " + status);
            loadVendorRequests();
        },
        error: function() { alert("Error updating status."); }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}