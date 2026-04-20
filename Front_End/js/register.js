document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const userData = {
        name: name,
        email: email,
        password: password,
        role: role
    };

    fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                alert('Registration Successful!');
                window.location.href = 'login.html';
            } else {
                alert('Registration Failed. Try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Server connection error.');
        });
});