// script.js

let totalIncome = 0;
let totalExpense = 0;
let entries = JSON.parse(localStorage.getItem('entries')) || [];

const typeSelect = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addButton = document.getElementById('addBtn');
const resetButton = document.getElementById('resetBtn');
const entriesTableBody = document.querySelector('#entriesTable tbody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const filterRadios = document.getElementsByName('filter');

// Function to update the total balance
function updateBalance() {
    const balance = totalIncome - totalExpense;
    balanceEl.innerText = `Balance: $${balance}`;
    totalIncomeEl.innerText = `Total Income: $${totalIncome}`;
    totalExpenseEl.innerText = `Total Expense: $${totalExpense}`;
}

// Function to render entries in the table
function renderEntries(filter = 'all') {
    entriesTableBody.innerHTML = '';
    let filteredEntries = entries;

    if (filter !== 'all') {
        filteredEntries = entries.filter(entry => entry.type === filter);
    }

    filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${entry.type}</td>
            <td>${entry.description}</td>
            <td>$${entry.amount}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        entriesTableBody.appendChild(row);
    });
}

// Function to add a new entry
function addEntry() {
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (description && !isNaN(amount)) {
        const entry = { type, description, amount };

        // Update totals
        if (type === 'income') {
            totalIncome += amount;
        } else {
            totalExpense += amount;
        }

        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries)); // Save to local storage
        renderEntries(getActiveFilter());
        updateBalance();

        // Reset inputs
        descriptionInput.value = '';
        amountInput.value = '';
    } else {
        alert('Please fill in both fields with valid data.');
    }
}

// Function to delete an entry
function deleteEntry(index) {
    const entry = entries[index];
    if (entry.type === 'income') {
        totalIncome -= entry.amount;
    } else {
        totalExpense -= entry.amount;
    }

    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries)); // Save to local storage
    renderEntries(getActiveFilter());
    updateBalance();
}

// Function to edit an entry
function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;

    // Remove the entry first to avoid duplication
    deleteEntry(index);
}

// Function to reset input fields
function resetInputs() {
    descriptionInput.value = '';
    amountInput.value = '';
}

// Function to get the selected filter
function getActiveFilter() {
    let activeFilter = 'all';
    for (const radio of filterRadios) {
        if (radio.checked) {
            activeFilter = radio.value;
            break;
        }
    }
    return activeFilter;
}

// Event listener for the add button
addButton.addEventListener('click', addEntry);

// Event listener for the reset button
resetButton.addEventListener('click', resetInputs);

// Event listener for the filter buttons
for (const radio of filterRadios) {
    radio.addEventListener('change', () => {
        renderEntries(getActiveFilter());
    });
}

// Initial setup
renderEntries(getActiveFilter());
updateBalance();