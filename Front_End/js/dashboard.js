// Backend API URL
const API_BASE_URL = 'http://localhost:8080/api/v1/events';

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // 1. Check if user is logged in
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = 'login.html';
        return;
    }

    // Display user role or name
    document.getElementById('userDisplayName').innerText = `Welcome, ${userRole || 'User'}`;

    // 2. Initial Data Load
    loadEvents();

    // 3. Handle Event Booking Submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const eventData = {
                title: document.getElementById('eventTitle').value,
                type: document.getElementById('eventType').value,
                date: document.getElementById('eventDate').value,
                description: document.getElementById('eventDescription').value,
                clientId: 1 // In production, this should come from user session/token
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

                        // Close the Modal
                        const modalElement = document.getElementById('addEventModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        modal.hide();

                        // Reset form and reload table
                        eventForm.reset();
                        loadEvents();
                    } else {
                        alert("Failed to book event. Please check your connection.");
                    }
                })
                .catch(error => {
                    console.error("Error booking event:", error);
                    alert("Server error occurred.");
                });
        });
    }
});

// Function to Fetch and Load Events to Table
function loadEvents() {
    const token = localStorage.getItem('token');

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
            tableBody.innerHTML = ''; // Clear current rows

            let pendingCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;

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
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            });

            // Update Statistics
            document.getElementById('totalEvents').innerText = data.length;
            document.getElementById('pendingCount').innerText = pendingCount;
        })
        .catch(err => {
            console.error("Load Error:", err);
        });
}

// Helper function to color code status
function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success';
        case 'COMPLETED': return 'bg-primary';
        case 'CANCELLED': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Logout Function
function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

// Delete Event Logic (Optional Placeholder)
function deleteEvent(eventId) {
    alert("Delete functionality can be added here for Event ID: " + eventId);
}