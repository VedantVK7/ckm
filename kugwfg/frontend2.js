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

    // Create quantity input field
    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 0; // Default value is 0
    quantityInput.min = 0; // Ensure no negative quantities
    quantityInput.id = `quantity-${item.Item_ID}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = () => addToCart(item, quantityInput);

    card.appendChild(itemName);
    card.appendChild(itemType);
    card.appendChild(itemDescription);
    card.appendChild(itemPrice);
    card.appendChild(quantityLabel);
    card.appendChild(quantityInput);
    card.appendChild(addToCartButton);

    return card;
}

// Add an item to the cart with the selected quantity
function addToCart(item, quantityInput) {
    const quantity = parseInt(quantityInput.value, 10); // Get the quantity from the input field
    if (quantity > 0) { // Only add to the cart if quantity is greater than 0
        cart.push({ ...item, quantity: quantity });
        alert(`${item.Item_Name} (x${quantity}) has been added to your cart!`);
    } else {
        alert('Please select a quantity greater than 0.');
    }
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

// Create a global "Place Order" button and "Logout" button (top-right of the page)
function createGlobalButtons() {
    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.className = 'global-place-order';
    placeOrderButton.onclick = placeOrder;

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'global-logout';
    logoutButton.onclick = logout;

    const viewCartButton = document.createElement('button');
    viewCartButton.textContent = 'View Cart';
    viewCartButton.className = 'global-view-cart';

    document.body.appendChild(placeOrderButton);
    document.body.appendChild(logoutButton);
    document.body.appendChild(viewCartButton);
}

// Function to log out the user and redirect to the auth page
function logout() {
    cart = []; // Clear the cart
    alert("You have been logged out.");
    window.location.href = 'auth.html'; // Redirect to auth.html
}

// Initialize the global buttons
createGlobalButtons();
