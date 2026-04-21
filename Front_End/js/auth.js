document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // HTML IDs වලට අනුව values ලබා ගැනීම
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

    console.log("Registering User:", userData);

    fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                alert('Registration Successful! Now you can Login.');
                window.location.href = 'login.html';
            } else {
                return response.json().then(data => {
                    alert('Registration Failed: ' + (data.message || 'Check your details'));
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Server connection error. Make sure Backend is running.');
        });
});