document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    if (!emailField || !passwordField) {
        alert("Error: Input fields not found. Check login.html for IDs: loginEmail and loginPassword");
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
                // Error එකක් ආවොත් (401, 404, 500) ඒක handle කරනවා
                return response.json().then(err => {
                    throw new Error(err.message || 'Invalid Email or Password');
                }).catch(() => {
                    throw new Error('Server returned an error (500) or connection failed.');
                });
            }
            return response.json();
        })
        .then(data => {
            // --- වැදගත්ම පරීක්ෂාව ---
            console.log("Backend Response Data:", data); // මෙතනින් බලන්න පුළුවන් ID එක එන නම

            // Backend එකෙන් id හෝ userId කියන ඕනෑම නමකින් ආවොත් ඒක අල්ලගන්නවා
            const userIdToStore = data.userId || data.id || data.user_id;

            if (!userIdToStore) {
                console.error("CRITICAL ERROR: User ID not found in backend response!", data);
                alert("Login partially successful, but User ID was not received. Please contact admin.");
                // ID එක නැතුව ඉස්සරහට යාම අවදානම් නිසා මෙතනින් නතර කළ හැකියි
                // return;
            }

            // දත්ත localStorage එකේ සේව් කිරීම
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', userIdToStore);
            localStorage.setItem('userEmail', email);

            // Role එක නිවැරදිව අඳුරගැනීම
            const userRole = data.role ? data.role.toUpperCase() : "CLIENT";
            localStorage.setItem('userRole', userRole);

            console.log("Login Successful!");
            console.log("Stored ID:", localStorage.getItem('userId'));
            console.log("Stored Role:", userRole);

            // Role එක අනුව Redirect කිරීම
            setTimeout(() => {
                // login.js ඇතුළත Redirect කොටස
                const userRole = data.role ? data.role.toUpperCase() : "USER";

                if (userRole.includes('ADMIN')) {
                    window.location.href = 'adminDashboard.html';
                } else if (userRole.includes('VENDOR') || userRole.includes('STAFF')) {
                    // Vendor හෝ Staff නම් මේ පේජ් එකට යවනවා
                    window.location.href = 'vendor_dashboard.html';
                } else {
                    window.location.href = 'user_dashboard.html';
                }
            }, 500); // පොඩි delay එකක් දාමු localStorage එක update වෙන්න වෙලාව දෙන්න
        })
        .catch(error => {
            console.error('Login Error:', error);
            alert('Login Failed: ' + error.message);
            if(loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
});