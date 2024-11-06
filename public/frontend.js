// public/frontend.js
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

// Fetch menu items from the server
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

// Create individual card for each menu item
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const itemName = document.createElement('h3');
    itemName.textContent = item.Item_Name;

    const itemType = document.createElement('p');
    itemType.textContent = `Type: ${item.Item_Type}`;

    const itemDescription = document.createElement('p');
    itemDescription.textContent = item.Description;

    const itemPrice = document.createElement('p');
    itemPrice.className = 'price';
    itemPrice.textContent = `₹ ${item.Item_Price}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = () => addToCart(item);

    card.appendChild(itemName);
    card.appendChild(itemType);
    card.appendChild(itemDescription);
    card.appendChild(itemPrice);
    card.appendChild(addToCartButton);

    return card;
}

// Add item to cart and alert the item added
function addToCart(item) {
    cart.push(item);
    alert(`${item.Item_Name} has been added to your cart!`);
}

// Handle place order button click (global button)
function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const deliveryAddress = prompt('Please enter your delivery address:');
    
    if (deliveryAddress) {
        let totalAmount = 0;
        let orderDetails = '';

        cart.forEach(item => {
            totalAmount += item.Item_Price;
            orderDetails += `\nID: ${item.Item_ID}, Name: ${item.Item_Name}, Price: ₹ ${item.Item_Price}`;
        });

        alert(`Order placed!\n\nItems:\n${orderDetails}\nTotal Amount: ₹ ${totalAmount}\nDelivery Address: ${deliveryAddress}`);
        
        // Clear the cart after placing the order
        cart = [];
    } else {
        alert('Delivery address is required to place the order!');
    }
}

// Create global place order button (top-right)
function createGlobalPlaceOrderButton() {
    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.className = 'global-place-order';
    placeOrderButton.onclick = placeOrder;

    document.body.appendChild(placeOrderButton);
}

// Call this function once DOM is loaded to place the button at the top-right
createGlobalPlaceOrderButton();
