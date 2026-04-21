const API_URL = "http://localhost:8080/api/v1/events";
const token = localStorage.getItem("token");
const currentRole = localStorage.getItem('userRole');

// 1. Security Check
if (!currentRole || currentRole !== 'ADMIN') {
    window.location.href = 'login.html';
}

$(document).ready(function() {
    loadAllEvents();

    // Admin නම Dashboard එකේ Display කිරීම
    const email = localStorage.getItem('userEmail');
    if(email) {
        $('#adminName').text(email.split('@')[0].toUpperCase());
    }
});

// 2. සියලුම Events ලබා ගැනීම සහ Charts Update කිරීම
function loadAllEvents() {
    $.ajax({
        url: API_URL + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(data) {
            let rows = "";
            let pendingCount = 0;

            if (data.length === 0) {
                rows = `<tr><td colspan="5" class="text-center py-4 text-muted">No event requests found.</td></tr>`;
            } else {
                data.forEach(ev => {
                    if(ev.status === "PENDING") pendingCount++;

                    rows += `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="bg-light p-2 rounded-circle me-3">
                                    <i class="fas fa-user text-primary"></i>
                                </div>
                                <span class="fw-bold text-dark">ID: ${ev.clientId}</span>
                            </div>
                        </td>
                        <td><span class="text-secondary fw-semibold">${ev.title}</span></td>
                        <td><i class="far fa-calendar-alt me-2 text-muted"></i>${ev.date}</td>
                        <td>
                            <span class="badge ${getStatusBadge(ev.status)} rounded-pill px-3">
                                ${ev.status}
                            </span>
                        </td>
                        <td class="text-center">
                            <div class="btn-group shadow-sm rounded">
                                <button class="btn btn-sm btn-success" title="Approve" onclick="approve(${ev.id})">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" title="Cancel" onclick="cancel(${ev.id})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
                });
            }
            $('#adminTableBody').hide().html(rows).fadeIn(500);

            // Stats Update කිරීම
            $('#totalEvents').text(data.length);
            $('#pendingRequests').text(pendingCount);

            // 📊 Charts වලට Real-time data යැවීම (මෙය අලුතින් එකතු කළා)
            if (typeof updateAdminCharts === "function") {
                updateAdminCharts(data);
            }
        },
        error: function(err) {
            console.error("Error loading events:", err);
            if(err.status === 403) {
                alert("Session Expired. Please login again.");
                window.location.href = 'login.html';
            }
        }
    });
}

// 3. Status එක අනුව පාට තීරණය කිරීම
function getStatusBadge(status) {
    switch (status) {
        case 'APPROVED': return 'bg-success bg-opacity-75';
        case 'CANCELLED': return 'bg-danger bg-opacity-75';
        case 'PENDING': return 'bg-warning text-dark';
        case 'COMPLETED': return 'bg-primary text-white';
        default: return 'bg-secondary';
    }
}

// 4. Status Update කිරීමේ function එක
function updateStatus(id, status) {
    if(confirm(`Are you sure you want to set this event to ${status}?`)) {
        $.ajax({
            url: `${API_URL}/${id}/status?status=${status}`,
            method: "PUT",
            headers: { "Authorization": "Bearer " + token },
            success: function() {
                alert(`Event successfully ${status.toLowerCase()}!`);
                loadAllEvents();
            },
            error: function() {
                alert("Error updating status. Please try again.");
            }
        });
    }
}

function approve(id) { updateStatus(id, "APPROVED"); }
function cancel(id) { updateStatus(id, "CANCELLED"); }

// 5. Logout Function
function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}