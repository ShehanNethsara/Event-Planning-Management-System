document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // HTML IDs පරීක්ෂා කර අගයන් ලබා ගැනීම
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (!emailField || !passwordField) {
        alert("Error: Input fields not found. Check HTML IDs in login.html");
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;

    console.log("Attempting login for:", email);

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
                return response.json().then(err => {
                    throw new Error(err.message || 'Invalid Credentials');
                }).catch(() => {
                    throw new Error('Server error (500). Please check Backend Console.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Login Success. Role:", data.role);

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email);

            alert('Welcome back!');

            // ඔයාගේ Folder එකේ තියෙන File Names වලට අනුව redirection එක මෙහෙමයි:
            const role = data.role.toUpperCase();

            if (role === 'ADMIN') {
                window.location.href = 'adminDashboard.html'; // හරි
            }
            else if (role === 'VENDOR' || role === 'STAFF') {
                window.location.href = 'user_dashboard.html';
            }
            else if (role === 'CLIENT' || role === 'USER') {
                window.location.href = 'dashboard.html';
            }
            else {
                // කිසිවක් නැත්නම් index එකට
                window.location.href = 'index.html';
            }
        })

        .catch(error => {
            console.error('Login Error:', error);
            alert('Login Failed: ' + error.message);
        });
});