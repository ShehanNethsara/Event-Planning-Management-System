document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (!emailField || !passwordField) {
        alert("Error: Input fields not found. Check HTML IDs in login.html");
        return;
    }

    const email = emailField.value.trim();
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
                return response.json().then(err => {
                    throw new Error(err.message || 'Invalid Email or Password');
                }).catch(() => {
                    throw new Error('Connection failed or Server Error (500)');
                });
            }
            return response.json();
        })
        .then(data => {
            // 1. Token එක save කිරීම
            localStorage.setItem('token', data.token);

            // 2. Role එක නිවැරදිව Format කරගැනීම
            // Spring Security එවන්නේ "ROLE_ADMIN" නම් අපිට ඒක "ADMIN" විදිහට ගන්න මෙන්න මේ includes ලොජික් එක ඕනේ
            const userRole = data.role ? data.role.toUpperCase() : "USER";
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userEmail', email);

            console.log("Login Success! Role:", userRole);

            // 3. Role එක අනුව Redirect කිරීම
            if (userRole.includes('ADMIN')) {
                window.location.href = 'adminDashboard.html';
            }
            else if (userRole.includes('VENDOR') || userRole.includes('STAFF')) {
                window.location.href = 'dashboard.html';
            }
            else if (userRole.includes('CLIENT') || userRole.includes('USER')) {
                window.location.href = 'user_dashboard.html';
            }
            else {
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Detailed Error:', error);
            alert('Login Failed: ' + error.message);

            if(loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
});