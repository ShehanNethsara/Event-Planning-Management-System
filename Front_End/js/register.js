document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // HTML IDs වලට අනුව values ලබා ගැනීම (regName, regEmail, etc.)
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    const userData = {
        name: name,
        email: email,
        password: password,
        role: role
    };

    console.log("Registering User Data:", userData);

    fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                alert('Registration Successful! Please Login.');
                window.location.href = 'login.html';
            } else {
                return response.json().then(data => {
                    alert('Registration Failed: ' + (data.message || 'Details mismatch'));
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Server connection error. Check if Backend is running.');
        });
});