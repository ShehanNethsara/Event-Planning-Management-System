
$(document).ready(function() {
    const payingAmount = localStorage.getItem('payingAmount');
    const invoiceId = localStorage.getItem('payingInvoiceId');

    if (!invoiceId) {
        // Invoice එකක් තෝරාගෙන නැත්නම්, මුලින්ම Invoice පේජ් එකට යවනවා
        alert("Please select an invoice first from 'My Invoices' to proceed with payment.");
        window.location.href = 'my_reports.html';
        return;
    }

    // ඉතිරි payment logic එක...
    $('#amountDisplay').text("LKR " + payingAmount);
});