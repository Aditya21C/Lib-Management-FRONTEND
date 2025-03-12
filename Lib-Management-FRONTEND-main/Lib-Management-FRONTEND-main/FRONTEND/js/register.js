document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let role = document.getElementById("role").value;
            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim().toLowerCase(); // Convert to lowercase
            let password = document.getElementById("password").value.trim();
            let confirmPassword = document.getElementById("confirm-password").value.trim();
            let errorMessage = document.getElementById("error-message");

            if (!name || !email || !password || !confirmPassword) {
                errorMessage.textContent = "All fields are required!";
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords do not match!";
                return;
            }

            let members = JSON.parse(localStorage.getItem("members") || "[]");

            // **Check if the email already exists**
            let existingUser = members.find(member => member.email === email);
            if (existingUser) {
                errorMessage.textContent = "Email is already registered!";
                return;
            }

            let newUser = { role, name, email, password };
            members.push(newUser);
            localStorage.setItem("members", JSON.stringify(members));

            console.log("✅ New User Registered:", newUser);
            alert(role.charAt(0).toUpperCase() + role.slice(1) + " registered successfully!");
            window.location.href = "login.html"; 
        });
    }
});