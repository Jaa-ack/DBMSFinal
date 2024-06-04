$(function() {
    // 判断 URL 中是否包含 autoload 参数
    var autoload = getUrlParameter('autoload');
    if (autoload === 'true') {
        // 自动加载文章内容
        loadArticlesAndComments();
    }
});

// 获取 URL 参数的函数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function loadArticlesAndComments() {
    // 使用 jQuery 的 AJAX 方法获取文章 JSON 数据
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
        loadComments();

        // 添加留言按钮的功能
        $(".btn-primary").click(function() {
            var newBox = document.createElement("div");
            newBox.className = "box";

            var textarea = document.createElement("textarea");
            textarea.className = "form-control";
            textarea.setAttribute("aria-label", "With textarea");

            var submitBtn = document.createElement("button");
            submitBtn.textContent = "提交";
            submitBtn.addEventListener("click", function() {
                var text = textarea.value.trim(); // Trim whitespace
                if (text !== "") {
                    var content = document.createTextNode(text);
                    newBox.innerHTML = "<h5>User</h5>";
                    newBox.appendChild(content);
                    newBox.removeChild(textarea);
                    newBox.removeChild(submitBtn);
                } else {
                    container.removeChild(newBox); // Remove box if content is empty
                }
            });

            newBox.appendChild(textarea);
            newBox.appendChild(submitBtn);

            var container = $(this).closest(".article").find(".scroll-container");
            container.prepend(newBox);
        });
    });
}

function loadComments() {
    // 使用 jQuery 的 AJAX 方法获取留言 JSON 数据
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
}

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
// $(document).ready(function() {
//     $('#searchExercise').click(function() {
//         var query = $('#exerciseSearchInput').val().trim();
        
//         if (query === "") {
//             alert("Search input cannot be empty!");
//         } else {
//             $.getJSON('exercise.json', function(data) {
//                 var filteredData = data.filter(function(item) {
//                     return item.name.toLowerCase().includes(query.toLowerCase());
//                 });
                
//                 var tableBody = $('#exerciseTable tbody');
//                 tableBody.empty(); // Clear existing data
                
//                 if (filteredData.length === 0) {
//                     tableBody.append('<tr><td colspan="3">No matching results found</td></tr>');
//                 } else {
//                     filteredData.forEach(function(item) {
//                         var tableRow = `
//                             <tr>
//                                 <td>${item.type}</td>
//                                 <td>${item.time}</td>
//                                 <td>${item.calories}</td>
//                             </tr>
//                         `;
//                         tableBody.append(tableRow);
//                     });
//                 }
//             });
//         }
//     });
// });