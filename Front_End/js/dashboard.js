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

// Category එක අනුව ගැලපෙන High-Quality පින්තූරයක් තෝරාගැනීම
function getEventImage(category) {
    const images = {
        'WEDDING': 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
        'BIRTHDAY': 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600&auto=format&fit=crop',
        'CORPORATE': 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
        'CONCERT': 'https://images.unsplash.com/photo-1459749411177-042180ce6742?q=80&w=600&auto=format&fit=crop',
        'DEFAULT': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop'
    };
    return images[category?.toUpperCase()] || images['DEFAULT'];
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
                clientId: parseInt(userId)
            };

            const submitBtn = eventForm.querySelector('button[type="submit"]');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
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
                        alert("Event Booked Successfully!");
                        eventForm.reset();
                        window.location.href = 'user_dashboard.html';
                    } else {
                        const errorData = await response.json();
                        alert("Failed: " + (errorData.message || "Server Error"));
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
            // Table body එක හෝ Card container එක තෝරාගැනීම
            const container = document.getElementById('userEventBody') || document.getElementById('eventTableBody') || document.getElementById('adminTableBody');
            if (!container) return;

            container.innerHTML = '';

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="col-12 text-center py-5 text-muted">No events found in your portfolio.</div>';
                return;
            }

            let pendingCount = 0, approvedCount = 0, completedCount = 0;

            data.forEach(event => {
                if (event.status === 'PENDING') pendingCount++;
                if (event.status === 'APPROVED') approvedCount++;
                if (event.status === 'COMPLETED') completedCount++;

                // User Dashboard එක සඳහා Card Layout එක (පින්තූර සහිතව)
                if (document.getElementById('userEventBody')) {
                    container.innerHTML += `
                <div class="event-card shadow-lg" style="background: #111827; border-radius: 24px; overflow: hidden; border: 1px solid #1f2937; margin-bottom: 20px;">
                    <div style="height: 160px; background-image: url('${getEventImage(event.type)}'); background-size: cover; background-position: center; position: relative;">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, #111827, transparent);"></div>
                    </div>
                    <div style="padding: 20px;">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="fw-bold m-0">${event.title}</h5>
                            <span class="badge ${getStatusClass(event.status)} rounded-pill">${event.status}</span>
                        </div>
                        <p class="text-muted small mb-3"><i class="fas fa-tag me-2"></i>${event.type}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-white-50"><i class="far fa-calendar-alt me-1"></i> ${event.date}</small>
                            <div class="btn-group">
                                ${event.status === 'APPROVED' ? `<a href="invoice_view.html?id=${event.id}" class="btn btn-sm btn-info text-white"><i class="fas fa-file-invoice"></i></a>` : ''}
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteEvent(${event.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
                // Admin Table එක සඳහා පරණ Row Layout එක
                else {
                    container.innerHTML += `
                <tr class="align-middle">
                    <td><div class="fw-bold">${event.title}</div><small class="text-muted">${event.type}</small></td>
                    <td><i class="far fa-calendar-alt me-2 text-primary"></i>${event.date}</td>
                    <td><span class="badge ${getStatusClass(event.status)} rounded-pill px-3">${event.status}</span></td>
                    <td class="text-center">
                        ${userRole === 'ADMIN' && event.status === 'PENDING' ?
                        `<button class="btn btn-sm btn-success me-1" onclick="updateStatus(${event.id}, 'APPROVED')"><i class="fas fa-check"></i> Approve</button>` : ''}
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
                }
            });

            updateCounters(data.length, pendingCount, approvedCount, completedCount);
        })
        .catch(err => console.error("Load Error:", err));
}

function updateStatus(eventId, newStatus) {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    fetch(`${API_BASE_URL}/update-status?id=${eventId}&status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            if (res.ok) {
                alert("Status Updated!");
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
    if (confirm("Are you sure you want to cancel this event?")) {
        updateStatus(eventId, 'CANCELLED');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}