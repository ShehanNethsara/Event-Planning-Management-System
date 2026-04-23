document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');
    const loginBtn = e.target.querySelector('button');

    if (!emailField || !passwordField) return;

    const email = emailField.value.trim();
    const password = passwordField.value;

    if(loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verifying...';
    }

    fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Invalid Credentials'); });
            }
            return response.json();
        })
        .then(data => {
            console.log("Backend Response:", data);


            const tokenToStore = data.token;
            const roleToStore = data.role ? data.role.toUpperCase() : "CLIENT";

            // Backend එකෙන් ID එක ආවේ නැත්නම් තාවකාලිකව "1" ලෙස සේව් කරයි
            const userIdToStore = data.userId || data.id || data.user_id ;

            localStorage.setItem('token', tokenToStore);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', roleToStore);
            localStorage.setItem('userId', userIdToStore);

            console.log("Login Successful. Role:", roleToStore);

            setTimeout(() => {
                if (roleToStore.includes('ADMIN')) {
                    window.location.href = 'adminDashboard.html';
                } else if (roleToStore.includes('VENDOR') || roleToStore.includes('STAFF')) {
                    window.location.href = 'vendor_dashboard.html';
                } else {
                    window.location.href = 'user_dashboard.html';
                }
            }, 500);
        })
        .catch(error => {
            alert('Login Failed: ' + error.message);
            if(loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
});