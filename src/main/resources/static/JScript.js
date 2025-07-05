

document.addEventListener("DOMContentLoaded", function () {
    const balanceElement = document.getElementById("balance");
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const reportFilter = document.getElementById("report-filter");
    const reportTransactionList = document.getElementById("report-transaction-list");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User not found");
        window.location.href = "index.html";
        return;
    }

    const userId = user.id;

    let allTransactions = [];
    async function fetchTransactions() {
        try {
            const response = await fetch(`/transactions/user/${userId}`);
            if (!response.ok) throw new Error("Load transaction failed");
            allTransactions = await response.json();
            //renderTransactions(transactions);
            //updateBalance(transactions);

            if (balanceElement) updateBalance(allTransactions);
            if (transactionList) renderTransactions(allTransactions);
            if (reportFilter) applyReportFilter();
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

    if (transactionForm) {
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


            const transactionData = {description, category, amount, date, user: {id: userId}};
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
    }

    if (reportFilter && reportTransactionList) {
        reportFilter.addEventListener("change", applyReportFilter);

        function applyReportFilter() {
            const selected = reportFilter.value;
            const filtered = selected
                ? allTransactions.filter(t => t.description === selected)
                : allTransactions;

            renderReportTransactions(filtered);
        }

        function renderReportTransactions(transactions) {
            reportTransactionList.innerHTML = "";
            transactions.forEach((transaction) => {
                const li = document.createElement("li");
                li.textContent = `${transaction.date} - ${transaction.category} (${transaction.description}): $${transaction.amount.toFixed(2)}`;
                reportTransactionList.appendChild(li);
            });
        }
    }


    fetchTransactions();
});