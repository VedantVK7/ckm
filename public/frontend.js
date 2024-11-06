// public/frontend.js
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu(); // Fetch menu items when the page is loaded
});

// Fetch menu items from the server and display them
async function fetchMenu() {
    try {
        const response = await fetch('/menu');
        const menuItems = await response.json();
        const menuContainer = document.getElementById('menu-container');
        
        // Create and display a card for each menu item
        menuItems.forEach(item => {
            const card = createCard(item);
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Create an individual card for each menu item
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

// Add an item to the cart (with a default quantity of 1)
function addToCart(item) {
    cart.push({ ...item, quantity: 1 });
    alert(`${item.Item_Name} has been added to your cart!`);
}

// Handle the global place order button click (top-right)
async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const deliveryAddress = prompt('Please enter your delivery address:');
    
    if (deliveryAddress) {
        // Send the cart data and delivery address to the backend
        const response = await fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cart: cart,
                address: deliveryAddress
            })
        });

        const result = await response.json();
        
        if (response.status === 200) {
            alert('Order placed successfully!');
            console.log('Ordered Items:', cart);
            console.log('Total Amount:', cart.reduce((total, item) => total + (item.Item_Price * item.quantity), 0));
            cart = []; // Clear the cart after a successful order
        } else {
            alert(`Error: ${result.error}`);
        }
    } else {
        alert('Delivery address is required to place the order!');
    }
}

// Create a global "Place Order" button (top-right of the page)
function createGlobalPlaceOrderButton() {
    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.className = 'global-place-order';
    placeOrderButton.onclick = placeOrder;

    document.body.appendChild(placeOrderButton);
}

// Initialize the global place order button
createGlobalPlaceOrderButton();
