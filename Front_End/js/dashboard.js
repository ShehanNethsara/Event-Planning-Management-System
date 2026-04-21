const API_BASE_URL = 'http://localhost:8080/api/v1/events';

// 1. Auth Guard & Data Retrieval
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('userRole');
const userEmail = localStorage.getItem('userEmail');
const userId = localStorage.getItem('userId');

// Login කරලා නැත්නම් Redirect කරනවා
if (!token || !userRole) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // නම පෙන්වීම
    const displayName = document.getElementById('userDisplayName') || document.getElementById('userEmailDisplay') || document.getElementById('adminName');
    if (displayName) {
        displayName.innerText = userEmail ? userEmail.split('@')[0].toUpperCase() : userRole;
    }

    // දත්ත Load කිරීම
    loadEvents();

    // Event Booking Form Handle කිරීම
    const eventForm = document.getElementById('eventForm') || document.getElementById('bookEventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!userId) {
                alert("Session Error: User ID not found. Please login again.");
                logout();
                return;
            }

            const eventData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                description: (document.getElementById('eventDescription') || document.getElementById('eventDesc') || {value: ""}).value,
                clientId: parseInt(userId) // dynamic user id
            };

            const submitBtn = eventForm.querySelector('button[type="submit"]');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Processing...';
            }

            fetch(`${API_BASE_URL}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            })
                .then(async response => {
                    if (response.ok) {
                        alert("Event Booked Successfully! Your invoice has been generated.");
                        eventForm.reset();
                        window.location.href = 'user_dashboard.html';
                    } else {
                        const errorData = await response.json();
                        alert("Failed: " + (errorData.message || "Check your backend connection."));
                        if(submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerText = 'Submit Booking Request';
                        }
                    }
                })
                .catch(error => {
                    console.error("Booking Error:", error);
                    if(submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Submit Booking Request';
                    }
                });
        });
    }
});

// 2. Events Load කිරීමේ Function එක
function loadEvents() {
    const url = (userRole === 'ADMIN') ? `${API_BASE_URL}/all` : `${API_BASE_URL}/my-events?email=${userEmail}`;

    fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById('eventTableBody') || document.getElementById('userEventBody') || document.getElementById('adminTableBody');
            if (!tableBody) return;

            tableBody.innerHTML = '';

            if (!data || data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No events found.</td></tr>';
                return;
            }

            let pendingCount = 0, approvedCount = 0, completedCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;
                if (event.status === 'APPROVED') approvedCount++;
                if (event.status === 'COMPLETED') completedCount++;

                let actionButtons = '';

                // Admin Actions
                if (userRole === 'ADMIN' && event.status === 'PENDING') {
                    actionButtons = `
                    <button class="btn btn-sm btn-success me-1" onclick="updateStatus(${event.id}, 'APPROVED')">
                        <i class="fas fa-check"></i> Approve
                    </button>`;
                }

                // Client Actions (Invoice පෙන්වීම)
                if (userRole !== 'ADMIN' && event.status === 'APPROVED') {
                    actionButtons = `
                    <a href="invoice_view.html?id=${event.id}" class="btn btn-sm btn-info text-white me-1">
                        <i class="fas fa-file-invoice"></i> Invoice
                    </a>`;
                }

                actionButtons += `
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">
                    <i class="fas fa-trash"></i>
                </button>`;

                tableBody.innerHTML += `
                <tr class="align-middle">
                    <td>
                        <div class="fw-bold">${event.title}</div>
                        <small class="text-muted">${event.type}</small>
                    </td>
                    <td><i class="far fa-calendar-alt me-2 text-primary"></i>${event.date}</td>
                    <td><span class="badge ${getStatusClass(event.status)} rounded-pill px-3">${event.status}</span></td>
                    <td class="text-center">${actionButtons}</td>
                </tr>`;
            });

            updateCounters(data.length, pendingCount, approvedCount, completedCount);
        })
        .catch(err => console.error("Load Error:", err));
}

// 3. Status Update කිරීමේ Function එක
function updateStatus(eventId, newStatus) {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    // URL structure එක Backend එකේ @RequestParam හෝ @PathVariable එකට අනුව වෙනස් විය යුතුය
    // මෙතන මම path variable එකක් ලෙස දානවා (ඔයාගේ Controller එක බලන්න)
    fetch(`${API_BASE_URL}/update-status?id=${eventId}&status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            if (res.ok) {
                alert("Success!");
                loadEvents();
            } else {
                alert("Update failed.");
            }
        })
        .catch(err => console.error("Update Error:", err));
}

function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success text-white';
        case 'COMPLETED': return 'bg-primary text-white';
        case 'CANCELLED': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
    }
}

function updateCounters(total, pending, approved, completed) {
    if(document.getElementById('totalEvents')) document.getElementById('totalEvents').innerText = total;
    if(document.getElementById('pendingCount')) document.getElementById('pendingCount').innerText = pending;
    if(document.getElementById('ongoingCount')) document.getElementById('ongoingCount').innerText = approved;
    if(document.getElementById('completedCount')) document.getElementById('completedCount').innerText = completed;
}

function deleteEvent(eventId) {
    if (confirm("Cancel this event?")) {
        updateStatus(eventId, 'CANCELLED');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}