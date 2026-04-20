async function login(e) {
    e.preventDefault();
    try {
        const res = await apiRequest("/auth/login", "POST", {
            email: $('#email').val(),
            password: $('#password').val()
        });
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);

        // Advanced Navigation
        if (res.role === "ADMIN") window.location.href = "adminDashboard.html";
        else window.location.href = "userDashboard.html";
    } catch (err) {
        alert("Login Error: " + err.message);
    }
}