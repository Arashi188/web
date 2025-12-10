// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Load Latest News
document.addEventListener('DOMContentLoaded', function() {
    loadLatestNews();
});

async function loadLatestNews() {
    try {
        const response = await fetch('php/api/get_news.php?limit=3');
        const news = await response.json();
        
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = news.map(item => `
            <div class="news-card">
                <div class="news-image" style="background-image: url('${item.image_path || 'images/default-news.jpg'}')"></div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    <p>${item.description.substring(0, 100)}...</p>
                    <small>${new Date(item.publish_date).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Login Page Role Selection
function setLoginRole(role) {
    document.getElementById('loginTitle').textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
    document.getElementById('userRole').value = role;
}