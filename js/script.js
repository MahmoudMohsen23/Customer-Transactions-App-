let customers = [];
let transactions = [];
let chartInstance; 

async function getData() {
    let api = await fetch(`data.json`);
    let data = await api.json();
    console.log("Fetched Data:", data);
    customers = data.customers;
    transactions = data.transactions;
    displayData(customers, transactions);
    createGraph(transactions, null);
}
getData();

function displayData(customers, transactions) {
    let cartona = ``;
    for (let i = 0; i < transactions.length; i++) {
        for (let j = 0; j < customers.length; j++) {
            if (customers[j].id === transactions[i].customer_id) {
                cartona += `<tr>
                            <td id="name">${customers[j].name}</td>
                            <td id="id">${customers[j].id}</td>
                            <td id="date">${transactions[i].date}</td>
                            <td id="amount">${transactions[i].amount}</td>
                        </tr>`;
                break;
            }
        }
    }
    document.getElementById('body').innerHTML = cartona;
}

function searchByName() {
    const term = document.getElementById('filterName').value.toLowerCase();
    const searchContainer = [];
    for (let j = 0; j < customers.length; j++) {
        if (customers[j].name.toLowerCase().includes(term)) {
            searchContainer.push(customers[j]);
        }
    }
    displayData(searchContainer, transactions);
    updateGraph(searchContainer, transactions);
}

document.getElementById('filterName').addEventListener('input', searchByName);

function searchByAmount() {
    const term = parseFloat(document.getElementById('filterAmount').value);
    const searchContainer = [];
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].amount == term) {
            searchContainer.push(transactions[i]);
        }
    }
    displayData(customers, searchContainer);
    updateGraph(customers, searchContainer);
}

document.getElementById('filterAmount').addEventListener('input', searchByAmount);

function createGraph(transactions, selectedCustomerId) {
    const ctx = document.getElementById('transactionGraph').getContext('2d');
    let filteredTransactions = transactions;
    if (selectedCustomerId) {
        filteredTransactions = transactions.filter(transaction => transaction.customer_id == selectedCustomerId);
    }

    
    const transactionMap = filteredTransactions.reduce((acc, transaction) => {
        acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
        return acc;
    }, {});

    const labels = Object.keys(transactionMap);
    const data = Object.values(transactionMap);

    console.log("Graph Data:", { labels, data });

    
    if (chartInstance) {
        chartInstance.destroy();
    }

    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transaction Amounts',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateGraph(filteredCustomers, filteredTransactions) {
    const selectedCustomerId = filteredCustomers.length === 1 ? filteredCustomers[0].id : null;
    createGraph(filteredTransactions, selectedCustomerId);
}
