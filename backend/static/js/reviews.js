// Поиск компаний
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `/reviews/search?q=${encodeURIComponent(query)}`;
    }
});

// Поиск по Enter
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});

