
// Authentication
async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    try {
        const response = await fetch(`/api/user/${username}`);
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

async function resetPassword() {
    const username = document.getElementById("reset-username").value;
    const password = document.getElementById("reset-password").value;
    const confirmPassword = document.getElementById("reset-confirm-password").value;

    if (!username || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    }

    try {
        const response = await fetch("/api/user/update-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Password reset successful");
            window.location.href = "index.html";
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

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User not found");
        window.location.href = "index.html";
        return;
    }

    const userId = user.id;

    async function fetchTransactions() {
        try {
            const response = await fetch(`/transactions/user/${userId}`);
            if (!response.ok) throw new Error("Load transaction failed");
            const transactions = await response.json();
            renderTransactions(transactions);
            updateBalance(transactions);
        }
        catch (error) {
            console.error("Fetch error:", error);
        }
    }

    function updateBalance(transactions) {
        const balance = transactions.reduce((acc, t) => {
            if (t.description === "income"){
                return acc + t.amount;
            }
            else{
                return acc - t.amount;
            }
        }, 0);
        balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;

        // Balance alert
        if (balance < 100.00){
            alert("Your balance is less than 100.00");
        }
    }

    function renderTransactions(transactions) {
        transactionList.innerHTML = "";
        transactions.forEach((transaction) => {
            const li = document.createElement("li");
            li.textContent = `${transaction.date} - ${transaction.category} (${transaction.description}): $${transaction.amount.toFixed(2)}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                await fetch(`/transactions/${transaction.id}`, { method: "DELETE" });
                fetchTransactions(transaction.userId);
            };

            const updateBtn = document.createElement("button");
            updateBtn.textContent = "Update";
            updateBtn.onclick =  () => {
                document.getElementById("description").value = transaction.description;
                document.getElementById("category").value = transaction.category;
                document.getElementById("amount").value = transaction.amount;
                document.getElementById("date").value = transaction.date;
                transactionForm.dataset.id = transaction.id;
            }

            li.appendChild(deleteBtn);
            li.appendChild(updateBtn);
            transactionList.appendChild(li);
        });
    }

    transactionForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        //const userId = 1; // Replace with actual user authentication logic
        const description = document.getElementById("description").value.trim();
        const category = document.getElementById("category").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value.trim();

        if (!description || !category || isNaN(amount) || !date) {
            alert("Please enter valid transaction details.");
            return;
        }


        const transactionData = { description, category, amount, date, user:{id: userId} };
        const editId = transactionForm.dataset.id;

        try {
            if (editId) {
                await fetch(`/transactions/${editId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(transactionData),
                });
                delete transactionForm.dataset.id;
            } else {
                await fetch("/transactions", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(transactionData)
                });
            }

            fetchTransactions();
            transactionForm.reset();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });

    fetchTransactions();
});