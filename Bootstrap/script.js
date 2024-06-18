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
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer").value.trim();
  const gender = document
    .querySelector('input[name="gender"]:checked')
    ?.value.trim();
  const activityLevelValue = document.getElementById("activity-level").value;

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
    document.getElementById("repeat-password-feedback").innerText =
      "Password not match";
    return;
  }
  if (question === "") {
    document.getElementById("question-feedback").innerText =
      "Please provide a question.";
    return;
  }
  if (answer === "") {
    document.getElementById("answer-feedback").innerText =
      "Please provide an answer.";
    return;
  }

  if (activity === null) {
    document.getElementById("activity-feedback").innerText =
      "Please select a valid activity level";
    return;
  }

  if (gender === null) {
    document.getElementById("gender-feedback").innerText =
      "Please select a gender";
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
        TDEE: TDEE,
        question: question,
        answer: answer,
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

function logout() {
  localStorage.clear();
  alert("logout successfully");
  window.location.href = "login.html";
}

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function calculateTDEE(weight, height, age, gender, activityLevelValue) {
  const genderFactor = gender === "male" ? 1 : 0;
  const BMR =
    9.99 * weight + 6.25 * height - 4.92 * age + 166 * genderFactor - 161;

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

// 確保註冊資料不為空
(function () {
  "use strict";

  window.addEventListener(
    "load",
    function () {
      var forms = document.getElementsByClassName("needs-validation");
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            var isValid = true;

            // Get input elements
            var heightInput = document.getElementById("height");
            var weightInput = document.getElementById("weight");
            var passwordInput = document.getElementById("InputPassword");
            var repeatPasswordInput = document.getElementById("RepeatPassword");
            var emailInput = document.getElementById("exampleInputEmail");

            // Reset custom validity messages
            heightInput.setCustomValidity("");
            weightInput.setCustomValidity("");
            passwordInput.setCustomValidity("");
            repeatPasswordInput.setCustomValidity("");
            emailInput.setCustomValidity("");

            // Check height
            if (isNaN(heightInput.value) || heightInput.value.trim() === "") {
              heightInput.setCustomValidity("Invalid height");
              isValid = false;
            }

            // Check weight
            if (isNaN(weightInput.value) || weightInput.value.trim() === "") {
              weightInput.setCustomValidity("Invalid weight");
              isValid = false;
            }

            // Check repeat password
            if (repeatPasswordInput.value !== passwordInput.value) {
              repeatPasswordInput.setCustomValidity("Passwords do not match");
              isValid = false;
            }

            // Check email
            if (!emailInput.validity.valid) {
              emailInput.setCustomValidity(
                "Please provide a valid email address"
              );
              isValid = false;
            }

            if (form.checkValidity() === false || !isValid) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              event.preventDefault(); // Prevent the form from submitting normally
              registerUser(); // Register user
            }

            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

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

// 加载给定日期和用户ID的餐数据
function loadMealAndExerciseData(date) {
  // 调用函数加载早餐数据
  loadMealData(date, "breakfast", "breakfastTable");
  // 调用函数加载午餐数据
  loadMealData(date, "lunch", "lunchTable");
  // 调用函数加载晚餐数据
  loadMealData(date, "dinner", "dinnerTable");
  // 加載使用者的TDEE
  loadTDEE("tdee");
  // 加载给定日期的运动数据
  loadExerciseData(date, "exerciseTable");
  // 計算給定日期攝取卡路里
  loadMeals(date, "foodCalories");
  // 計算給定日期消耗卡路里
  loadExercises(date, "exerciseCalories");
}

function loadMealData(date, mealType, tableId) {
  const formattedDate = date.toISOString().split("T")[0];
  const userId = localStorage.getItem("userId");
  fetch(
    `http://localhost:3000/meal?date=${formattedDate}&userId=${userId}&mealType=${mealType}`
  )
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
                                <button class="btn btn-danger" onclick="confirmDeleteMeal(${userId}, '${meal.food_id}', '${meal.meal_type}', '${meal.calories}', '${formattedDate}')">Delete</button>
                            </td>
                        </tr>`;
          tableBody.insertAdjacentHTML("beforeend", row);
        });
      }

      calculateRemainingCalories();
      updateGoalProgress();
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, food_id, meal_type, calories, date }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("刪除成功");
        var displayDate = document.getElementById("current-date");
        displayDate.textContent = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        loadMealAndExerciseData(new Date(), userId);
      } else {
        alert("Failed to delete meal");
      }
    })
    .catch((error) => console.error("Error deleting meal:", error));
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

      calculateRemainingCalories();
      updateGoalProgress();
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
                            <button class="btn btn-danger" onclick="confirmDeleteWorkout(${userId}, '${exercise.exercise_id}', '${exercise.time}', '${formattedDate}', '${exercise.calories}')">Delete</button>
                        </td>
                    </tr>`;
          tableBody.insertAdjacentHTML("beforeend", row);
        });
      }

      calculateRemainingCalories();
      updateGoalProgress();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function confirmDeleteWorkout(user_id, exercise_id, time, date, calories) {
  const confirmation = confirm(
    "Are you sure you want to delete this exercise data?"
  );
  if (confirmation) {
    deleteWorkout(user_id, exercise_id, time, date, calories);
  }
}

function deleteWorkout(user_id, exercise_id, time, date, calories) {
  fetch(`http://localhost:3000/deleteWorkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, exercise_id, time, date, calories }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("刪除成功");
        var displayDate = document.getElementById("current-date");
        displayDate.textContent = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        loadMealAndExerciseData(new Date(), user_id);
      } else {
        alert("Failed to delete exercise data");
      }
    })
    .catch((error) => console.error("Error deleting exercise data:", error));
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

      calculateRemainingCalories();
      updateGoalProgress();
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

      calculateRemainingCalories();
      updateGoalProgress();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function calculateRemainingCalories() {
  // 获取 FOOD BLOCK 和 EXERCISE BLOCK 的值并提取数字部分
  var foodCaloriesString = document.getElementById("foodCalories").textContent;
  var exerciseCaloriesString =
    document.getElementById("exerciseCalories").textContent;
  var tdeeQuantity = document.getElementById("tdee").textContent;

  var foodCalories = extractNumberFromString(foodCaloriesString);
  var exerciseCalories = extractNumberFromString(exerciseCaloriesString);
  var tdee = extractNumberFromString(tdeeQuantity);

  // 计算热量盈余
  var remainingCalories = foodCalories - exerciseCalories - tdee;

  // 将热量盈余显示在 REMAIN BLOCK 中
  document.getElementById("remainCalories").textContent =
    remainingCalories + " calories";

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

function updateGoalProgress() {
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
        var progress = 1.77; // 使用变量声明

        if (goal.goal_name === "Diet") {
          // 获取 FOOD BLOCK 的值并提取数字部分
          var foodCaloriesString =
            document.getElementById("foodCalories").textContent;
          var foodCalories = extractNumberFromString(foodCaloriesString);

          // 计算进度
          progress = foodCalories / quantity; // 重新赋值给变量 progress
          if (progress <= 1) {
            progress = progress;
          } else if (progress > 1) {
            progress = 2.0 - progress;
          } else {
            progress = 0;
          }
        } else {
          // 获取 EXERCISE BLOCK 的值并提取数字部分
          var exerciseCaloriesString =
            document.getElementById("exerciseCalories").textContent;
          var exerciseCalories = extractNumberFromString(
            exerciseCaloriesString
          );

          // 计算进度
          progress = exerciseCalories / quantity;
          if (progress > 1) {
            progress = 1;
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

      calculateRemainingCalories();
      updateGoalProgress();
    })
    .catch((error) => console.error("Error fetching goal progress:", error));
}

function searchFood() {
  const search = document.getElementById("foodSearchInput").value;

  fetch(`http://localhost:3000/searchFood?search=${search}`)
    .then((response) => response.json())
    .then((data) => {
      // 清空表格
      var tableBody = document
        .getElementById("foodTable")
        .querySelector("tbody");
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
  const search = document.getElementById("exerciseSearchInput").value;

  fetch(`http://localhost:3000/searchExercise?search=${search}`)
    .then((response) => response.json())
    .then((data) => {
      // 清空表格
      var tableBody = document
        .getElementById("exerciseTable")
        .querySelector("tbody");
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

function addMeal() {
  var mealSelected = false;
  var mealOptions = document.getElementsByName("meal");
  for (var i = 0; i < mealOptions.length; i++) {
    if (mealOptions[i].checked) {
      mealSelected = true;
      break;
    }
  }

  // 如果没有选择餐点，则提醒用户并停止执行
  if (!mealSelected) {
    alert("Please select a meal.");
    return;
  }

  const userId = localStorage.getItem("userId");
  const foodName = document.getElementById("foodName").value.trim();
  const calories = document.getElementById("foodCalories").value.trim();
  const date = today.toISOString().split("T")[0];
  const meal = getSelectedMeal();

  // 表单验证
  if (!foodName || !calories) {
    if (!foodName) {
      document.getElementById("foodName").classList.add("is-invalid");
    }
    if (!calories) {
      document.getElementById("foodCalories").classList.add("is-invalid");
    }
    return;
  }

  // 搜索食物
  fetch(`http://localhost:3000/searchFood?search=${foodName}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        // 新增食物到数据库
        return fetch(`http://localhost:3000/addFood`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ foodName, calories }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to insert food when insert meal");
            }
            return response.json();
          })
          .then(() => {
            // 再次搜索以获取新增食物的 foodId
            return fetch(`http://localhost:3000/searchFood?search=${foodName}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.length === 0) {
                  throw new Error("Failed to retrieve food after insertion");
                }
                return data[0].food_id;
              });
          });
      } else {
        return data[0].food_id;
      }
    })
    .then((foodId) => {
      // 新增meal
      return fetch(`http://localhost:3000/addMeal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, foodId, calories, meal, date }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add meal");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Meal added successfully:", data);
      alert("Meal added successfully");
    })
    .catch((error) => {
      console.error("Error adding meal:", error);
      alert("Failed to add meal");
    });
}

function addWorkout() {
  const userId = localStorage.getItem("userId");
  const type = document.getElementById("exerciseName").value.trim();
  const time = document.getElementById("minutesPerformed").value.trim();
  const date = today.toISOString().split("T")[0];
  const calories = document.getElementById("caloriesBurned").value.trim();
  const hourBurned = (calories * 60) / time;

  // 表单验证
  if (!type || !time || !calories) {
    if (!type) {
      document.getElementById("exerciseName").classList.add("is-invalid");
    }
    if (!time) {
      document.getElementById("minutesPerformed").classList.add("is-invalid");
    }
    if (!calories) {
      document.getElementById("caloriesBurned").classList.add("is-invalid");
    }
    return;
  }

  // 搜索运动
  fetch(`http://localhost:3000/searchExercise?search=${type}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        // 新增运动到数据库
        return fetch(`http://localhost:3000/addExercise`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, hourBurned }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to insert exercise when insert Workout");
            }
            return response.json();
          })
          .then((result) => {
            return result.exerciseId;
          });
      } else {
        return data[0].exercise_id;
      }
    })
    .then((exerciseId) => {
      // 新增workout
      return fetch(`http://localhost:3000/addWorkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseId, userId, time, date, calories }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add exercise data");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Exercise data added successfully:", data);
      alert("Exercise data added successfully");
    })
    .catch((error) => {
      console.error("Error adding exercise data:", error);
      alert("Failed to add exercise data");
    });
}

function getSelectedMeal() {
  const mealOptions = document.getElementsByName("meal");
  for (let i = 0; i < mealOptions.length; i++) {
    if (mealOptions[i].checked) {
      return mealOptions[i].value;
    }
  }
  return "";
}

function getSelectedMeal() {
  const meals = document.getElementsByName("meal");
  let selectedMeal = "";

  meals.forEach((meal) => {
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
      row.style.backgroundColor = "#FFD700"; // 金色
    } else if (index === 1) {
      row.style.backgroundColor = "#C0C0C0"; // 银色
    } else if (index === 2) {
      row.style.backgroundColor = "#CD7F32"; // 古铜色
    } else {
      row.style.backgroundColor = "#E6F7FF"; // 浅蓝色
    }

    // 如果 goal_id 等于 userId 则更改颜色
    var userId = localStorage.getItem("userId");
    if (rank.user_id == userId) {
      row.style.backgroundColor = "#B0E0E6"; // 用户的浅蓝色
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

  if (rank.goal_type === "Diet") {
    progress = rank.total_meal_calories / rank.quantity;
    if (progress > 1) {
      progress = 2 - progress;
    }
  } else if (rank.goal_type === "Exercise") {
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
        selectActivityLevel(profile.activity);

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

async function updateInfo() {
  const user_name = document.getElementById("updateName").value.trim();
  const weight = document.getElementById("updateWeight").value.trim();
  const height = document.getElementById("updateHeight").value.trim();
  const activity = document.getElementById("activityLevel").value.trim();
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(`http://localhost:3000/updateinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user_name,
        weight: weight,
        height: height,
        activity: activity,
        userId: userId,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.message === "Update successful") {
        // 更新本地存储中的用户名
        saveUserDataToLocalStorage(userId, user_name);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } else {
      alert(`提交失敗: ${data.message}`);
    }
  } catch (error) {
    console.error("錯誤:", error);
    alert("提交時發生錯誤。");
  }
}

async function updatePassword() {
  const password = document.getElementById("updatePassword").value.trim();
  const repeatPassword = document.getElementById("checkPassword").value.trim();
  const userId = localStorage.getItem("userId");
  console.log(password);

  if (password !== repeatPassword) {
    alert("密碼不一致");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/updatepassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        userId: userId,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.message === "Update successful") {
        alert("Update successful");
        window.location.href = `profile.html`;
      } else {
        alert(data.message);
        window.location.href = `profile.html`;
      }
    } else {
      alert(`密碼提交失敗: ${data.message}`);
      window.location.href = `profile.html`;
    }
  } catch (error) {
    console.error("錯誤:", error);
    alert("密碼提交時發生錯誤。");
  }
}

async function updateGoal() {
  var goalType = document.getElementById("goalType").value;
  var calories = document.getElementById("updateCalories").value.trim();
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(`http://localhost:3000/updategoal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: goalType,
        calories: calories,
        userId: userId,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.message === "Goal update successful") {
        alert("目標更新成功");
      } else {
        alert(data.message);
      }
    } else {
      alert(`目標提交失敗: ${data.message}`);
    }
  } catch (error) {
    console.error("錯誤:", error);
    alert("目標提交時發生錯誤。");
  }
}

function checkEmail() {
  const email = document.getElementById("inputEmail").value.trim();

  if (!email) {
    document.getElementById("email-feedback").style.display = !email
      ? "block"
      : "none";

    return;
  }

  fetch(`http://localhost:3000/checkEmail?email=${email}`)
    .then((response) => response.json())
    .then((data) => {
      // 如果没有数据，显示一条消息
      if (data.length === 0) {
        alert("User not found, please register first.");
      } else {
        console.log(data);
        question = data[0].question;
        window.location.href = `verify.html?email=${encodeURIComponent(
          email
        )}&question=${encodeURIComponent(question)}`;
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// 函数获取 URL 中的查询参数
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function checkAnswer() {
  const email = getQueryParam("email");
  const question = getQueryParam("question");
  const answer = document.getElementById("verified-answer").value.trim();

  if (!answer) {
    document.getElementById("answer-feedback").style.display = !answer
      ? "block"
      : "none";

    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/checkAnswer?email=${encodeURIComponent(
        email
      )}&question=${encodeURIComponent(question)}&answer=${encodeURIComponent(
        answer
      )}`
    );
    const data = await response.json();

    if (data.length === 0) {
      alert("Not correct answer");
    } else {
      alert(
        "Your password is 1234567890, please log in immediately and change your password."
      );
      window.location.href = "login.html";

      // Change password
      const newPassword = "1234567890"; // Assuming this is the new temporary password

      const passwordResponse = await fetch(
        `http://localhost:3000/changepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
            email: email,
          }),
        }
      );

      const passwordData = await passwordResponse.json();

      if (passwordResponse.ok) {
        if (passwordData.message === "Password update successful") {
          console.log("Password change successful");
        } else {
          console.log(passwordData.message);
        }
      } else {
        console.log(`Password change failed: ${passwordData.message}`);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
