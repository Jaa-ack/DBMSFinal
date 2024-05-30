document.getElementById('countButton').addEventListener('click', function() {
    fetch('http://localhost:3000/count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `文章總數：${data.count}`;
        })
        .catch(error => console.error('錯誤：', error));
});

document.addEventListener("DOMContentLoaded", function() {
    loadArticles();
});

function loadArticles() {
    fetch('/articles')
    .then(response => response.json())
    .then(data => {
        displayArticles(data);
    })
    .catch(error => {
        console.error('Error fetching articles:', error);
    });
}

function displayArticles(articles) {
    const articleList = document.getElementById("articleList");
    articleList.innerHTML = ""; // 清空之前的內容

    articles.forEach(article => {
        const articleItem = document.createElement("div");
        articleItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <p>User ID: ${article.user_id}</p>
        `;
        articleList.appendChild(articleItem);
    });
}
