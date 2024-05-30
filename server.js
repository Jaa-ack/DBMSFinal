const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');


// 使用 CORS 中間件
app.use(cors());

const connection = mysql.createConnection({
    host: '140.119.134.125',
    user: 'dbms',
    password: 'dbmsfinal',
    database: 'DBMSFinal'
});

connection.connect();

app.get('/count', (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM article', (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ count: results[0].count });
    });
});

// 處理 GET 請求以獲取所有文章
app.get('/articles', (req, res) => {
    connection.query('SELECT title, content, user_id FROM article', (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});