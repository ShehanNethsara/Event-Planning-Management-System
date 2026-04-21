const VENDOR_API = "http://localhost:8080/api/v1/vendors";
const currentRole = localStorage.getItem('userRole');

if (!currentRole) {
    window.location.href = 'login.html';
}

$(document).ready(function() {
    loadVendors("ALL");
});

function loadVendors(type) {
    const url = type === "ALL" ? `${VENDOR_API}/all` : `${VENDOR_API}/category/${type}`;

    $.get(url, function(data) {
        let html = "";
        data.forEach(v => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <span class="badge bg-soft-primary text-primary mb-2">${v.type}</span>
                            <h5 class="card-title fw-bold">${v.name}</h5>
                            <p class="text-muted small mb-3">${v.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-success">Rs. ${v.priceRange}</span>
                                <button class="btn btn-sm btn-outline-primary">Contact</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        $('#vendorContainer').html(html);
    });
}