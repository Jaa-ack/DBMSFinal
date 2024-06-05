const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // 使用 CORS 中間件

const db = mysql.createConnection({
    host: 'localhost',
    user: 'dbms',
    password: 'dbmsfinal',
    database: 'DBMSFinal'
});

db.connect(err => {
    if (err) {
        console.error('無法連接到資料庫:', err);
        return;
    }
    console.log('成功連接到資料庫');
});

app.get('/login', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    const query = 'SELECT user_id, name, email, password FROM User WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: '查無使用者，請先註冊' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ message: '帳號或密碼錯誤' });
        }

        res.send({ message: 'Login successful', userId: user.user_id, name: user.name });
    });
});

app.post('/register', (req, res) => {
    const { name, birthday, email, height, weight, password } = req.body;

    // Check if email already exists
    db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email address has already been registered. Please login.' });
        }

        // Insert user into database
        db.query('INSERT INTO User (name, birthday, email, height, weight, password) VALUES (?, ?, ?, ?, ?, ?)', [name, birthday, email, height, weight, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/meal', (req, res) => {
    const date = req.query.date;
    const userId = req.query.userId;
    const mealType = req.query.mealType;

    let query = `
        SELECT Food.food_name, Food.calories
        FROM Meal
        LEFT JOIN Food ON Meal.food_id = Food.food_id
        WHERE Meal.date = ? AND Meal.user_id = ? AND Meal.meal_type = ?
    `;

    db.query(query, [date, userId, mealType], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        res.json(results);
    });
});

app.get('/workout', (req, res) => {
    // 获取查询参数
    const date = req.query.date;
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT Exercise.type AS type, Workout.calories AS calories
        FROM Workout
        LEFT JOIN Exercise ON Workout.exercise_id = Exercise.exercise_id
        WHERE Workout.date = ? AND Workout.user_id = ?
    `;

    // 执行查询
    db.query(query, [date, userId], (err, results) => {
        if (err) {
            // 处理数据库查询错误
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }

        // 将查询结果作为 JSON 响应发送回客户端
        res.json(results);
    });
});

app.get('/meals', (req, res) => {
    // 获取查询参数
    const date = req.query.date;
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT SUM(Food.calories) AS totalCalories
        FROM Meal
        LEFT JOIN Food ON Meal.food_id = Food.food_id
        WHERE Meal.date = ? AND Meal.user_id = ?
    `;

    // 执行查询
    db.query(query, [date, userId], (err, results) => {
        if (err) {
            // 处理数据库查询错误
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        
        // 将查询结果作为 JSON 响应发送回客户端
        res.json(results);
    });
});

app.get('/workouts', (req, res) => {
    // 获取查询参数
    const date = req.query.date;
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT SUM(calories) AS totalCalories
        FROM Workout
        WHERE date = ? AND user_id = ?
    `;

    // 执行查询
    db.query(query, [date, userId], (err, results) => {
        if (err) {
            // 处理数据库查询错误
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        
        // 将查询结果作为 JSON 响应发送回客户端
        res.json(results);
    });
});

// 文章数据路由
app.get('/articles', (req, res) => {
    let query = 'SELECT post_id, title, content FROM Article';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

// 评论数据路由
app.get('/comments', (req, res) => {
    let query = 'SELECT content, post_id FROM Comment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`服务器已启动在 http://localhost:${port}`);
});