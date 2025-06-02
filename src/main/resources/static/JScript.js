
// Authentication
async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    try {
        const response = await fetch("/api/user/" + username);
        if (response.ok) {
            const user = await response.json();
            if (user.password === password) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "Page.html";
            } else {
                alert("Incorrect password");
            }
        } else {
            alert("User not found");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong");
    }
}

async function signup() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("User created successfully");
        } else {
            alert("Username already exists");
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
}

async function reset() {
    const username = document.getElementById("reset-username").value;
    const password = document.getElementById("reset-password").value;

    try {
        const response = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Password reset successful");
        } else {
            alert("User not found");
        }
    } catch (error) {
        console.error("Reset error:", error);
    }
}