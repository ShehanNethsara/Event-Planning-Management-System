document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Please login first!");
        window.location.href = 'login.html';
        return;
    }

    // Token eken user data load karanna thama backend eka iwara karanna ona.
    // Danata display ekata podi msg ekak dammu.
    document.getElementById('userDisplayName').innerText = "Logged in User";

    // Future: Load events from API here
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}