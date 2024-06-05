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

// 在需要使用用戶信息的地方，從 localStorage 中取出
const userData = getUserDataFromLocalStorage();

document.getElementById('user-name').innerText = userData.name;

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
    fetch(`http://localhost:3000/meal?date=${date.toISOString()}&userId=${userId}&mealType=${mealType}`)
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
    fetch(`http://localhost:3000/workout?date=${date.toISOString()}&userId=${userId}`)
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
    fetch(`http://localhost:3000/meals?date=${date.toISOString()}&userId=${userId}`)
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
    fetch(`http://localhost:3000/workouts?date=${date.toISOString()}&userId=${userId}`)
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
    fetch('http://localhost:3000/articles')
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
                    
                    // 检查是否已存在留言框
                    const existingCommentBox = container.querySelector('.box');
                    if (existingCommentBox) {
                        return; // 如果已存在留言框，不执行任何操作
                    }

                    const newBox = document.createElement("div");
                    newBox.className = "box";

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
                            newComment.innerHTML = `<h5>User</h5><p>${text}</p>`;
                            container.appendChild(newComment);
                    
                            // 插入数据库
                            comment();
                    
                            // 清空并禁用 textarea
                            textarea.value = "";
                            textarea.disabled = true;
                            // 移除提交按钮
                            submitBtn.parentNode.removeChild(submitBtn);
                        } else { // 如果文字为空
                            // 移除留言框
                            container.removeChild(newBox);
                        }
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

function fetchComments() {
    fetch('http://localhost:3000/comments')
        .then(response => response.json())
        .then(data => {
            data.forEach(function(comment) {
                const container = document.getElementById(`comments-${comment.post_id}`);
                if (container) {
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "box";
                    commentDiv.innerHTML = `<h5>User</h5><p>${comment.content}</p>`;
                    container.appendChild(commentDiv);
                }
            });
        })
        .catch(error => console.error("Error fetching comments:", error));
}

function comment(){
    
}