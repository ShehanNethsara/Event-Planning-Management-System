const VENDOR_API = 'http://localhost:8080/api/v1/vendors';
const EVENT_API = 'http://localhost:8080/api/v1/events';
const token = localStorage.getItem('token');
const userEmail = localStorage.getItem('userEmail');

$(document).ready(function() {
    // 1. Auth Guard - ලොග් වෙලා නැත්නම් පන්නන්න
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // පේජ් එකේ තියෙන Table/Container අනුව අදාළ දත්ත Load කරමු
    if ($("#vendorContainer").length) {
        loadVendors(); // Admin සඳහා Vendors පෙන්වීමට
    }

    if ($("#vendorRequestsBody").length) {
        loadVendorTasks(); // Vendor සඳහා Requests පෙන්වීමට
    }

    // 2. Vendor Register Form එක Submit කිරීම (Admin Side)
    $("#vendorRegForm").on("submit", function(e) {
        e.preventDefault();

        const vendorData = {
            name: $("#vName").val(),
            category: $("#vCat").val(),
            contact: $("#vPhone").val(),
            price: parseFloat($("#vPrice").val())
        };

        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).text('Registering...');

        $.ajax({
            url: VENDOR_API + "/add",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(vendorData),
            success: function(response) {
                alert("Vendor Registered Successfully! 🚀");
                $("#addVendorModal").modal('hide');
                $("#vendorRegForm")[0].reset();
                loadVendors();
            },
            error: function(err) {
                alert("Failed to register vendor.");
            },
            complete: function() {
                submitBtn.prop('disabled', false).text('Register Now');
            }
        });
    });
});

// --- ADMIN FUNCTIONS ---

function loadVendors(filter = "ALL") {
    const url = (filter === "ALL") ? `${VENDOR_API}/all` : `${VENDOR_API}/category/${filter}`;

    $.ajax({
        url: url,
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(data) {
            const container = $("#vendorContainer");
            container.empty();

            if (!data || data.length === 0) {
                container.html('<div class="text-center py-5 text-muted">No vendors found.</div>');
                $("#vendorCount").text("Total: 0");
                return;
            }

            data.forEach(vendor => {
                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card vendor-card border-0 shadow-sm p-3">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                    <i class="${getCategoryIcon(vendor.category)} text-primary fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0">${vendor.name}</h6>
                                    <span class="badge bg-light text-primary small">${vendor.category}</span>
                                </div>
                            </div>
                            <div class="small text-muted mb-3">
                                <p class="mb-1"><i class="fas fa-phone-alt me-2"></i>${vendor.contact || 'N/A'}</p>
                                <p class="mb-0"><i class="fas fa-tag me-2"></i>LKR ${vendor.price ? vendor.price.toLocaleString() : '0'}</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-danger w-100 rounded-pill" onclick="deleteVendor(${vendor.id})">
                                    <i class="fas fa-trash me-1"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>`;
                container.append(card);
            });
            $("#vendorCount").text("Total: " + data.length);
        }
    });
}

function deleteVendor(id) {
    if (confirm("Are you sure you want to remove this vendor?")) {
        $.ajax({
            url: `${VENDOR_API}/${id}`,
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token },
            success: function() {
                alert("Vendor removed!");
                loadVendors();
            },
            error: function() { alert("Could not delete vendor."); }
        });
    }
}

// --- VENDOR DASHBOARD FUNCTIONS ---

function loadVendorTasks() {
    const vEmail = localStorage.getItem('userEmail');

    $.ajax({
        url: `${EVENT_API}/vendor-requests?email=${vEmail}`,
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            let rows = "";
            if (events.length === 0) {
                rows = '<tr><td colspan="4" class="text-center py-4 text-muted">No pending job requests.</td></tr>';
            } else {
                events.forEach(event => {
                    rows += `
                    <tr>
                        <td class="fw-bold">#${event.id}</td>
                        <td>${event.type}</td>
                        <td><i class="far fa-calendar-alt me-2"></i>${event.date}</td>
                        <td class="text-center">
                            <button class="btn btn-success btn-sm rounded-pill px-3" onclick="respondToRequest(${event.id}, 'CONFIRMED')">Accept</button>
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3 ms-1" onclick="respondToRequest(${event.id}, 'REJECTED')">Reject</button>
                        </td>
                    </tr>`;
                });
            }
            $("#vendorRequestsBody").html(rows);
            $("#reqCount").text(events.length + " New");
        }
    });
}

function respondToRequest(eventId, newStatus) {
    if(!confirm(`Do you want to ${newStatus.toLowerCase()} this request?`)) return;

    $.ajax({
        url: `${EVENT_API}/${eventId}/status?status=${newStatus}`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        success: function() {
            alert("Success! Status updated to " + newStatus);
            loadVendorTasks();
        },
        error: function() { alert("Error updating status."); }
    });
}

// Global functions for HTML access
function filterVendors() {
    loadVendors($("#filterType").val());
}

function getCategoryIcon(cat) {
    switch(cat) {
        case 'CATERING': return 'fas fa-utensils';
        case 'PHOTOGRAPHY': return 'fas fa-camera';
        case 'MUSIC': return 'fas fa-music';
        case 'DECORATION': return 'fas fa-holly-berry';
        default: return 'fas fa-store';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}