$(document).ready(function() {
    // 自动加载文章内容
    $.getJSON('articles.json', function(articlesData) {
        // 遍历每篇文章
        $.each(articlesData, function(index, article) {
            // 创建文章内容的 HTML
            var articleHTML = `
                <div class="article" data-article-id="${article.id}">
                    <div class="row">
                        <div class="col" style="color: rgb(4, 4, 29);">
                            <h4>${article.title}</h4>
                            <p>${article.content}</p>
                        </div>
                    </div>
                    <div class="row comments-row">
                        <div class="col d-flex align-items-center">
                            <h5>Comments</h5>
                            <div style="margin-left: 10px;"></div>
                            <button type="button" class="btn btn-primary px-2 py-1">留言</button>
                        </div>
                    </div>
                    <div class="scroll-container">
                    </div>
                </div>
                <!-- Divider -->
                <hr class="sidebar-divider">
            `;
            // 将文章内容添加到页面
            $('#articlesContainer').append(articleHTML);
        });

        // 加载并显示留言
        $.getJSON('comments.json', function(commentsData) {
            // 遍历每条留言
            $.each(commentsData, function(index, comment) {
                // 获取对应文章的容器
                var articleContainer = $(`.article[data-article-id="${comment.post_id}"]`);

                // 创建留言的 HTML
                var commentHTML = `
                    <div class="box"><h5>${comment.user}</h5>${comment.message}</div>
                `;
                // 将留言添加到对应文章的容器中
                articleContainer.find('.scroll-container').append(commentHTML);
            });
        });

        // 添加留言按钮的功能
        $(document).on('click', '.btn-primary', function() {
            // 检查页面上是否已经有一个活动的输入栏位
            if ($('.scroll-container').find('textarea').length > 0) {
                return; // 如果已经存在输入栏位，则不执行后续代码
            }

            var newBox = document.createElement("div");
            newBox.className = "box";

            var textarea = document.createElement("textarea");
            textarea.className = "form-control";
            textarea.setAttribute("aria-label", "With textarea");

            var submitBtn = document.createElement("button");
            submitBtn.textContent = "提交";
            submitBtn.className = "btn btn-primary"; // 添加样式
            submitBtn.addEventListener("click", function() {
                var text = textarea.value.trim(); // Trim whitespace
                if (text !== "") {
                    var content = document.createTextNode(text);
                    newBox.innerHTML = "<h5>User</h5>";
                    newBox.appendChild(content);
                }
                newBox.removeChild(textarea);
                newBox.removeChild(submitBtn);
                if (text === "") {
                    newBox.remove(); // Remove box if content is empty
                }
            });

            newBox.appendChild(textarea);
            newBox.appendChild(submitBtn);

            var container = $(this).closest(".article").find(".scroll-container");
            container.prepend(newBox);
        });
    });
});

// rank.html排序
$(document).ready(function() {
    $.getJSON('users.json', function(users) {
        // Sort users by today score in descending order
        users.sort(function(a, b) {
            return b.today - a.today;
        });

        users.forEach(function(user, index) {
            var progressClass;
            if (index === 0) {
                progressClass = 'bg-danger'; // First place: danger red
            } else if (index === 1) {
                progressClass = 'bg-warning'; // Second place: warning yellow
            } else if (index === 2) {
                progressClass = 'bg-success'; // Third place: success green
            } else {
                progressClass = index % 2 === 0 ? 'bg-gray-400' : 'bg-gray-600'; // Alternating gray shades
            }

            var tableRow = `
                <tr class="${progressClass}">
                    <th scope="row">${index + 1}</th>
                    <td>${user.name}</td>
                    <td>${user.today}%</td>
                    <td>
                        <div class="progress">
                            <div
                                class="progress-bar"
                                role="progressbar"
                                style="width: ${user.average}%"
                                aria-valuenow="${user.average}"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                ${user.average}%
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            $('#userTableBody').append(tableRow);
        });
    });
});

// database.html 搜尋食物
$(document).ready(function() {
    $('#searchFood').click(function() {
        var query = $('#foodSearchInput').val().trim();
        
        if (query === "") {
            alert("Search input cannot be empty!");
        } else {
            $.getJSON('food.json', function(data) {
                var filteredData = data.filter(function(item) {
                    return item.name.toLowerCase().includes(query.toLowerCase());
                });
                
                var tableBody = $('#foodTable tbody');
                tableBody.empty(); // Clear existing data
                
                if (filteredData.length === 0) {
                    tableBody.append('<tr><td colspan="3">No matching results found</td></tr>');
                } else {
                    filteredData.forEach(function(item) {
                        var tableRow = `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.portion}</td>
                                <td>${item.calories}</td>
                            </tr>
                        `;
                        tableBody.append(tableRow);
                    });
                }
            });
        }
    });
});

// database.html 搜尋運動 (有缺陷)
$(document).ready(function() {
    $('#searchExercise').click(function() {
        var query = $('#exerciseSearchInput').val().trim();
        
        if (query === "") {
            alert("Search input cannot be empty!");
        } else {
            $.getJSON('exercise.json', function(data) {
                var filteredData = data.filter(function(item) {
                    return item.type.toLowerCase().includes(query.toLowerCase());
                });
                
                var tableBody = $('#ExerciseTable tbody');
                tableBody.empty(); // Clear existing data
                
                if (filteredData.length === 0) {
                    tableBody.append('<tr><td colspan="3">No matching results found</td></tr>');
                } else {
                    filteredData.forEach(function(item) {
                        var tableRow = `
                            <tr>
                                <td>${item.type}</td>
                                <td>${item.time}</td>
                                <td>${item.calories}</td>
                            </tr>
                        `;
                        tableBody.append(tableRow);
                    });
                }
            });
        }
    });
});

// food_exercise.html 更新飲食資訊
$(document).ready(function() {
    // 加载并显示早餐数据
    loadMealData('breakfast', '#breakfastTable');

    // 加载并显示午餐数据
    loadMealData('lunch', '#lunchTable');

    // 加载并显示晚餐数据
    loadMealData('dinner', '#dinnerTable');

    // 加载运动数据
    loadExerciseData();

    // 事件监听器可以在这里添加
});

// 加载并显示餐点数据
document.addEventListener('DOMContentLoaded', function() {
    var caloriesIntake = localStorage.getItem("caloriesIntake");
    if (caloriesIntake) {
        document.querySelectorAll(".h5.mb-0.font-weight-bold.text-gray-800").forEach(function(el) {
            el.textContent = caloriesIntake; // Update all relevant fields
        });
    }
    
    var today = new Date();
    var displayDate = document.getElementById('current-date');

    function updateDisplay(date) {
        displayDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const dateString = date.toISOString().split('T')[0];
        loadMealData(dateString, 'breakfast', '#breakfastTable');
        loadMealData(dateString, 'lunch', '#lunchTable');
        loadMealData(dateString, 'dinner', '#dinnerTable');
    }

    // 加载并显示餐点数据
    function loadMealData(dateString, mealType, tableId) {
        $.getJSON('meals.json', function(data) {
            const tableBody = $(`${tableId} tbody`);
            tableBody.empty(); // 清空现有数据

            const filteredData = data.filter(item => item.date === dateString && item.type === mealType);
            if (filteredData.length === 0) {
                tableBody.append('<tr><td colspan="3">No data available for this meal</td></tr>');
            } else {
                filteredData.forEach(function(item) {
                    const tableRow = `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.portion}</td>
                            <td>${item.calories}</td>
                        </tr>
                    `;
                    tableBody.append(tableRow);
                });
            }
        }).fail(function() {
            console.error('Error loading JSON data');
        });
    }

    document.getElementById('prev-day').addEventListener('click', function() {
        today.setDate(today.getDate() - 1);
        updateDisplay(today);
    });

    document.getElementById('next-day').addEventListener('click', function() {
        today.setDate(today.getDate() + 1);
        updateDisplay(today);
    });

    // 初始加载
    updateDisplay(today);
});
