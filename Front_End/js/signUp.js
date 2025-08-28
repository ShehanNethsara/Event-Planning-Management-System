document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
            console.log("Sign Up button clicked - adding class");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
            console.log("Sign In button clicked - removing class");
        });
    } else {
        console.error("Could not find one or more elements: #signUp, #signIn, #container");
    }
});

document.addEventListener("DOMContentLoaded", function () {

    // =====================
    // Sign In Form Handler
    // =====================
    const signInForm = document.querySelector(".sign-in-container form");
    signInForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // 👇 Username use කරන්න
        const username = signInForm.querySelector("input[type='text']").value.trim();
        const password = signInForm.querySelector("input[type='password']").value;

        if (!username || !password) {
            alert("⚠️ Please enter username and password.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) // ✅ username දාන්න
            });

            const result = await response.json();

            if (response.ok && result.data) {
                const { accessToken, username, role } = result.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("username", username);
                localStorage.setItem("role", role);

                alert("✅ Login successful!");

                if (role === "ADMIN") {
                    window.location.href = "adminDashboard.html";
                } else if (role === "USER") {
                    window.location.href = "userDashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }

            } else {
                alert(result.message || "❌ Invalid credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("🚨 Server error, please try again.");
        }
    });

    // =====================
    // Sign Up Form Handler
    // =====================
    const signUpForm = document.querySelector(".sign-up-container form");
    signUpForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // 👇 username use කරන්න
        const username = signUpForm.querySelector("input[placeholder='👤 Username']").value.trim();
        const email = signUpForm.querySelector("input[type='email']").value.trim();
        const password = signUpForm.querySelector("input[type='password']").value;

        if (!username || !email || !password) {
            alert("⚠️ Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password }) // ✅ username දාන්න
            });

            const result = await response.json();

            if (response.ok) {
                alert("🎉 Registration successful! Please login.");
                // Switch to Sign In view
                document.getElementById("signIn").click();
            } else {
                alert(result.message || "❌ Registration failed.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("🚨 Server error during registration.");
        }
    });

});