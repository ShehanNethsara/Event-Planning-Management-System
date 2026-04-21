const API_BASE_URL = 'http://localhost:8080/api/v1/events';

// 1. පද්ධතියට ඇතුළු වී ඇත්දැයි පරීක්ෂා කිරීම (Auth Guard)
const token = localStorage.getItem('token');
const userRole = localStorage.getItem('userRole');
const userEmail = localStorage.getItem('userEmail');

if (!token || !userRole) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Dashboard එකේ නම පෙන්වීම
    const displayName = document.getElementById('userDisplayName') || document.getElementById('userEmailDisplay') || document.getElementById('adminName');
    if (displayName) {
        displayName.innerText = userEmail ? userEmail.split('@')[0].toUpperCase() : userRole;
    }

    loadEvents();

    const eventForm = document.getElementById('eventForm') || document.getElementById('bookEventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const eventData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                description: (document.getElementById('eventDescription') || document.getElementById('eventDesc')).value,
                status: "PENDING"
            };

            fetch(`${API_BASE_URL}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            })
                .then(response => {
                    if (response.ok) {
                        alert("Event Booked Successfully!");
                        eventForm.reset();
                        // සාර්ථක වූ පසු User Dashboard එකට යැවීම
                        window.location.href = 'user_dashboard.html';
                    } else {
                        alert("Failed to book event. Please try again.");
                    }
                })
                .catch(error => console.error("Error:", error));
        });
    }
});

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
            let pendingCount = 0;
            let ongoingCount = 0;
            let completedCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;
                if (event.status === 'APPROVED') ongoingCount++;
                if (event.status === 'COMPLETED') completedCount++;

                let actionButtons = '';

                if (userRole === 'ADMIN' && event.status === 'PENDING') {
                    actionButtons = `
                <button class="btn btn-sm btn-success me-1" onclick="updateStatus(${event.id}, 'APPROVED')">
                    <i class="fas fa-check-circle"></i> Approve
                </button>`;
                }

                if (userRole !== 'ADMIN' && event.status === 'APPROVED') {
                    actionButtons = `
                <a href="invoice.html?id=${event.id}" class="btn btn-sm btn-outline-info me-1">
                    <i class="fas fa-file-invoice"></i> Invoice
                </a>`;
                }

                actionButtons += `
            <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">
                <i class="fas fa-trash"></i>
            </button>`;

                tableBody.innerHTML += `
            <tr class="align-middle">
                <td><div class="fw-bold">${event.title}</div><small class="text-muted">${event.type}</small></td>
                <td><i class="far fa-calendar-alt me-2 text-primary"></i>${event.date}</td>
                <td><span class="badge ${getStatusClass(event.status)} rounded-pill px-3">${event.status}</span></td>
                <td class="text-center">${actionButtons}</td>
            </tr>`;
            });

            updateCounters(data.length, pendingCount, ongoingCount, completedCount);

            if(typeof initAdminCharts === 'function' && userRole === 'ADMIN') {
                initAdminCharts(data);
            }
        })
        .catch(err => console.error("Load Error:", err));
}

function updateCounters(total, pending, ongoing, completed) {
    if(document.getElementById('totalEvents')) document.getElementById('totalEvents').innerText = total;
    if(document.getElementById('pendingCount')) document.getElementById('pendingCount').innerText = pending;
    if(document.getElementById('ongoingCount')) document.getElementById('ongoingCount').innerText = ongoing + pending;
    if(document.getElementById('completedCount')) document.getElementById('completedCount').innerText = completed;
}

function updateStatus(eventId, newStatus) {
    if (!confirm(`Are you sure you want to set this event to ${newStatus}?`)) return;

    fetch(`${API_BASE_URL}/${eventId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            if (res.ok) {
                alert(`Success! Status changed to ${newStatus}`);
                loadEvents();
            } else {
                alert("Error updating status.");
            }
        })
        .catch(err => console.error("Update Error:", err));
}

function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark opacity-75';
        case 'APPROVED': return 'bg-success bg-opacity-10 text-success';
        case 'COMPLETED': return 'bg-primary bg-opacity-10 text-primary';
        case 'CANCELLED': return 'bg-danger bg-opacity-10 text-danger';
        default: return 'bg-secondary';
    }
}

function deleteEvent(eventId) {
    if (confirm("Are you sure you want to cancel this event?")) {
        updateStatus(eventId, 'CANCELLED');
    }
}

function logout() {
    if (confirm("Logout from EventPro?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}