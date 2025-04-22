const form = document.getElementById("entry-form");
const list = document.getElementById("entry-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const resetBtn = document.getElementById("reset-btn");
const filterRadios = document.querySelectorAll("input[name='filter']");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("description").value;
  const amt = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || isNaN(amt)) return;

  const newEntry = { id: editId || Date.now(), description: desc, amount: amt, type };

  if (editId) {
    entries = entries.map(e => e.id === editId ? newEntry : e);
    editId = null;
  } else {
    entries.push(newEntry);
  }

  saveAndRender();
  form.reset();
});

resetBtn.addEventListener("click", () => form.reset());

filterRadios.forEach(radio =>
  radio.addEventListener("change", () => renderEntries())
);

function renderEntries() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  list.innerHTML = "";

  let income = 0, expense = 0;

  entries.filter(e => filter === "all" || e.type === filter).forEach(entry => {
    const li = document.createElement("li");
    li.classList.add(entry.type);
    li.innerHTML = `
      <span>${entry.description}: ₹${entry.amount}</span>
      <span class="actions">
        <button onclick="editEntry(${entry.id})">✏️</button>
        <button onclick="deleteEntry(${entry.id})">🗑️</button>
      </span>
    `;
    list.appendChild(li);
  });

  entries.forEach(e => {
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  });

  totalIncome.textContent = `₹${income}`;
  totalExpense.textContent = `₹${expense}`;
  balance.textContent = `₹${income - expense}`;
}

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  document.getElementById("description").value = entry.description;
  document.getElementById("amount").value = entry.amount;
  document.getElementById("type").value = entry.type;
  editId = id;
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
}

renderEntries();
