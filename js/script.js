let customers = []
let transactions = []
async function getData() {
    let api = await fetch(`data.json`);
    let data = await api.json();
    console.log(data);
    customers = data.customers;
    transactions = data.transactions;
    displayData(customers, transactions);
    createGraph(transactions)
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
    term = document.getElementById('filterName').value.toLowerCase()
    searchContainer = [];
    for (let j = 0; j < customers.length; j++) {
        if (customers[j].name.toLowerCase().includes(term)) {
            searchContainer.push(customers[j])
        }

    }

    displayData(searchContainer, transactions)
}

document.getElementById('filterName').addEventListener('input', searchByName)


function searchByAmount() {
    const term = parseFloat(document.getElementById('filterAmount').value);
    const searchContainer = [];
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].amount == term) {
            searchContainer.push(transactions[i]);
        }
    }

    displayData(customers, searchContainer);
}

document.getElementById('filterAmount').addEventListener('input', searchByAmount);





function createGraph(transactions) {
    const ctx = document.getElementById('transactionGraph').getContext('2d');

    const labels = customers.map(customer => customer.name);
    const data = transactions.map(transaction => transaction.amount);

    new Chart(ctx, {
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