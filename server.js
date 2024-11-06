// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const dbConfig = {
    host: 'localhost',
    user: 'root', // replace with your DB username
    password: 'manager', // replace with your DB password
    database: 'cloud_kitchen', // replace with your DB name
};

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch menu items from the database
app.get('/menu', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM menu');
        await connection.end();

        res.json(rows); // Send menu items as JSON
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('Error fetching menu');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
