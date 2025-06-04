
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

document.addEventListener("DOMContentLoaded", function () {
    const balanceElement = document.getElementById("balance");
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");

    async function fetchTransactions(userId) {
        const response = await fetch(`/transactions/user/${userId}`);
        const transactions = await response.json();
        renderTransactions(transactions);
        updateBalance(transactions);
    }

    function updateBalance(transactions) {
        let balance = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
        balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
    }

    function renderTransactions(transactions) {
        transactionList.innerHTML = "";
        transactions.forEach((transaction) => {
            const li = document.createElement("li");
            li.textContent = `${transaction.date} - ${transaction.category} (${transaction.type}): $${transaction.amount.toFixed(2)}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                await fetch(`/transactions/${transaction.id}`, { method: "DELETE" });
                fetchTransactions(transaction.userId);
            };

            li.appendChild(deleteBtn);
            transactionList.appendChild(li);
        });
    }

    transactionForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userId = 1; // Replace with actual user authentication logic
        const type = document.getElementById("description").value.trim();
        const category = document.getElementById("category").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value.trim();

        if (!category || isNaN(amount) || !date) {
            alert("Please enter valid transaction details.");
            return;
        }

        await fetch("/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, type, category, amount, date })
        });

        fetchTransactions(userId);
        transactionForm.reset();
    });

    fetchTransactions(1); // Replace with actual user logic
});