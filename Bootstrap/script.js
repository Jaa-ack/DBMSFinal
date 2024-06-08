async function loginUser() {
    const email = document.getElementById("InputEmail").value.trim();
    const password = document.getElementById("InputPassword").value.trim();

    // 检查邮箱和密码是否为空
    if (!email || !password) {
        document.getElementById("email-feedback").style.display = !email
        ? "block"
        : "none";
        document.getElementById("password-feedback").style.display = !password
        ? "block"
        : "none";
        return;
    }

    try {
        const response = await fetch(
        `http://localhost:3000/login?email=${encodeURIComponent(
            email
        )}&password=${encodeURIComponent(password)}`
        );
        const data = await response.json();

        if (response.ok) {
        if (data.message === "Login successful") {
            alert("登入成功");
            saveUserDataToLocalStorage(data.userId, data.name);
            window.location.href = "food_exercise.html";
        } else {
            alert(data.message);
        }
        } else {
        alert(`登入失敗: ${data.message}`);
        }
    } catch (error) {
        console.error("錯誤:", error);
        alert("登入時發生錯誤。");
    }
}

async function registerUser() {
    const name = document.getElementById("Name").value.trim();
    const birthday = document.getElementById("birthday").value.trim();
    const email = document.getElementById("exampleInputEmail").value.trim();
    const height = parseFloat(document.getElementById("height").value.trim());
    const weight = parseFloat(document.getElementById("weight").value.trim());
    const password = document.getElementById("InputPassword").value.trim();
    const repeatPassword = document.getElementById("RepeatPassword").value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value.trim() || "female";
    const activityLevelValue = document.getElementById('activity-level').value;
    
    let activity;
    switch (activityLevelValue) {
        case "1":
            activity = "Sedentary";
            break;
        case "2":
            activity = "Lightly Active";
            break;
        case "3":
            activity = "Moderately Active";
            break;
        case "4":
            activity = "Very Active";
            break;
        case "5":
            activity = "Super Active";
            break;
        default:
            activity = null;
            break;
    }

    if (password !== repeatPassword) {
        document.getElementById("repeat-password-feedback").innerText = "Passwords do not match";
        return;
    }

    if (activity === null) {
        document.getElementById("activity-feedback").innerText = "Please select a valid activity level";
        return;
    }

    const age = calculateAge(birthday);
    const TDEE = calculateTDEE(weight, height, age, gender, activityLevelValue);

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                birthday: birthday,
                email: email,
                height: height,
                weight: weight,
                password: password,
                gender: gender,
                activity: activity,
                TDEE: TDEE
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("User registered successfully");
            window.location.href = "login.html"; // Redirect to login.html
        } else {
            alert(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering.");
    }
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function calculateTDEE(weight, height, age, gender, activityLevelValue) {
    const genderFactor = gender === "male" ? 1 : 0;
    const BMR = 9.99 * weight + 6.25 * height - 4.92 * age + (166 * genderFactor) - 161;

    let activityMultiplier;
    switch (activityLevelValue) {
        case "1":
            activityMultiplier = 1.2; // Sedentary
            break;
        case "2":
            activityMultiplier = 1.375; // Lightly Active
            break;
        case "3":
            activityMultiplier = 1.55; // Moderately Active
            break;
        case "4":
            activityMultiplier = 1.725; // Very Active
            break;
        case "5":
            activityMultiplier = 1.9; // Super Active
            break;
        default:
            activityMultiplier = 1.2; // Default to Sedentary if unknown
            break;
    }

    return BMR * activityMultiplier;
}

// 登入成功後將用戶信息保存到 localStorage 中
function saveUserDataToLocalStorage(userId, name) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name);
}

// 從 localStorage 中讀取用戶信息
function getUserDataFromLocalStorage() {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    return { userId, name };
}

// 確保註冊資料不為空
// (function () {
//     "use strict";

//     window.addEventListener(
//         "load",
//         function () {
//         var forms = document.getElementsByClassName("needs-validation");
//         Array.prototype.filter.call(forms, function (form) {
//             form.addEventListener(
//             "submit",
//             function (event) {
//                 var isValid = true;

//                 // Get input elements
//                 var heightInput = document.getElementById("height");
//                 var weightInput = document.getElementById("weight");
//                 var passwordInput = document.getElementById("InputPassword");
//                 var repeatPasswordInput = document.getElementById("RepeatPassword");
//                 var emailInput = document.getElementById("exampleInputEmail");

//                 // Reset custom validity messages
//                 heightInput.setCustomValidity("");
//                 weightInput.setCustomValidity("");
//                 passwordInput.setCustomValidity("");
//                 repeatPasswordInput.setCustomValidity("");
//                 emailInput.setCustomValidity("");

//                 // Check height
//                 if (isNaN(heightInput.value) || heightInput.value.trim() === "") {
//                 heightInput.setCustomValidity("Invalid height");
//                 isValid = false;
//                 }

//                 // Check weight
//                 if (isNaN(weightInput.value) || weightInput.value.trim() === "") {
//                 weightInput.setCustomValidity("Invalid weight");
//                 isValid = false;
//                 }

//                 // Check repeat password
//                 if (repeatPasswordInput.value !== passwordInput.value) {
//                 repeatPasswordInput.setCustomValidity("Passwords do not match");
//                 isValid = false;
//                 }

//                 // Check email
//                 if (!emailInput.validity.valid) {
//                 emailInput.setCustomValidity(
//                     "Please provide a valid email address"
//                 );
//                 isValid = false;
//                 }

//                 if (form.checkValidity() === false || !isValid) {
//                 event.preventDefault();
//                 event.stopPropagation();
//                 } else {
//                 event.preventDefault(); // Prevent the form from submitting normally
//                 registerUser(); // Register user
//                 }

//                 form.classList.add("was-validated");
//             },
//             false
//             );
//         });
//         },
//         false
//     );
// })();

// 加载给定日期和用户ID的餐数据

function loadMealAndExerciseData(date, userId) {
    // 调用函数加载早餐数据
    loadMealData(date, 'breakfast', 'breakfastTable');
    // 调用函数加载午餐数据
    loadMealData(date, 'lunch', 'lunchTable');
    // 调用函数加载晚餐数据
    loadMealData(date, 'dinner', 'dinnerTable');
    // 加載使用者的TDEE
    loadTDEE('tdee');
    // 加载给定日期的运动数据
    loadExerciseData(date, 'exerciseTable');
    // 計算給定日期攝取卡路里
    loadMeals(date, 'foodCalories');
    // 計算給定日期消耗卡路里
    loadExercises(date, 'exerciseCalories');
    // 計算每日目標達成率
    updateGoalProgress(date);
}

function loadMealData(date, mealType, tableId) {
    const formattedDate = date.toISOString().split("T")[0];
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/meal?date=${formattedDate}&userId=${userId}&mealType=${mealType}`)
        .then((response) => response.json())
        .then((data) => {
            var tableBody = document.getElementById(tableId).querySelector("tbody");
            tableBody.innerHTML = "";

            if (data.length === 0) {
                var messageRow = `<tr><td colspan="3">No data available</td></tr>`;
                tableBody.insertAdjacentHTML("beforeend", messageRow);
            } else {
                data.forEach(function (meal) {
                    var row = `
                    <tr>
                        <td>${meal.food_name}</td>
                        <td>${meal.calories}</td>
                        <td>
                            <button class="bg-danger" onclick="confirmDeleteMeal(${userId}, '${meal.food_id}', '${meal.meal_type}', '${meal.calories}', '${formattedDate}')">Delete</button>
                        </td>
                    </tr>`;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function confirmDeleteMeal(userId, food_id, meal_type, calories, date) {
    const confirmation = confirm("Are you sure you want to delete this meal?");
    if (confirmation) {
        deleteMeal(userId, food_id, meal_type, calories, date);
    }
}

function deleteMeal(userId, food_id, meal_type, calories, date) {
    fetch(`http://localhost:3000/deleteMeal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, food_id, meal_type, calories, date }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('刪除成功');
            var displayDate = document.getElementById("current-date");
            displayDate.textContent = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            loadMealAndExerciseData(new Date(), userId);
        } else {
            alert('Failed to delete meal');
        }
    })
    .catch(error => console.error('Error deleting meal:', error));
}

function loadTDEE(targetElementId) {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/tdee?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
            // 清空目标元素内容
            var targetElement = document.getElementById(targetElementId);
            targetElement.innerHTML = "";

            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var body = document.getElementById(targetElementId);
                body.innerHTML = `No data available`;
            } else {
                var value = data[0];
                if (value.tdee === null) {
                targetElement.textContent = `0`;
                } else {
                targetElement.textContent = `${value.tdee}`;
                }
            }

            // 计算热量盈余
            calculateRemainingCalories();
        })
        .catch((error) => console.error("Error fetching data:", error));
}

// 加载给定日期的运动数据
function loadExerciseData(date, tableId) {
    const formattedDate = date.toISOString().split("T")[0];
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/workout?date=${formattedDate}&userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
        // 清空表格
        var tableBody = document.getElementById(tableId).querySelector("tbody");
        tableBody.innerHTML = "";

        // 如果没有数据，显示一条消息
        if (data.length === 0) {
            var messageRow = `<tr><td colspan="3">No data available</td></tr>`;
            tableBody.insertAdjacentHTML("beforeend", messageRow);
        } else {
            // 将数据添加到表格中
            data.forEach(function (exercise) {
                var row = `
                <tr>
                    <td>${exercise.type}</td>
                    <td>${exercise.calories}</td>
                    <td>
                        <button class="bg-danger" onclick="confirmDeleteWorkout(${userId}, '${exercise.exercise_id}', '${exercise.time}', '${formattedDate}', '${exercise.calories}')">Delete</button>
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
            });
        }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function confirmDeleteWorkout(user_id, exercise_id, time, date, calories) {
    const confirmation = confirm("Are you sure you want to delete this exercise data?");
    if (confirmation) {
        deleteWorkout(user_id, exercise_id, time, date, calories);
    }
}

function deleteWorkout(user_id, exercise_id, time, date, calories) {
    fetch(`http://localhost:3000/deleteWorkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, exercise_id, time, date, calories }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('刪除成功');
            var displayDate = document.getElementById("current-date");
            displayDate.textContent = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            loadMealAndExerciseData(new Date(), user_id);
        } else {
            alert('Failed to delete exercise data');
        }
    })
    .catch(error => console.error('Error deleting exercise data:', error));
}

function loadMeals(date, targetElementId) {
    const formattedDate = date.toISOString().split("T")[0];
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/meals?date=${formattedDate}&userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
        // 清空目标元素内容
        var targetElement = document.getElementById(targetElementId);
        targetElement.innerHTML = "";

        // 如果没有数据，显示一条消息
        if (data.length === 0) {
            var body = document.getElementById(targetElementId);
            body.innerHTML = `No data available`;
        } else {
            var total = data[0];
            if (total.totalCalories === null) {
            targetElement.textContent = `0 calories`;
            } else {
            targetElement.textContent = `${total.totalCalories} calories`;
            }
        }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function loadExercises(date, targetElementId) {
    const formattedDate = date.toISOString().split("T")[0];
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/workouts?date=${formattedDate}&userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
        // 清空目标元素内容
        var targetElement = document.getElementById(targetElementId);
        targetElement.innerHTML = "";

        // 如果没有数据，显示一条消息
        if (data.length === 0) {
            var body = document.getElementById(targetElementId);
            body.innerHTML = `No data available`;
        } else {
            var total = data[0];
            if (total.totalCalories === null) {
            targetElement.textContent = `0 calories`;
            } else {
            targetElement.textContent = `${total.totalCalories} calories`;
            }
        }

        // 计算热量盈余
        calculateRemainingCalories();
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function calculateRemainingCalories() {
    // 获取 FOOD BLOCK 和 EXERCISE BLOCK 的值并提取数字部分
    var foodCaloriesString = document.getElementById("foodCalories").textContent;
    var exerciseCaloriesString = document.getElementById("exerciseCalories").textContent;
    var tdeeQuantity = document.getElementById("tdee").textContent;

    var foodCalories = extractNumberFromString(foodCaloriesString);
    var exerciseCalories = extractNumberFromString(exerciseCaloriesString);
    var tdee = extractNumberFromString(tdeeQuantity);

    // 计算热量盈余
    var remainingCalories = foodCalories - exerciseCalories - tdee;

    // 将热量盈余显示在 REMAIN BLOCK 中
    document.getElementById("remainCalories").textContent = remainingCalories + " calories";
}

function updateGoalProgress(date) {
    const formattedDate = date.toISOString().split("T")[0];
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:3000/goalType?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
        var goalNameElement = document.getElementById("goalName");
        var progressPercentageElement =
            document.getElementById("progressPercentage");
        var progressBarElement = document.getElementById("progressBar");
        // 清空目标元素内容
        goalNameElement.textContent = "";
        progressPercentageElement.textContent = "";
        progressBarElement.style.width = "0%";

        // 如果没有数据，显示一条消息
        if (data.length === 0) {
            goalNameElement.textContent = "No data available";
        } else {
            var goal = data[0];
            var quantity = goal.quantity;
            var progress;

            if (goal.goal_name === "diet") {
            // 获取 FOOD BLOCK 的值并提取数字部分
            var foodCaloriesString =
                document.getElementById("foodCalories").textContent;
            var foodCalories = extractNumberFromString(foodCaloriesString);

            // 计算进度
            progress = foodCalories / quantity;
            if (progress > 1) {
                progress = 2 - progress;
            }
            } else {
            // 获取 FOOD BLOCK 和 EXERCISE BLOCK 的值并提取数字部分
            var exerciseCaloriesString =
                document.getElementById("exerciseCalories").textContent;
            var exerciseCalories = extractNumberFromString(
                exerciseCaloriesString
            );

            // 计算进度
            progress = exerciseCalories / quantity;
            if (progress > 1) {
                progress = 100;
            }
            }

            // 设置目标名称
            goalNameElement.textContent = goal.goal_name;

            // 设置进度百分比
            progressPercentageElement.textContent =
            (progress * 100).toFixed(2) + "%";

            // 设置进度条宽度
            progressBarElement.style.width = progress * 100 + "%";
        }
        })
        .catch((error) => console.error("Error fetching goal progress:", error));
}

function searchFood() {
    const search = document.getElementById('foodSearchInput').value;

    fetch(`http://localhost:3000/searchFood?search=${search}`)
        .then((response) => response.json())
        .then((data) => {
            // 清空表格
            var tableBody = document.getElementById('foodTable').querySelector("tbody");
            tableBody.innerHTML = "";

            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var messageRow = `<tr><td colspan="3">No data available</td></tr>`;
                tableBody.insertAdjacentHTML("beforeend", messageRow);
            } else {
                // 将数据添加到表格中
                data.forEach(function (food) {
                    var row = `<tr><td>${food.food_name}</td><td>${food.calories}</td>`;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function searchExercise() {
    const search = document.getElementById('exerciseSearchInput').value;

    fetch(`http://localhost:3000/searchExercise?search=${search}`)
        .then((response) => response.json())
        .then((data) => {
            // 清空表格
            var tableBody = document.getElementById('exerciseTable').querySelector("tbody");
            tableBody.innerHTML = "";

            // 如果没有数据，显示一条消息
            if (data.length === 0) {
                var messageRow = `<tr><td colspan="3">No data available</td></tr>`;
                tableBody.insertAdjacentHTML("beforeend", messageRow);
            } else {
                // 将数据添加到表格中
                data.forEach(function (exercise) {
                    var row = `<tr><td>${exercise.type}</td><td>${exercise.calories}</td>`;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function getSelectedMeal() {
    const meals = document.getElementsByName('meal');
    let selectedMeal = '';

    meals.forEach(meal => {
        if (meal.checked) {
            selectedMeal = meal.value;
        }
    });

    return selectedMeal;
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
        .then((response) => response.json())
        .then((data) => {
        const articlesContainer = document.getElementById("articles");

        // Check if articlesContainer exists
        if (!articlesContainer) {
            console.error("Error: articles element not found");
            return;
        }

        // 清空文章容器
        articlesContainer.innerHTML = "";

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
        articlesContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("comment-btn")) {
            const postId = event.target.getAttribute("data-post-id");
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
            submitBtn.addEventListener("click", function () {
                const text = textarea.value.trim(); // 获取输入的文字
                if (text !== "") {
                // 如果文字不为空
                // 创建一个新的评论框显示用户评论
                const newComment = document.createElement("div");
                newComment.className = "box";
                newComment.innerHTML = `<p>${text}</p>`;
                container.appendChild(newComment);

                var userId = localStorage.getItem("userId");
                comment(text, postId, userId);
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
        .catch((error) => console.error("Error fetching data:", error));
}

function comment(content, postId, userId) {
    fetch(
        `http://localhost:3000/comment?content=${content}&postId=${postId}&userId=${userId}`
    );
}

function fetchComments() {
    fetch(`http://localhost:3000/comments`)
        .then((response) => response.json())
        .then((data) => {
        data.forEach(function (comment) {
            const container = document.getElementById(
            `comments-${comment.post_id}`
            );
            if (container) {
            const commentDiv = document.createElement("div");
            commentDiv.className = "box";
            commentDiv.innerHTML = `<p>${comment.content}</p>`;
            container.appendChild(commentDiv);
            }
        });
        })
        .catch((error) => console.error("Error fetching comments:", error));
}

async function postArticle() {
    const title = document.getElementById("InputTitle").value.trim();
    const content = document.getElementById("InputContent").value.trim();
    const userId = localStorage.getItem("userId");

    // 检查标题和内容是否为空
    if (!title || !content) {
        document.getElementById("title-feedback").style.display = !title
        ? "block"
        : "none";
        document.getElementById("content-feedback").style.display = !content
        ? "block"
        : "none";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
            userId: userId,
        }),
        });

        const data = await response.json();

        if (response.ok) {
        alert("文章發表成功");
        window.location.href = "community.html";
        } else {
        alert(`文章發表失敗: ${data.message}`);
        }
    } catch (error) {
        console.error("錯誤:", error);
        alert("發表文章時發生錯誤。");
    }
}

// 获取数据并填充表格
function ranking(date) {
    const formattedDate = date.toISOString().split("T")[0];
    fetch(`http://localhost:3000/rank?date=${formattedDate}`)
        .then((response) => response.json())
        .then((data) => {
        populateTable(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

// 填充表格函数
function populateTable(data) {
    const userTableBody = document.getElementById("userTableBody");
    userTableBody.innerHTML = "";

    // 计算进度并排序
    data.sort((a, b) => {
        // 计算进度
        const progressA = calculateProgress(a);
        const progressB = calculateProgress(b);

        // 比较进度大小
        return progressB - progressA;
});

  // 遍历数据，为每个条目创建表格行并添加到表格中
  data.forEach(function (rank, index) {
    const row = document.createElement("tr");

    // 设置不同的背景颜色
    if (index === 0) {
      row.style.backgroundColor = "#FFD700";
    } else if (index === 1 || index === 2) {
      row.style.backgroundColor = "#993333";
    } else {
      row.style.backgroundColor = "#339966";
    }

    // 如果 goal_id 等于 userId 则更改颜色
    var userId = localStorage.getItem("userId");
    if (rank.user_id == userId) {
      row.style.backgroundColor = "#336699";
    }

    // 计算进度
    const progress = calculateProgress(rank);

    row.innerHTML = `
            <th scope="row" style="color: #333333">${index + 1}</th>
            <td style="color: #333333">${rank.username}</td>
            <td style="color: #333333">${progress.toFixed(2)}%</td>
        `;
    userTableBody.appendChild(row);
  });
}

function calculateProgress(rank) {
    var progress = 0;

    if (rank.goal_type === "diet") {
        progress = rank.total_meal_calories / rank.quantity;
        if (progress > 1) {
        progress = 2 - progress;
        }
    } else if (rank.goal_type === "exercise") {
        progress = rank.total_workout_calories / rank.quantity;
        if (progress > 1) {
        progress = 1;
        }
    }

    return progress * 100; // 将进度转换为百分比形式
}

function fillProfile() {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:3000/fillProfile?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
        console.log(data); // 这里是返回的数据

        // 检查数据是否存在
        if (data.length > 0) {
            var profile = data[0];

            // 填充使用者profile資料
            document.getElementById("updateName").value = profile.name;
            document.getElementById("updateWeight").value = profile.weight;
            document.getElementById("updateHeight").value = profile.height;

            if (profile.goal_name === "diet") {
            selectGoal("Diet");
            document.getElementById("updateCalories").value = profile.quantity;
            } else if (profile.goal_id === "exercise") {
            selectGoal("Exercise");
            document.getElementById("updateCalories").value = profile.quantity;
            } else {
            // 其他情况，可以添加默认处理逻辑
            }
        } else {
            console.error("Data not found or empty");
        }
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function selectGoal(goalType) {
  document.getElementById("goalType").value = goalType;

  // 更新显示的文本
  const dropdownButton = document.getElementById("dropdownMenuButton");
  dropdownButton.textContent = `Selected Goal: ${goalType}`;
}

// function updateInfo() {
//     const user_name = document.getElementById('updateName').value.trim();
//     const weight = document.getElementById('updateWeight').value.trim();
//     const height = document.getElementById('updateHeight').value.trim();
//     const userId = localStorage.getItem('userId');

//     try {
//         const response = await fetch(`http://localhost:3000/updateinfo`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 name: user_name,
//                 weight: weight,
//                 height: height,
//                 userId: userId
//             })
//         });
//         const data = await response.json();

//         if (response.ok) {
//             if (data.message === 'Update successful') {
//                 alert('更新成功');
//                 // 更新本地存储中的用户名
//                 localStorage.setItem('name', user_name);
//             } else {
//                 alert(data.message);
//             }
//         } else {
//             alert(`提交失敗: ${data.message}`);
//         }
//     } catch (error) {
//         console.error('錯誤:', error);
//         alert('提交時發生錯誤。');
//     }
// }