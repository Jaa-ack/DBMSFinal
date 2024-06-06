async function loginUser() {
    const email = document.getElementById('InputEmail').value.trim();
    const password = document.getElementById('InputPassword').value.trim();

    // 检查邮箱和密码是否为空
    if (!email || !password) {
        document.getElementById('email-feedback').style.display = !email ? 'block' : 'none';
        document.getElementById('password-feedback').style.display = !password ? 'block' : 'none';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        const data = await response.json();

        if (response.ok) {
            if (data.message === 'Login successful') {
                alert('登入成功');
                saveUserDataToLocalStorage(data.userId, data.name);
                window.location.href = 'food_exercise.html';
            } else {
                alert(data.message);
            }
        } else {
            alert(`登入失敗: ${data.message}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert('登入時發生錯誤。');
    }
}

async function registerUser() {
    const name = document.getElementById('Name').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    const email = document.getElementById('exampleInputEmail').value.trim();
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const password = document.getElementById('InputPassword').value.trim();
    const repeatPassword = document.getElementById('RepeatPassword').value.trim();

    if (password !== repeatPassword) {
        document.getElementById('repeat-password-feedback').innerText = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                birthday: birthday,
                email: email,
                height: height,
                weight: weight,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('User registered successfully');
            window.location.href = 'login.html'; // Redirect to login.html
        } else {
            alert(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering.');
    }
}

// 登入成功後將用戶信息保存到 localStorage 中
function saveUserDataToLocalStorage(userId, name) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
}

// 從 localStorage 中讀取用戶信息
function getUserDataFromLocalStorage() {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    return { userId, name };
}

(function () {
    'use strict';

    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                var isValid = true;

                // Get input elements
                var heightInput = document.getElementById('height');
                var weightInput = document.getElementById('weight');
                var passwordInput = document.getElementById('InputPassword');
                var repeatPasswordInput = document.getElementById('RepeatPassword');
                var emailInput = document.getElementById('exampleInputEmail');

                // Reset custom validity messages
                heightInput.setCustomValidity('');
                weightInput.setCustomValidity('');
                passwordInput.setCustomValidity('');
                repeatPasswordInput.setCustomValidity('');
                emailInput.setCustomValidity('');

                // Check height
                if (isNaN(heightInput.value) || heightInput.value.trim() === '') {
                    heightInput.setCustomValidity('Invalid height');
                    isValid = false;
                }

                // Check weight
                if (isNaN(weightInput.value) || weightInput.value.trim() === '') {
                    weightInput.setCustomValidity('Invalid weight');
                    isValid = false;
                }

                // Check repeat password
                if (repeatPasswordInput.value !== passwordInput.value) {
                    repeatPasswordInput.setCustomValidity('Passwords do not match');
                    isValid = false;
                }

                // Check email
                if (!emailInput.validity.valid) {
                    emailInput.setCustomValidity('Please provide a valid email address');
                    isValid = false;
                }

                if (form.checkValidity() === false || !isValid) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault(); // Prevent the form from submitting normally
                    registerUser(); // Register user
                }

                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// 加载给定日期和用户ID的餐数据
function loadMealData(date, userId, mealType, tableId) {
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`http://localhost:3000/meal?date=${formattedDate}&userId=${userId}&mealType=${mealType}`)
        .then(response => response.json())
        .then(data => {
            // 清空表格
            var tableBody = document.getElementById(tableId).querySelector("tbody");
            tableBody.innerHTML = "";

            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var messageRow = `<tr><td colspan="2">No data available</td></tr>`;
                tableBody.insertAdjacentHTML("beforeend", messageRow);
            } else {
                // 将数据添加到表格中
                data.forEach(function (meal) {
                    var row = `<tr><td>${meal.food_Name}</td><td>${meal.calories}</td></tr>`;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

// 加载给定日期的运动数据
function loadExerciseData(date, userId, tableId) {
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`http://localhost:3000/workout?date=${formattedDate}&userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            // 清空表格
            var tableBody = document.getElementById(tableId).querySelector("tbody");
            tableBody.innerHTML = "";

            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var messageRow = `<tr><td colspan="2">No data available</td></tr>`;
                tableBody.insertAdjacentHTML("beforeend", messageRow);
            } else {
                // 将数据添加到表格中
                data.forEach(function (exercise) {
                    var row = `<tr><td>${exercise.type}</td><td>${exercise.calories}</td></tr>`;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

function loadMeals(date, userId, targetElementId) {
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`http://localhost:3000/meals?date=${formattedDate}&userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var body = document.getElementById(targetElementId);
                body.innerHTML = `<tr><td colspan="2">No data available</td></tr>`;
            } else {
                // 计算总卡路里
                var totalCalories = data.reduce((total, meal) => total + meal.calories, 0);

                // 添加到目标元素中
                var targetElement = document.getElementById(targetElementId);
                targetElement.textContent = totalCalories + ' calories';
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

function loadExercises(date, userId, targetElementId) {
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`http://localhost:3000/workouts?date=${formattedDate}&userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var body = document.getElementById(targetElementId);
                body.innerHTML = `<tr><td colspan="2">No data available</td></tr>`;
            } else {
                // 计算总卡路里
                var totalCalories = data.reduce((total, meal) => total + meal.calories, 0);

                // 添加到目标元素中
                var targetElement = document.getElementById(targetElementId);
                targetElement.textContent = totalCalories + ' calories';
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

function calculateRemainingCalories() {
    // 获取 FOOD BLOCK 和 EXERCISE BLOCK 的值并提取数字部分
    var foodCaloriesString = document.getElementById("foodCalories").textContent;
    var exerciseCaloriesString = document.getElementById("exerciseCalories").textContent;

    var foodCalories = extractNumberFromString(foodCaloriesString);
    var exerciseCalories = extractNumberFromString(exerciseCaloriesString);

    // 计算热量盈余
    var remainingCalories = foodCalories - exerciseCalories;

    // 将热量盈余显示在 REMAIN BLOCK 中
    document.getElementById("remainCalories").textContent = remainingCalories + ' calories';
}

function extractNumberFromString(string) {
    // 使用正则表达式匹配字符串中的数字部分
    var match = string.match(/\d+/);

    // 如果找到匹配项，则返回第一个匹配的数字
    if (match) {
        return parseInt(match[0]);
    } else {
        // 如果未找到匹配项，则返回0或者您认为合适的默认值
        return 0;
    }
}

function fetchArticles() {
    fetch(`http://localhost:3000/articles`)
        .then(response => response.json())
        .then(data => {
            const articlesContainer = document.getElementById("articles");

            // Check if articlesContainer exists
            if (!articlesContainer) {
                console.error("Error: articles element not found");
                return;
            }

            // 清空文章容器
            articlesContainer.innerHTML = '';

            data.forEach(function (article) {
                const articleDiv = document.createElement("div");
                articleDiv.className = "article mb-4";
                articleDiv.innerHTML = `
                    <div class="row">
                        <div class="col" style="color: rgb(4, 4, 29);">
                            <h4>${article.title}</h4>
                            <p>${article.content}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col d-flex align-items-center">
                            <h5>Comments</h5>
                            <div style="margin-left: 10px;"></div>
                            <button type="button" class="btn btn-primary px-2 py-1 comment-btn" data-post-id="${article.post_id}">留言</button>
                        </div>
                    </div>
                    <div class="row">
                        <!-- 橫向滾動區域 -->
                        <div class="scroll-container" id="comments-${article.post_id}"></div>
                    </div>
                    <hr class="sidebar-divider">
                `;

                articlesContainer.appendChild(articleDiv);
            });

            // 添加事件监听器
            articlesContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('comment-btn')) {
                    const postId = event.target.getAttribute('data-post-id');
                    const container = document.getElementById(`comments-${postId}`);
                
                    // 检查是否已存在 id 为 "newBox" 的留言框
                    const existingNewBox = document.getElementById("newBox");
                    if (existingNewBox) {
                        return; // 如果已存在 id 为 "newBox" 的留言框，不执行任何操作
                    }

                    const newBox = document.createElement("div");
                    newBox.className = "box";
                    newBox.setAttribute("id", "newBox"); // 添加 id 属性

                    const textarea = document.createElement("textarea");
                    textarea.className = "form-control";
                    textarea.setAttribute("aria-label", "With textarea");

                    const submitBtn = document.createElement("button");
                    submitBtn.textContent = "提交";
                    submitBtn.addEventListener("click", function() {
                        const text = textarea.value.trim(); // 获取输入的文字
                        if (text !== "") { // 如果文字不为空
                            // 创建一个新的评论框显示用户评论
                            const newComment = document.createElement("div");
                            newComment.className = "box";
                            newComment.innerHTML = `<p>${text}</p>`;
                            container.appendChild(newComment);

                            var userId = localStorage.getItem('userId');
                            comment(text, postId, userId)
                        }
                        // 移除留言框
                        container.removeChild(newBox);
                    });                    

                    newBox.appendChild(textarea);
                    newBox.appendChild(submitBtn);

                    container.insertBefore(newBox, container.firstChild);
                }
            });

            // Fetch and display comments
            fetchComments();
        })
        .catch(error => console.error("Error fetching data:", error));
}


function comment(content, postId, userId) {
    fetch(`http://localhost:3000/comment?content=${content}&postId=${postId}&userId=${userId}`)
}

function fetchComments() {
    fetch(`http://localhost:3000/comments`)
        .then(response => response.json())
        .then(data => {
            data.forEach(function(comment) {
                const container = document.getElementById(`comments-${comment.post_id}`);
                if (container) {
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "box";
                    commentDiv.innerHTML = 　`<p>${comment.content}</p>`;
                    container.appendChild(commentDiv);
                }
            });
        })
        .catch(error => console.error("Error fetching comments:", error));
}

async function postArticle() {
    const title = document.getElementById('InputTitle').value.trim();
    const content = document.getElementById('InputContent').value.trim();
    const userId = localStorage.getItem('userId');

    // 检查标题和内容是否为空
    if (!title || !content) {
        document.getElementById('title-feedback').style.display = !title ? 'block' : 'none';
        document.getElementById('content-feedback').style.display = !content ? 'block' : 'none';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
                userId: userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('文章發表成功');
            window.location.href = 'community.html';
        } else {
            alert(`文章發表失敗: ${data.message}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert('發表文章時發生錯誤。');
    }
}

// 获取数据并填充表格
function fetchDataAndPopulateTable(date) {
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`http://localhost:3000/rank?date=${formattedDate}`)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error("Error fetching data:", error));
}

// 填充表格函数
function populateTable(data) {
    const userTableBody = document.getElementById("userTableBody");
    userTableBody.innerHTML = "";

    data.forEach(function (rank, index) {
        const row = document.createElement("tr");

        // 设置不同的背景颜色
        if (index === 0) {
            row.style.backgroundColor = "gold";
        } else if (index === 1 || index === 2) {
            row.style.backgroundColor = "silver";
        } else {
            row.style.backgroundColor = "lightblue";
        }

        // 如果 goal_id 等于 userId 则更改颜色
        var userId = localStorage.getItem('userId');
        if (rank.goal_id == userId) {
            row.style.backgroundColor = "lightgreen";
        }

        // 将 progress 限制在 0 到 100 之间
        const progress = Math.min(rank.progress * 100, 100);

        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${rank.username}</td>
            <td>${progress.toFixed(2)}%</td>
        `;
        userTableBody.appendChild(row);
    });
}

async function updateInfo() {
    const user_name = document.getElementById('updateName').value.trim();
    const weight = document.getElementById('updateWeight').value.trim();
    const height = document.getElementById('updateHeight').value.trim();
    const userId = localStorage.getItem('userId');

    // 检查输入是否为空
    if (!user_name) {
        document.getElementById('name-feedback').style.display = 'block';
    } else {
        document.getElementById('name-feedback').style.display = 'none';
    }

    if (!weight) {
        document.getElementById('weight-feedback').style.display = 'block';
    } else {
        document.getElementById('weight-feedback').style.display = 'none';
    }

    if (!height) {
        document.getElementById('height-feedback').style.display = 'block';
    } else {
        document.getElementById('height-feedback').style.display = 'none';
    }

    // 如果有任何输入为空，则停止执行并显示错误消息
    if (!user_name || !weight || !height) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/updateinfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user_name,
                weight: weight,
                height: height,
                userId: userId
            })
        });
        const data = await response.json();

        if (response.ok) {
            if (data.message === 'Update successful') {
                alert('更新成功');
                // 更新本地存储中的用户名
                localStorage.setItem('name', user_name);
            } else {
                alert(data.message);
            }
        } else {
            alert(`提交失敗: ${data.message}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert('提交時發生錯誤。');
    }
}

async function updatePassword() {
    const password = document.getElementById('updatePassword').value.trim();
    const checkPassword = document.getElementById('checkPassword').value.trim();
    const userId = localStorage.getItem('userId');

    // 检查输入是否为空
    if (!password) {
        document.getElementById('upassword-feedback').style.display = 'block';
    } else {
        document.getElementById('upassword-feedback').style.display = 'none';
    }

    if (!checkPassword) {
        document.getElementById('cpassword-feedback').style.display = 'block';
    } else {
        document.getElementById('cpassword-feedback').style.display = 'none';
    }

    // 如果有任何输入为空，则停止执行并显示错误消息
    if (!password || !checkPassword) {
        return;
    }

    if (password !== checkPassword) {
        document.getElementById('cpassword-feedback').innerText = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/updatepassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                userId: userId
            })
        });
        const data = await response.json();

        if (response.ok) {
            if (data.message === 'Update successful') {
                alert('密碼更新成功');
            } else {
                alert(data.message);
            }
        } else {
            alert(`更新失敗: ${data.message}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert(error);
    }
}

async function updateGoal() {
    const goalType = document.getElementById('goalType').value;
    const calories = document.getElementById('calories').value.trim();
    const userId = localStorage.getItem('userId');
    
    if (!goalType) {
        alert('Please select a goal type (Diet or Exercise).');
        return;
    }
    
    if (!calories) {
        alert('Please enter calories.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/updategoal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: goalType,
                calories: calories,
                userId: userId
            })
        });
        const data = await response.json();

        if (response.ok) {
            if (data.message === 'Update successful') {
                alert('目標更新成功');
            } else {
                alert(data.message);
            }
        } else {
            // 在响应不成功的情况下，直接显示响应中的错误消息
            alert(`目標提交失敗: ${data.message}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        alert(error);
    }
}
