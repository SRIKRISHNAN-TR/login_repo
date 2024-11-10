const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Signup failed" });
        }
        return res.json({ success: true, message: "Signup successful", data: result });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            // Successful login
            return res.json({ success: true, message: "Login successful" });
        } else {
            // Incorrect email or password
            return res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Fetch all users endpoint
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM login";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        return res.json({ success: true, data: results });
    });
});

// Delete user endpoint
app.delete('/user', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required to delete user" });
    }

    const sql = "DELETE FROM login WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete user" });
        }
        return res.json({ success: true, message: "User deleted successfully" });
    });
});

// Update user endpoint
app.put('/user', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required for updating" });
    }

    const sql = "UPDATE login SET name = ?, password = ? WHERE email = ?";
    const values = [name, password, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update user" });
        }
        return res.json({ success: true, message: "User updated successfully" });
    });
});

// Start server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
