const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // 使用 CORS 中間件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        SELECT Food.food_name, Meal.calories
        FROM Meal
        LEFT JOIN Food ON Meal.food_id = Food.food_id
        WHERE DATE(Meal.date) = '${date}' AND Meal.user_id = ? AND Meal.meal_type = ?
    `;

    db.query(query, [userId, mealType], (err, results) => {
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
        WHERE DATE(Workout.date) = '${date}' AND Workout.user_id = ?
    `;

    // 执行查询
    db.query(query, [userId], (err, results) => {
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
        SELECT SUM(calories) AS totalCalories
        FROM Meal
        WHERE DATE(date) = '${date}' AND user_id = ?
    `;

    // 执行查询
    db.query(query, [userId], (err, results) => {
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
        WHERE DATE(date) = '${date}' AND user_id = ?
    `;

    // 执行查询
    db.query(query, [userId], (err, results) => {
        if (err) {
            // 处理数据库查询错误
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        
        // 将查询结果作为 JSON 响应发送回客户端
        res.json(results);
    });
});

// 定义一个路由来处理请求
app.get('/goalType', (req, res) => {
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT goal_name, quantity
        FROM Goal
        WHERE user_id = ?
    `;

    // 执行查询
    db.query(query, [userId], (err, results) => {
        if (err) {
            // 处理数据库查询错误
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        
        // 将查询结果作为 JSON 响应发送回客户端
        res.json(results);
    });
});

app.get('/searchFood', (req, res) => {
    const search = req.query.search;

    let query = `
        SELECT 
            food_id,
            food_name, 
            calories 
        FROM 
            Food
        WHERE 
            LOWER(food_name) LIKE '%${search}%'
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        res.json(results);
    });
});

app.get('/searchExercise', (req, res) => {
    const search = req.query.search;

    let query = `
        SELECT 
            type, 
            calories 
        FROM 
            Exercise
        WHERE 
            LOWER(type) LIKE '%${search}%'
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

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

app.get('/comment', (req, res) => {
    const content = req.query.content;
    const postId = req.query.postId;
    const userId = req.query.userId;

    let query = `
        INSERT INTO Comment (post_id, user_id, content, comment_time)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(query, [postId, userId, content], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        res.status(200).json({ message: 'Comment added successfully' });
    });
});

app.post('/posts', (req, res) => {
    const { title, content, userId } = req.body;

    db.query('INSERT INTO Article (content, user_id, title, post_time) VALUES (?, ?, ?, NOW())', [content, userId, title], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        res.status(200).json({ message: 'Comment added successfully' });
    });
});

app.get('/rank', (req, res) => {
    const date = req.query.date;

    let query = `
        SELECT 
            u.user_id,
            u.name AS username,
            g.quantity,
            g.goal_name AS goal_type,
            SUM(m.calories) AS total_meal_calories,
            SUM(w.calories) AS total_workout_calories
        FROM 
            User u
        JOIN 
            Goal g ON u.user_id = g.user_id
        LEFT JOIN 
            Meal m ON u.user_id = m.user_id AND DATE(m.date) = '${date}'
        LEFT JOIN 
            Workout w ON u.user_id = w.user_id AND DATE(w.date) = '${date}'
        GROUP BY 
            u.user_id, u.name, g.quantity, g.goal_name;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

app.get('/fillProfile', (req, res)  => {
    const userId = req.query.userId;

    let query = `
        SELECT 
            u.name AS name,
            u.weight AS weight,
            u.height AS height,
            u.activity AS activity,
            u.tdee AS tdee,
            g.goal_name AS goal_name,
            g.quantity AS quantity,
            g.goal_id AS goal_id
        FROM 
            User u
        LEFT JOIN 
            Goal g ON u.user_id = g.user_id
        WHERE 
            u.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

app.post('/updateinfo', (req, res) => {
    const name = req.body.name;
    const weight = req.body.weight;
    const height = req.body.height;
    const userId = req.body.userId;

    const query = 'UPDATE User SET name = ?, weight = ?, height = ? WHERE user_id = ?';
    db.query(query, [name, weight, height, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json({ message: 'Update successful'});
    });
});

app.post('/updatepassword', (req, res) => {
    const password = req.body.password; // 从请求体中获取密码
    const userId = req.body.userId;

    const query = 'UPDATE User SET password = ? WHERE user_id = ?';
    db.query(query, [password, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json({ message: 'Update successful'});
    });
});

app.post('/updategoal', (req, res) => {
    const goalType = req.body.type;
    const calories = req.body.calories;
    const userId = req.body.userId;

    // 查询用户的目标
    const query = 'SELECT goal_id FROM Goal WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            // 如果用户没有目标，则插入新的目标
            const insertQuery = 'INSERT INTO Goal (goal_name, quantity, start_time, user_id) VALUES (?, ?, NOW(), ?)';
            db.query(insertQuery, [goalType, calories, userId], (insertErr, insertResults) => {
                if (insertErr) {
                    return res.status(500).json({ message: 'Database insert error' });
                }
                res.json({ message: 'Insert successful' });
            });
        } else {
            // 否则，更新用户的目标
            const updateQuery = 'UPDATE Goal SET goal_name = ?, quantity = ?, start_time = NOW() WHERE user_id = ?';
            db.query(updateQuery, [goalType, calories, userId], (updateErr, updateResults) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Database update error' });
                }
                res.json({ message: 'Update successful' });
            });
        }
    });
});

// 处理搜索食物的路由
app.get('/foods', (req, res) => {
    const text = req.query.text;
    const query = `SELECT type, calories FROM Exercise WHERE type = ?`;

    db.query(query, [text], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

// 处理搜索食物的路由
app.get('/foods', (req, res) => {
    const text = req.query.text;
    const query = `SELECT food_name, calories FROM Food WHERE food_name  = ?`;

    db.query(query, [text], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`服务器已启动在 http://localhost:${port}`);
});

// Endpoint to save user goal
app.post('/saveGoal', (req, res) => {
    const { userId, goalType, calories } = req.body;

    // Insert goal into the database
    const query = 'INSERT INTO Goal (user_id, goal_name, quantity, start_time) VALUES (?, ?, ?, NOW())';
    db.query(query, [userId, goalType, calories], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database insert error' });
        }
        res.status(201).json({ message: 'Goal saved successfully' });
    });
});

// Endpoint to get user goals for a specific date
app.get('/getGoals', (req, res) => {
    const { userId, date } = req.query;
    
    const query = `
        SELECT goal_name, quantity
        FROM Goal
        WHERE user_id = ? AND DATE(start_time) = ?
    `;

    db.query(query, [userId, date], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results);
    });
});
