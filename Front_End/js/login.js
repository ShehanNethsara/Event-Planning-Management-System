document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (!emailField || !passwordField) {
        alert("Error: Input fields not found. Check HTML IDs in login.html");
        return;
    }

    const email = emailField.value.trim(); // හිස් ඉඩ (spaces) අයින් කිරීම
    const password = passwordField.value;

    const loginBtn = e.target.querySelector('button');
    if(loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verifying...';
    }

    fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                // Backend එකෙන් එන Error එක බලමු
                return response.json().then(err => {
                    throw new Error(err.message || 'Invalid Email or Password');
                }).catch(() => {
                    throw new Error('Connection failed or Server Error (500)');
                });
            }
            return response.json();
        })
        .then(data => {
            // 1. Data localStorage එකේ Save කිරීම
            // Backend එකෙන් එන දත්ත වල හැටි අනුව data.token හෝ data.data.token විය හැක.
            // ඔයාගේ Backend එකේ response එක බලන්න.
            localStorage.setItem('token', data.token);

            // Role එක හැමවිටම කැපිටල් කරලා සේව් කරමු (ADMIN, USER, etc.)
            const userRole = data.role ? data.role.toUpperCase() : "USER";
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userEmail', email);

            console.log("Success! Role Received:", userRole);

            // 2. Role-Based Redirection
            // ෆයිල් එකේ නම 'adminDashboard.html' ද නැත්නම් 'admindashboard.html' ද බලන්න.
            // පද්ධතියේ තියෙන නමම මෙතනට දෙන්න.
            if (userRole === 'ADMIN') {
                window.location.href = 'adminDashboard.html';
            }
            else if (userRole === 'VENDOR' || userRole === 'STAFF') {
                window.location.href = 'dashboard.html';
            }
            else if (userRole === 'CLIENT' || userRole === 'USER') {
                window.location.href = 'user_dashboard.html';
            }
            else {
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Login Error Detailed:', error);
            alert('Login Failed: ' + error.message);

            if(loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
});