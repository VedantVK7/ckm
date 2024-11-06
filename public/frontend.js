// public/frontend.js
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

async function fetchMenu() {
    try {
        const response = await fetch('/menu');
        const menuItems = await response.json();
        const menuContainer = document.getElementById('menu-container');
        
        menuItems.forEach(item => {
            const card = createCard(item);
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const itemName = document.createElement('h3');
    itemName.textContent = item.Item_Name; // Updated to match 'Item_Name'

    const itemType = document.createElement('p');
    itemType.textContent = `Type: ${item.Item_Type}`; // Updated to match 'Item_Type'

    const itemDescription = document.createElement('p');
    itemDescription.textContent = item.Description; // Updated to match 'Description'

    const itemPrice = document.createElement('p');
    itemPrice.className = 'price';
    itemPrice.textContent = `₹ ${item.Item_Price}`; // Updated to match 'Item_Price'

    const orderButton = document.createElement('button');
    orderButton.textContent = 'Place Order';
    orderButton.onclick = () => {
        alert(`Order placed for: ${item.Item_Name}`);
    };

    card.appendChild(itemName);
    card.appendChild(itemType);
    card.appendChild(itemDescription);
    card.appendChild(itemPrice);
    card.appendChild(orderButton);

    return card;
}
