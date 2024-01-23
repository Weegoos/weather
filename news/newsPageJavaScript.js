console.log("Batyr");

const apiKey = '62258a344ca5405a8e27ca63ed9decef'; // Замените 'YOUR_API_KEY' на ваш реальный API ключ
const country = localStorage.getItem('country'); 
const city = localStorage.getItem('localCity');
console.log(country);
async function getNews() {
const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}&q=${city}`;

try {
const response = await fetch(apiUrl);
const data = await response.json();

// Обработка полученных данных
displayNews(data.articles);
} catch (error) {
console.error('Error fetching news:', error);
}
}

// Функция для отображения новостей
function displayNews(articles) {
const newsContainer = document.createElement('div');

articles.forEach(article => {
const articleElement = document.createElement('div');
articleElement.classList.add('articles')
articleElement.innerHTML = `
  <h2>${article.title}</h2>
  <p>${article.description}</p>
  <a href="${article.url}" target="_blank">Read more</a>
  <hr>
`;
newsContainer.appendChild(articleElement);
});

document.body.appendChild(newsContainer);
}

// Вызов функции для получения новостей при загрузке страницы
window.onload = getNews;