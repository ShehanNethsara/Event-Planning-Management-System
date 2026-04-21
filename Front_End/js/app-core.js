function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };
}

function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    }
}

// function logout() {
//     localStorage.clear();
//     window.location.href = 'login.html';
// }
function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.clear(); // Token සහ Role මකනවා
        window.location.href = 'login.html';
    }
}