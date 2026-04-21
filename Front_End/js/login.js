document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (!emailField || !passwordField) {
        alert("Error: Input fields not found. Check HTML IDs in login.html");
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;

    // Button එක disable කරමු double clicks වළක්වන්න
    const loginBtn = e.target.querySelector('button');
    if(loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
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
                return response.json().then(err => {
                    throw new Error(err.message || 'Invalid Credentials');
                }).catch(() => {
                    throw new Error('Server error (500). Please check Backend Console.');
                });
            }
            return response.json();
        })
        .then(data => {
            // 1. Data localStorage එකේ Save කිරීම
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role.toUpperCase());
            localStorage.setItem('userEmail', email);

            // 2. Welcome Message එකක් පෙන්වීම
            const userName = email.split('@')[0].toUpperCase();
            alert(`Welcome Back, ${userName}!`);

            const role = data.role.toUpperCase();
            console.log("Login Success. Redirecting for Role:", role);

            // 3. Role-Based Redirection
            setTimeout(() => {
                if (role === 'ADMIN') {
                    window.location.href = 'adminDashboard.html';
                }
                else if (role === 'VENDOR' || role === 'STAFF') {
                    window.location.href = 'dashboard.html';
                }
                else if (role === 'CLIENT' || role === 'USER') {
                    window.location.href = 'user_dashboard.html';
                }
                else {
                    window.location.href = 'index.html';
                }
            }, 500); // පොඩි delay එකක් දාමු smooth වෙන්න
        })
        .catch(error => {
            console.error('Login Error:', error);
            alert('Login Failed: ' + error.message);

            // Error එකකදී ආපහු button එක enable කිරීම
            if(loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
});