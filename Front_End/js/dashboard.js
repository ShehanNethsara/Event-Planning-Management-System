const API_BASE_URL = 'http://localhost:8080/api/v1/events';
const currentRole = localStorage.getItem('userRole');

if (!currentRole) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userDisplayName').innerText = `Welcome, ${userRole || 'User'}`;


    loadEvents();

    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const eventData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                description: document.getElementById('eventDescription').value,
                clientId: 1
            };

            fetch(`${API_BASE_URL}/book`, {
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


                        const modalElement = document.getElementById('addEventModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) modal.hide();

                        eventForm.reset();
                        loadEvents();
                    } else {
                        alert("Failed to book event. Please check your connection or permissions.");
                    }
                })
                .catch(error => {
                    console.error("Error booking event:", error);
                    alert("Server error occurred.");
                });
        });
    }
});

function loadEvents() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    fetch(`${API_BASE_URL}/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch data");
            return res.json();
        })
        .then(data => {
            const tableBody = document.getElementById('eventTableBody');
            tableBody.innerHTML = '';

            let pendingCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;

                let actionButtons = '';
                if (userRole === 'ADMIN' && event.status === 'PENDING') {
                    actionButtons = `
                    <button class="btn btn-sm btn-success me-1" onclick="updateStatus(${event.id}, 'APPROVED')">
                        <i class="bi bi-check-circle"></i> Approve
                    </button>`;
                }

                actionButtons += `
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">
                    <i class="bi bi-trash"></i>
                </button>`;

                tableBody.innerHTML += `
                <tr>
                    <td class="fw-bold">${event.title}</td>
                    <td>${event.date}</td>
                    <td><span class="badge bg-light text-dark border">${event.type}</span></td>
                    <td>
                        <span class="badge ${getStatusClass(event.status)}">
                            ${event.status}
                        </span>
                    </td>
                    <td class="text-center">
                        ${actionButtons}
                    </td>
                </tr>
            `;
            });

            // Update Dashboard
            document.getElementById('totalEvents').innerText = data.length;
            document.getElementById('pendingCount').innerText = pendingCount;
        })
        .catch(err => {
            console.error("Load Error:", err);
        });
}

function updateStatus(eventId, newStatus) {
    const token = localStorage.getItem('token');

    if (!confirm(`Are you sure you want to set this event to ${newStatus}?`)) return;

    fetch(`${API_BASE_URL}/${eventId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.ok) {
                alert(`Event ${newStatus} Successfully!`);
                loadEvents();
            } else {
                alert("Failed to update status. Check Admin permissions.");
            }
        })
        .catch(err => console.error("Update Error:", err));
}


function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success';
        case 'COMPLETED': return 'bg-primary';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
    }
}


function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}


function deleteEvent(eventId) {
    if (confirm("Are you sure you want to cancel/delete this event?")) {
        updateStatus(eventId, 'CANCELLED');
    }
}