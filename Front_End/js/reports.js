$(document).ready(function() {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail"); // ලොගින් වෙද්දී මේක සේව් කරලා තිබිය යුතුයි

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadClientInvoices();

    function loadClientInvoices() {
        $.ajax({
            url: `http://localhost:8080/api/v1/invoices/my-invoices?email=${userEmail}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function(invoices) {
                let tableBody = "";

                if (invoices.length === 0) {
                    tableBody = `<tr><td colspan="6" class="text-center">No invoices found yet.</td></tr>`;
                } else {
                    invoices.forEach(inv => {
                        tableBody += `
                        <tr>
                            <td>#INV-${inv.id}</td>
                            <td>${inv.eventTitle}</td>
                            <td>${inv.eventDate}</td>
                            <td>LKR ${inv.amount.toLocaleString()}</td>
                            <td><span class="badge ${inv.status === 'PAID' ? 'bg-success' : 'bg-warning'}">${inv.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewInvoice(${inv.id})">View</button>
                                ${inv.status === 'UNPAID' ? `<button class="btn btn-sm btn-success" onclick="payNow(${inv.id}, ${inv.amount})">Pay Now</button>` : ''}
                            </td>
                        </tr>`;
                    });
                }
                $("#invoiceTableBody").html(tableBody); // HTML table body එකේ ID එක
            },
            error: function(err) {
                console.error("Error loading invoices:", err);
            }
        });
    }
});