const API_URL = "http://localhost:8080/api/v1/events";
const token = localStorage.getItem("token");
const currentRole = localStorage.getItem('userRole');

if (!currentRole) {
    window.location.href = 'login.html';
}

$(document).ready(function() {
    loadAllEvents();
});

function loadAllEvents() {
    $.ajax({
        url: API_URL + "/all",
        headers: { "Authorization": "Bearer " + token },
        success: function(data) {
            let rows = "";
            data.forEach(ev => {
                rows += `<tr>
                    <td>User ID: ${ev.clientId}</td>
                    <td>${ev.title}</td>
                    <td>${ev.date}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approve(${ev.id})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="cancel(${ev.id})">Cancel</button>
                    </td>
                </tr>`;
            });
            $('#adminTableBody').html(rows);
        }
    });
}

function approve(id) { updateStatus(id, "APPROVED"); }
function cancel(id) { updateStatus(id, "CANCELLED"); }

function updateStatus(id, status) {
    $.ajax({
        url: `${API_URL}/${id}/status?status=${status}`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        success: function() { alert("Status Updated!"); loadAllEvents(); }
    });
}