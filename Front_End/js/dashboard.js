// Backend API URL - Ensure this matches your Spring Boot server port
const API_BASE_URL = 'http://localhost:8080/api/v1/events';

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // Expected values: 'ADMIN', 'CLIENT', or 'STAFF'

    // 1. Session Check
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = 'login.html';
        return;
    }

    // Display User Role in Navbar
    document.getElementById('userDisplayName').innerText = `Welcome, ${userRole || 'User'}`;

    // 2. Initial Data Load
    loadEvents();

    // 3. Handle Event Booking Submission (For Clients)
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const eventData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                description: document.getElementById('eventDescription').value,
                clientId: 1 // In production, this should be extracted from the token/session
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

                        // Hide the Bootstrap Modal
                        const modalElement = document.getElementById('addEventModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) modal.hide();

                        eventForm.reset();
                        loadEvents(); // Refresh table data
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

/**
 * Function to Fetch and Load Events into the Table
 * Dynamically adds 'Approve' button if user is an ADMIN
 */
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
            tableBody.innerHTML = ''; // Clear existing table rows

            let pendingCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;

                // Logic to show 'Approve' button only for ADMINs on PENDING events
                let actionButtons = '';
                if (userRole === 'ADMIN' && event.status === 'PENDING') {
                    actionButtons = `
                    <button class="btn btn-sm btn-success me-1" onclick="updateStatus(${event.id}, 'APPROVED')">
                        <i class="bi bi-check-circle"></i> Approve
                    </button>`;
                }

                // Always show delete/cancel button
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

            // Update Dashboard Statistics
            document.getElementById('totalEvents').innerText = data.length;
            document.getElementById('pendingCount').innerText = pendingCount;
        })
        .catch(err => {
            console.error("Load Error:", err);
        });
}

/**
 * Function to update event status (Approve/Cancel)
 * Used primarily by Admins
 */
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
                loadEvents(); // Refresh the table
            } else {
                alert("Failed to update status. Check Admin permissions.");
            }
        })
        .catch(err => console.error("Update Error:", err));
}

/**
 * Returns Bootstrap badge classes based on event status
 */
function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success';
        case 'COMPLETED': return 'bg-primary';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

/**
 * Clears local storage and redirects to login
 */
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

/**
 * Placeholder for Delete Event Logic
 */
function deleteEvent(eventId) {
    if (confirm("Are you sure you want to cancel/delete this event?")) {
        // You can implement an actual DELETE fetch call here similar to updateStatus
        updateStatus(eventId, 'CANCELLED');
    }
}