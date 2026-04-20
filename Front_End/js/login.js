document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const loginData = {
        email: email,
        password: password
    };

    fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Backend eken token eka dhenna ona JSON ekak widiyata
            } else {
                throw new Error('Invalid credentials');
            }
        })
        .then(data => {
            // Token eka localStorage eke save karanawa
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role); // Role ekath save karagaththoth lesi

            alert('Login Successful!');
            window.location.href = 'dashboard.html'; // Logic eka iwara unama dashboard ekata yawamu
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login Failed: Check your email/password');
        });
});