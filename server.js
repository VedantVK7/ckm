// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('public')); // Serving static files from 'public' folder

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'cloud_kitchen' // Replace with your actual database name
};

// Route to fetch menu items from the 'menu' table
app.get('/menu', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM menu');
        res.json(rows); // Send back menu items as a JSON response
        await connection.end();
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// Route to handle placing an order
app.post('/place-order', async (req, res) => {
    const { cart, address } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ error: 'No items in the cart' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Calculate the total amount for the order
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.Item_Price * item.quantity; // Assuming quantity is sent in the request
        });

        // Insert a new order into the 'orders' table
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (Customer_ID, Total_Ammount, Address) VALUES (?, ?, ?)',
            [7, totalAmount, address]
        );
        const orderId = orderResult.insertId; // Get the generated Order_ID

        // Insert items into the 'ordered_items' table
        for (let item of cart) {
            await connection.execute(
                'INSERT INTO ordered_items (Order_ID, Item_ID, Quantity) VALUES (?, ?, ?)',
                [orderId, item.Item_ID, item.quantity]
            );
        }

        await connection.end();
        res.status(200).json({ message: 'Order placed successfully' });

    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Failed to place the order' });
    }
});

// Starting the server on port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
