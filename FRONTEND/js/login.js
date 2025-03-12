document.addEventListener("DOMContentLoaded", function () {
    ensureAdminExists(); // Ensure default admin exists

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
            window.location.href = role === "admin" ? "admin-dashboard.html" : "member-dashboard.html";
        });
    }
});

// **🔹 Ensure Default Admin Exists**
function ensureAdminExists() {
    let members = JSON.parse(localStorage.getItem("members") || "[]");

    let adminExists = members.some(member => member.email === "admin@library.com");
    if (!adminExists) {
        let adminUser = {
            role: "admin",
            name: "Library Admin",
            email: "admin@library.com",
            password: "admin123"
        };
        members.push(adminUser);
        localStorage.setItem("members", JSON.stringify(members));
        console.log("✅ Default Admin Added:", adminUser);
    }
}
