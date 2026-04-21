$(document).ready(function() {
    // 1. පද්ධතියට ලොග් වෙලාද බලමු
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // ආරම්භයේදී දත්ත ලෝඩ් කරමු
    loadServiceRequests();
    loadMyServices();

    // --- 2. NAVIGATION (TAB SWITCHING) LOGIC ---

    // Dashboard (Requests) පෙන්වීමට
    $("#showRequests").click(function(e) {
        e.preventDefault();
        setActiveTab($(this), $("#requestsSection"));
        setInactiveTab($("#showMyServices"), $("#myServicesSection"));
    });

    // My Services පෙන්වීමට
    $("#showMyServices").click(function(e) {
        e.preventDefault();
        setActiveTab($(this), $("#myServicesSection"));
        setInactiveTab($("#showRequests"), $("#requestsSection"));
    });

    function setActiveTab(btn, section) {
        btn.addClass("active-link bg-primary text-white").removeClass("text-white-50");
        section.fadeIn(400);
    }

    function setInactiveTab(btn, section) {
        btn.removeClass("active-link bg-primary text-white").addClass("text-white-50");
        section.hide();
    }

    // --- 3. සේවාවන් ඇතුළත් කිරීමේ LOGIC ---
    $("#vendorServiceForm").on("submit", function(e) {
        e.preventDefault();

        const serviceData = {
            category: $("#serviceCat").val(),
            price: $("#servicePrice").val(),
            vendorEmail: userEmail,
            status: "ACTIVE"
        };

        // දැනට පේජ් එකේ ටේබල් එකට දත්ත එකතු කිරීම (Frontend only)
        const newServiceRow = `
            <tr>
                <td><span class="fw-bold text-dark">${serviceData.category}</span></td>
                <td>LKR ${serviceData.price}</td>
                <td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Active</span></td>
                <td>Expert</td>
            </tr>`;

        $("#myServicesList").prepend(newServiceRow);

        // Modal එක වසා පිරිසිදු කිරීම
        $("#addServiceModal").modal('hide');
        $("#vendorServiceForm")[0].reset();
        alert(serviceData.category + " service has been added to your profile!");
    });
});

// --- 4. DATA LOADING FUNCTIONS ---

function loadServiceRequests() {
    // Admin විසින් මේ Vendor ට අදාළව එවන ලද වැඩ (Tasks)
    // දැනට Dummy Data ලෙස පෙන්වමු
    const dummyRequests = [
        { id: 101, event: 'Wedding Ceremony', date: '2026-05-20', service: 'Catering', status: 'PENDING' },
        { id: 102, event: 'Corporate Launch', date: '2026-06-12', service: 'Photography', status: 'PENDING' }
    ];

    let rows = "";
    dummyRequests.forEach(req => {
        rows += `
        <tr>
            <td class="fw-bold text-primary">#SRQ-${req.id}</td>
            <td><div class="fw-bold">${req.event}</div></td>
            <td><i class="far fa-calendar-alt me-2 text-muted"></i>${req.date}</td>
            <td><span class="badge bg-info bg-opacity-10 text-info rounded-pill px-3">${req.service}</span></td>
            <td><span class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3">${req.status}</span></td>
            <td>
                <button class="btn btn-sm btn-success rounded-pill px-3 shadow-sm" onclick="acceptReq(${req.id})">
                    <i class="fas fa-check me-1"></i> Accept
                </button>
            </td>
        </tr>`;
    });
    $("#vendorRequestsBody").html(rows);
}

function loadMyServices() {
    // Vendor විසින් පද්ධතියට ලබා දෙන සේවාවන්
    const dummyServices = [
        { category: 'Photography', price: '75,000 - 150,000', status: 'ACTIVE', exp: 'Professional' }
    ];

    let rows = "";
    dummyServices.forEach(s => {
        rows += `
        <tr>
            <td><span class="fw-bold text-dark">${s.category}</span></td>
            <td>LKR ${s.price}</td>
            <td><span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">${s.status}</span></td>
            <td>${s.exp}</td>
        </tr>`;
    });
    $("#myServicesList").html(rows);
}

// --- 5. INTERACTION FUNCTIONS ---

function acceptReq(id) {
    if(confirm("Do you want to accept this service request?")) {
        alert("Request #" + id + " Accepted! Admin will contact you shortly.");
    }
}

function logout() {
    if(confirm("Are you sure you want to logout from Vendor Portal?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}