const API_URL = "http://localhost:8080/api/v1/events";
const VENDOR_API = "http://localhost:8080/api/v1/vendors";
const token = localStorage.getItem('token');

$(document).ready(function() {
    loadDashboardStats();
    loadAllRequests();
});

function loadDashboardStats() {
    $.ajax({
        url: API_URL + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            $('#totalEvents').text(events.length < 10 ? "0" + events.length : events.length);
            const pending = events.filter(e => e.status === "PENDING").length;
            $('#pendingRequests').text(pending < 10 ? "0" + pending : pending);
        }
    });
}

function loadAllRequests() {
    const tableBody = $('#adminTableBody');
    tableBody.html('<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>');

    // මුලින්ම Vendors ලා අරන් එමු Dropdown එක පුරවන්න
    $.ajax({
        url: VENDOR_API + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(vendors) {

            // දැන් Events අරන් එමු
            $.ajax({
                url: API_URL + "/all",
                method: "GET",
                headers: { "Authorization": "Bearer " + token },
                success: function(events) {
                    let rows = "";
                    if (events.length === 0) {
                        rows = `<tr><td colspan="5" class="text-center py-4 text-muted">No requests found.</td></tr>`;
                    } else {
                        events.forEach(event => {
                            let statusClass = (event.status === "APPROVED") ? "bg-success text-success" : "bg-warning text-warning";

                            // Vendor Dropdown එක හදමු (Pending ඒවට විතරක් Vendor කෙනෙක් තෝරන්න දෙමු)
                            let vendorOptions = `<option value="">Assign Vendor</option>`;
                            vendors.forEach(v => {
                                vendorOptions += `<option value="${v.id}">${v.name} (${v.category})</option>`;
                            });

                            let actionHtml = "";
                            if (event.status === "PENDING") {
                                actionHtml = `
                                    <div class="d-flex flex-column gap-1">
                                        <select id="vSelect_${event.id}" class="form-select form-select-sm border-primary">
                                            ${vendorOptions}
                                        </select>
                                        <button class="btn btn-sm btn-primary py-1" onclick="approveWithVendor(${event.id})">
                                            Assign & Approve
                                        </button>
                                    </div>`;
                            } else {
                                actionHtml = `<span class="text-muted small">Assigned: ${event.vendorName || 'N/A'}</span>`;
                            }

                            rows += `
                                <tr>
                                    <td><div class="fw-bold">${event.clientName || 'Client'}</div><small>#${event.id}</small></td>
                                    <td><span class="badge bg-primary bg-opacity-10 text-primary">${event.type}</span></td>
                                    <td>${event.date}</td>
                                    <td><span class="badge ${statusClass} bg-opacity-10 rounded-pill">${event.status}</span></td>
                                    <td style="width: 200px;">${actionHtml}</td>
                                </tr>`;
                        });
                    }
                    tableBody.html(rows);
                }
            });
        }
    });
}

function approveWithVendor(eventId) {
    const vendorId = $(`#vSelect_${eventId}`).val();
    if (!vendorId) {
        alert("Please select a vendor to assign for this event!");
        return;
    }

    if (confirm("Assign this vendor and approve the event?")) {
        $.ajax({
            url: `${API_URL}/${eventId}/assign-vendor?vendorId=${vendorId}&status=APPROVED`,
            method: "PUT",
            headers: { "Authorization": "Bearer " + token },
            success: function() {
                alert("Success! Vendor assigned and Event Approved.");
                loadAllRequests();
                loadDashboardStats();
            },
            error: function(err) { alert("Error: " + err.responseText); }
        });
    }

    function assignToVendor(eventId) {
        const vendorId = $(`#vSelect_${eventId}`).val();
        if (!vendorId) {
            alert("Please select a vendor first!");
            return;
        }

        $.ajax({
            url: `http://localhost:8080/api/v1/events/${eventId}/assign-vendor?vendorId=${vendorId}&status=REQUESTED`,
            method: "PUT",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
            success: function() {
                alert("Request sent to Vendor!");
                loadAllRequests();
            }
        });
    }
}