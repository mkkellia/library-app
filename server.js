// server.js
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json()); // to parse JSON bodies

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // put your MySQL password here
    database: "LIBRARY"
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to LIBRARY database");
});

// GET all books
app.get("/book", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// GET single book by id
app.get("/book/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("Book not found");
        res.json(results[0]);
    });
});

// POST new book
app.post("/book", (req, res) => {
    const { names, author, published_date } = req.body;
    db.query(
        "INSERT INTO books (names, author, published_date) VALUES (?, ?, ?)",
        [names, author, published_date],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Book added", bookId: results.insertId });
        }
    );
});

// DELETE book by id
app.delete("/book/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM books WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send("Book not found");
        res.json({ message: "Book deleted" });
    });
});

// PUT update book by id
app.put("/book/:id", (req, res) => {
    const { id } = req.params;
    const { names, author, published_date } = req.body;
    db.query(
        "UPDATE books SET names = ?, author = ?, published_date = ? WHERE id = ?",
        [names, author, published_date, id],
        (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.affectedRows === 0) return res.status(404).send("Book not found");
            res.json({ message: "Book updated" });
        }
    );
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
