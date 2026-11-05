

const form = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const transactionList = document.querySelector("#transaction-list");

const balanceElement = document.querySelector("#balance");
const incomeElement = document.querySelector("#income");
const expensesElement = document.querySelector("#expenses");
const emptyMessage = document.querySelector("#empty-message");

let transactions = JSON.parse(
  localStorage.getItem("expense-transactions") || "[]"
);

function saveTransactions() {
  localStorage.setItem(
    "expense-transactions",
    JSON.stringify(transactions)
  );
}

function updateSummary() {
  const income = transactions
    .filter(item => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter(item => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  balanceElement.textContent = `₹${(income - expenses).toFixed(2)}`;
  incomeElement.textContent = `₹${income.toFixed(2)}`;
  expensesElement.textContent = `₹${expenses.toFixed(2)}`;
}

function renderTransactions() {
  transactionList.innerHTML = "";

  emptyMessage.style.display =
    transactions.length === 0 ? "block" : "none";

  transactions.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("transaction");

    const name = document.createElement("span");
    name.textContent = item.description;

    const amount = document.createElement("strong");
    amount.textContent =
      `${item.type === "income" ? "+" : "-"}₹${item.amount.toFixed(2)}`;
    amount.classList.add(item.type);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.dataset.id = item.id;

    li.append(name, amount, deleteButton);
    transactionList.appendChild(li);
  });

  updateSummary();
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  const transaction = {
    id: crypto.randomUUID(),
    description,
    amount,
    type: typeInput.value
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();

  form.reset();
});

transactionList.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;

    transactions = transactions.filter(item => item.id !== id);

    saveTransactions();
    renderTransactions();
  }
});

renderTransactions();
