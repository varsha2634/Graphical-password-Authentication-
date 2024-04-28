const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const options = {
    host: '127.0.0.1',
    port: '3306',
    user: 'admin',
    password: 'Cie@1472',
    database: 'my_database'
};
const connection = mysql.createConnection(options);
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});
app.use(bodyParser.json());
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    connection.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while signing up' });
        } else {
            res.status(200).json({ message: 'Signed up successfully' });
        }
    });
});
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while signing in' });
        } else if (results.length > 0) {
            res.status(200).json({ message: 'Signed in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'INDEX.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});