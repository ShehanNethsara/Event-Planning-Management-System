// --- CONFIGURATION ---
const API_URL = "http://localhost:8080/api/v1/events";
const VENDOR_API = "http://localhost:8080/api/v1/vendors";
const USER_API = "http://localhost:8080/api/v1/users";
const CAT_API = "http://localhost:8080/api/v1/categories";
const token = localStorage.getItem('token');

$(document).ready(function() {
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // ආරම්භයේදීම Dashboard Overview එක පෙන්වයි
    showDashboard();
});

// --- SECTION TOGGLE LOGIC ---

function hideAllSections() {
    $("#sectionStats, .row, canvas, #sectionEvents, #sectionClients, #sectionPayments, #sectionCategories, #sectionInvoices").hide();
    $(".nav-link").removeClass("active-link bg-white bg-opacity-10 text-white").addClass("text-white-50");
}

function showDashboard() {
    hideAllSections();
    $("#sectionStats, .row, #bookingChart, #sectionEvents").fadeIn();
    loadDashboardStats();
    loadAllRequests();
}

function showClients() {
    hideAllSections();
    $("#sectionClients").fadeIn();
    loadAllClients();
}

function showPayments() {
    hideAllSections();
    $("#sectionPayments").fadeIn();
    loadPaymentRequests();
}

function showCategories() {
    hideAllSections();
    $("#sectionCategories").fadeIn();
    loadCategories();
}

function showInvoices() {
    hideAllSections();
    $("#sectionInvoices").fadeIn();
    loadInvoiceList();
}

// --- DATA LOADING FUNCTIONS ---

function loadDashboardStats() {
    $.ajax({
        url: API_URL + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            const total = events.length;
            const pending = events.filter(e => e.status === "PENDING" || e.status === "REQUESTED").length;

            $('#totalEvents, #statTotalEvents').text(total < 10 ? "0" + total : total);
            $('#pendingRequests, #statPendingEvents').text(pending < 10 ? "0" + pending : pending);

            let revenue = 0;
            events.forEach(e => {
                if(e.status === "PAID") revenue += 150000; // Backend එකේ මිලක් නැති නිසා default අගයක් ගත්තා
            });
            $("#statTotalRevenue").text(revenue.toLocaleString());

            renderChart(events);
        }
    });
}

function loadAllRequests() {
    const tableBody = $('#adminTableBody');
    tableBody.html('<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>');

    $.ajax({
        url: VENDOR_API + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(vendors) {
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
                            let statusClass = (event.status === "PENDING") ? "bg-warning text-warning" : "bg-success text-success";

                            let vendorOptions = `<option value="">Choose Vendor</option>`;
                            vendors.forEach(v => {
                                vendorOptions += `<option value="${v.id}">${v.name}</option>`;
                            });

                            let actionHtml = (event.status === "PENDING") ?
                                `<div class="d-flex gap-1">
                                    <select id="vSelect_${event.id}" class="form-select form-select-sm">${vendorOptions}</select>
                                    <button class="btn btn-sm btn-primary" onclick="assignVendor(${event.id})">Assign</button>
                                </div>` : `<span class="text-success small fw-bold">PROCESSED</span>`;

                            rows += `<tr>
                                <td><b>${event.clientName || 'Client'}</b><br><small class='text-muted'>#${event.id}</small></td>
                                <td><span class="badge bg-primary bg-opacity-10 text-primary">${event.type}</span></td>
                                <td>${event.date}</td>
                                <td><span class="badge ${statusClass} bg-opacity-10 rounded-pill px-3">${event.status}</span></td>
                                <td>${actionHtml}</td>
                            </tr>`;
                        });
                    }
                    tableBody.html(rows);
                }
            });
        }
    });
}

function loadAllClients() {
    $("#clientTableBody").html('<tr><td colspan="3" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>');
    $.ajax({
        url: USER_API + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(users) {
            const clients = users.filter(u => u.role === "CLIENT");
            let rows = "";
            clients.forEach(c => {
                rows += `<tr><td><b>${c.name}</b></td><td>${c.email}</td><td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Active</span></td></tr>`;
            });
            $("#clientTableBody").html(rows || '<tr><td colspan="3" class="text-center">No clients found.</td></tr>');
        }
    });
}

function loadCategories() {
    const categoryTable = $("#categoryTableBody");
    categoryTable.html('<tr><td colspan="3" class="text-center py-4"><div class="spinner-border text-info"></div></td></tr>');

    $.ajax({
        url: CAT_API + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(categories) {
            let rows = "";
            categories.forEach(cat => {
                rows += `<tr><td><b>${cat.name}</b></td><td>${cat.description || 'General Service'}</td><td class="text-center"><button class="btn btn-sm text-danger" onclick="deleteCategory(${cat.id})"><i class="fas fa-trash"></i></button></td></tr>`;
            });
            categoryTable.html(rows || '<tr><td colspan="3" class="text-center">No categories found.</td></tr>');
        }
    });
}

function loadInvoiceList() {
    const tableBody = $("#invoiceTableBody");
    tableBody.html('<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-danger"></div></td></tr>');

    $.ajax({
        url: API_URL + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            const paidEvents = events.filter(e => e.status === "PAID");
            let rows = "";
            if (paidEvents.length === 0) {
                rows = '<tr><td colspan="5" class="text-center py-4 text-muted">No paid invoices found.</td></tr>';
            } else {
                paidEvents.forEach(e => {
                    rows += `
                <tr>
                    <td><b>INV-${e.id}</b></td>
                    <td>${e.clientName || 'User'}</td>
                    <td>${e.type}</td>
                    <td>LKR 150,000.00</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger px-3" onclick='generatePDF(${JSON.stringify(e)})'>
                            <i class="fas fa-file-pdf me-1"></i> PDF
                        </button>
                    </td>
                </tr>`;
                });
            }
            tableBody.html(rows);
        }
    });
}

function loadPaymentRequests() {
    const paymentTable = $("#paymentTableBody");
    paymentTable.html('<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-success"></div></td></tr>');

    $.ajax({
        url: API_URL + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(events) {
            const pendingPayments = events.filter(e => e.status === "CONFIRMED" || e.status === "APPROVED");
            let rows = "";
            pendingPayments.forEach(e => {
                rows += `<tr>
                    <td><b>#${e.id}</b></td>
                    <td>${e.clientName || 'Client'}</td>
                    <td><b>150,000.00</b></td>
                    <td><span class="badge bg-info bg-opacity-10 text-info">Pending Payment</span></td>
                    <td class="text-center"><button class="btn btn-success btn-sm rounded-pill px-3" onclick="approvePayment(${e.id})">Confirm Paid</button></td>
                </tr>`;
            });
            paymentTable.html(rows || '<tr><td colspan="5" class="text-center">No pending payments.</td></tr>');
        }
    });
}

// --- ACTION FUNCTIONS ---

function showAddCategoryModal() {
    const name = prompt("Enter New Category Name:");
    if (name) {
        $.ajax({
            url: CAT_API + "/save",
            method: "POST",
            headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
            data: JSON.stringify({ name: name, description: "System Category" }),
            success: function() {
                alert("Category Added Successfully!");
                loadCategories();
            }
        });
    }
}

function assignVendor(eventId) {
    const vId = $(`#vSelect_${eventId}`).val();
    if(!vId) return alert("Please select a vendor!");

    $.ajax({
        url: `${API_URL}/${eventId}/assign-vendor?vendorId=${vId}&status=REQUESTED`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        success: function() {
            alert("Vendor Assigned Successfully!");
            loadAllRequests();
            loadDashboardStats();
        }
    });
}

function approvePayment(eventId) {
    if(!confirm("Did you verify this payment?")) return;
    $.ajax({
        url: `${API_URL}/${eventId}/status?status=PAID`,
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        success: function() {
            alert("Payment Confirmed! 💰");
            showDashboard();
        }
    });
}

function renderChart(events) {
    const ctx = document.getElementById('bookingChart')?.getContext('2d');
    if (!ctx) return;
    const monthlyData = new Array(12).fill(0);
    events.forEach(e => {
        if(e.date) monthlyData[new Date(e.date).getMonth()]++;
    });

    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ label: 'Bookings', data: monthlyData, borderColor: '#0d6efd', tension: 0.4 }]
        }
    });
}

function generatePDF(eventData) {
    alert("Generating PDF for Invoice ID: " + eventData.id);
    // PDF generation logic here
}
function loadAllRequests() {
    const tableBody = $('#adminTableBody');
    tableBody.html('<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>');

    $.ajax({
        url: VENDOR_API + "/all",
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function(vendors) {
            $.ajax({
                url: API_URL + "/all",
                method: "GET",
                headers: { "Authorization": "Bearer " + token },
                success: function(events) {
                    let rows = "";
                    if (!events || events.length === 0) {
                        rows = `<tr><td colspan="5" class="text-center py-4 text-muted">No requests found in Database.</td></tr>`;
                    } else {
                        events.forEach(event => {
                            let statusClass = (event.status === "PENDING") ? "bg-warning text-dark" : "bg-success text-white";

                            // Vendor Dropdown එක හදමු
                            let vendorOptions = `<option value="">Choose Vendor</option>`;
                            vendors.forEach(v => {
                                vendorOptions += `<option value="${v.id}">${v.name}</option>`;
                            });

                            let actionHtml = (event.status === "PENDING") ?
                                `<div class="d-flex gap-1">
                                    <select id="vSelect_${event.id}" class="form-select form-select-sm" style="width:130px">${vendorOptions}</select>
                                    <button class="btn btn-sm btn-primary" onclick="assignVendor(${event.id})">Assign</button>
                                </div>` : `<span class="badge bg-light text-success border">ASSIGNED</span>`;

                            // වැදගත්: මෙතන event.title පාවිච්චි කළා (event.clientName වෙනුවට)
                            rows += `<tr>
                                <td><b>${event.title || 'No Title'}</b><br><small class='text-muted'>ID: #${event.id}</small></td>
                                <td><span class="badge bg-primary bg-opacity-10 text-primary">${event.type || 'EVENT'}</span></td>
                                <td>${event.date || 'TBD'}</td>
                                <td><span class="badge ${statusClass} rounded-pill px-3">${event.status}</span></td>
                                <td>${actionHtml}</td>
                            </tr>`;
                        });
                    }
                    tableBody.hide().html(rows).fadeIn(400);
                }
            });
        }
    });
}