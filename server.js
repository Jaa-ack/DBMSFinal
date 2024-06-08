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
        // console.error('無法連接到資料庫:', err);
        return;
    }
    // console.log('成功連接到資料庫');
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
    const { name, birthday, email, height, weight, password, gender, activity, TDEE } = req.body;

    console.log("Received registration data:", req.body);

    // Check if email already exists
    db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length > 0) {
            console.log("Email already registered:", email);
            return res.status(400).json({ message: 'Email address has already been registered. Please login.' });
        }

        // Insert user into database
        db.query('INSERT INTO User (`name`, `birthday`, `height`, `weight`, `email`, `tdee`, `password`, `activity`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, birthday, height, weight, email, TDEE, password, activity, gender], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ message: 'Database query error' });
            }
            console.log("User registered successfully:", email);
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/meal', (req, res) => {
    const date = req.query.date;
    const userId = req.query.userId;
    const mealType = req.query.mealType;

    let query = `
        SELECT Food.food_name AS food_name, Meal.calories AS calories, Meal.food_id AS food_id, Meal.meal_type AS meal_type, Meal.date AS date
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

app.post('/deleteMeal', (req, res) => {
    const { userId, food_id, meal_type, calories, date } = req.body;

    const queryDeleteMeal = 'DELETE FROM Meal WHERE user_id = ? AND food_id = ? AND meal_type = ? AND calories = ? AND DATE(date) = ?';
    db.query(queryDeleteMeal, [userId, food_id, meal_type, calories, date], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error' });
        }

        // 确认是否成功删除记录
        const queryCheckDeleted = 'SELECT * FROM Meal WHERE user_id = ? AND food_id = ? AND meal_type = ? AND calories = ? AND DATE(date) = ?';
        db.query(queryCheckDeleted, [userId, food_id, meal_type, calories, date], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ success: false, message: 'Database query error' });
            }

            if (result.length === 0) {
                console.log('Meal deleted successfully');
                res.json({ success: true, message: 'Meal deleted successfully' });
            } else {
                console.error('Meal deletion failed');
                res.status(500).json({ success: false, message: 'Meal deletion failed' });
            }
        });
    });
});

app.get('/workout', (req, res) => {
    // 获取查询参数
    const date = req.query.date;
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT Exercise.type AS type, Workout.exercise_id AS exercise_id, Workout.time AS time, Workout.date AS date, Workout.calories AS calories
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

app.post('/deleteWorkout', (req, res) => {
    const { user_id, exercise_id, time, date, calories } = req.body;

    const queryDeleteMeal = 'DELETE FROM Workout WHERE user_id = ? AND exercise_id = ? AND time = ? AND DATE(date) = ? AND calories = ?';
    db.query(queryDeleteMeal, [user_id, exercise_id, time, date, calories], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error' });
        }

        // 确认是否成功删除记录
        const queryCheckDeleted = 'SELECT * FROM Workout WHERE user_id = ? AND exercise_id = ? AND time = ? AND DATE(date) = ? AND calories = ?';
        db.query(queryCheckDeleted, [user_id, exercise_id, time, date, calories], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ success: false, message: 'Database query error' });
            }

            if (result.length === 0) {
                console.log('Exercise data deleted successfully');
                res.json({ success: true, message: 'Exercise data deleted successfully' });
            } else {
                console.error('Exercise data deletion failed');
                res.status(500).json({ success: false, message: 'Exercise data deletion failed' });
            }
        });
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

app.get('/tdee', (req, res) => {
    // 获取查询参数
    const userId = req.query.userId;

    // 构建查询语句
    let query = `
        SELECT tdee
        FROM User
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

app.get('/addFood', (req, res) => {
    const foodName = req.query.foodName;
    const calories = req.query.calories;

    let query = `
        INSERT INTO Food (food_name, calories)
        VALUES (?, ?)
    `;

    db.query(query, [foodName, calories], (err, results) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: 'Error inserting data into database' });
        }

        // 插入成功
        res.status(200).json({ message: 'Successfully inserted data into database' });
    });
});

// Route to handle adding meals
app.post('/addMeal', function(req, res) {
    const { userId, foodId, calories, meal, date } = req.body;

    const queryInsertMeal = "INSERT INTO Meal (user_id, meal_type, food_id, calories, date) VALUES (?, ?, ?, ?, ?)";
    db.query(queryInsertMeal, [userId, meal, foodId, calories, date], function(err, result) {
        if (err) {
            console.error('Error inserting meal:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    res.json({ success: true, message: "Meal added successfully!" });
    });
});

app.get('/searchExercise', (req, res) => {
    const search = req.query.search;

    let query = `
        SELECT 
            exercise_id,
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

app.post('/addExercise', (req, res) => {
    const { type, hourBurned } = req.body;

    const query = `
        INSERT INTO Exercise (type, calories) 
        VALUES (?, ?)
    `;

    db.query(query, [type, hourBurned], (err, results) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: 'Error inserting data into database' });
        }

        // 插入成功，返回插入的 exercise_id
        res.status(200).json({ message: 'Successfully inserted data into database', exerciseId: results.insertId });
    });
});

// Route to handle adding workout
app.post('/addWorkout', function(req, res) {
    const { exerciseId, userId, time, date, calories } = req.body;

    // Insert workout into Workout table
    const query = "INSERT INTO Workout (exercise_id, user_id, time, date, calories) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [exerciseId, userId, time, date, calories], function(err, result) {
        if (err) {
            console.error('Error inserting exercise data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, message: "Exercise data added successfully!" });
    });
});

// 文章数据路由
app.get('/articles', (req, res) => {
    let query = 'SELECT post_id, title, content FROM Article ORDER BY post_time DESC';
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
    let query = 'SELECT content, post_id FROM Comment ORDER BY comment_time ASC';
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
            console.error('SELECT query error:', err); // 添加日志
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            // 如果用户没有目标，则插入新的目标
            const insertQuery = 'INSERT INTO Goal (goal_name, quantity, user_id) VALUES (?, ?, ?)';
            db.query(insertQuery, [goalType, calories, userId], (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('INSERT query error:', insertErr); // 添加日志
                    return res.status(500).json({ message: 'Database insert error' });
                }
                res.json({ message: 'Insert successful' });
            });
        } else {
            // 否则，更新用户的目标
            const updateQuery = 'UPDATE Goal SET goal_name = ?, quantity = ? WHERE user_id = ?';
            db.query(updateQuery, [goalType, calories, userId], (updateErr, updateResults) => {
                if (updateErr) {
                    console.error('UPDATE query error:', updateErr); // 添加日志
                    return res.status(500).json({ message: 'Database update error' });
                }
                res.json({ message: 'Update successful' });
            });
        }
    });
});


app.listen(port, () => {
    // console.log(`服务器已启动在 http://localhost:${port}`);
});