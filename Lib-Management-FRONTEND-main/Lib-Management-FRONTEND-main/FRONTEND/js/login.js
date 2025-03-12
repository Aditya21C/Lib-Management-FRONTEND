document.addEventListener("DOMContentLoaded", function () {
    ensureDefaultUsersExist(); // Ensure default admin and staff exist

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let role = document.getElementById("role").value;
            let email = document.getElementById("email").value.trim().toLowerCase(); // Convert to lowercase
            let password = document.getElementById("password").value.trim();
            let errorMessage = document.getElementById("error-message");

            console.log("🔍 Fetching stored members:", JSON.parse(localStorage.getItem("members")));

            let users = JSON.parse(localStorage.getItem("members") || "[]");

            // **Check if user exists**
            let user = users.find(u => u.email === email && u.role === role);
            if (!user) {
                errorMessage.textContent = "Email not registered!";
                return;
            }

            if (user.password !== password) {
                errorMessage.textContent = "Incorrect password!";
                return;
            }

            localStorage.setItem("loggedInMember", email);
            alert(role.charAt(0).toUpperCase() + role.slice(1) + " Login Successful!");

            // Redirect based on role
            if (role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else if (role === "staff") {
                window.location.href = "staff.html";
            } else {
                window.location.href = "member-dashboard.html";
            }
        });
    }
});

// **🔹 Ensure Default Admin and Staff Exist**
function ensureDefaultUsersExist() {
    let members = JSON.parse(localStorage.getItem("members") || "[]");

    // Check if default admin exists
    let adminExists = members.some(member => member.email === "admin@library.com");
    if (!adminExists) {
        let adminUser = {
            role: "admin",
            name: "Library Admin",
            email: "admin@library.com",
            password: "admin123"
        };
        members.push(adminUser);
        console.log("✅ Default Admin Added:", adminUser);
    }

    // Check if default staff exists
    let staffExists = members.some(member => member.email === "staff@library.com");
    if (!staffExists) {
        let staffUser = {
            role: "staff",
            name: "Library Staff",
            email: "staff@library.com",
            password: "staff123"
        };
        members.push(staffUser);
        console.log("✅ Default Staff Added:", staffUser);
    }

    // Save updated members list to localStorage
    localStorage.setItem("members", JSON.stringify(members));
}