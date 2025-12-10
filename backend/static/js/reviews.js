// Элементы поиска
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let searchTimeout = null;
let currentResults = [];

// Создаем контейнер для результатов автопоиска
const autocompleteContainer = document.createElement('div');
autocompleteContainer.id = 'autocomplete-results';
autocompleteContainer.className = 'autocomplete-results';
// Вставляем после search-box
const searchBox = searchInput.closest('.search-box');
if (searchBox) {
    searchBox.appendChild(autocompleteContainer);
}

// Автопоиск при вводе
searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    // Очищаем предыдущий таймаут
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Если запрос слишком короткий, скрываем результаты
    if (query.length < 2) {
        autocompleteContainer.innerHTML = '';
        autocompleteContainer.style.display = 'none';
        searchBox.classList.remove('expanded');
        return;
    }
    
    // Задержка перед запросом (debounce)
    searchTimeout = setTimeout(async function() {
        try {
            const response = await fetch(`/api/reviews/search?q=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();
            currentResults = data.companies || [];
            displayAutocompleteResults(currentResults, query);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    }, 300); // 300ms задержка
});

// Показываем результаты автопоиска
function displayAutocompleteResults(companies, query) {
    if (companies.length === 0) {
        autocompleteContainer.innerHTML = '<div class="autocomplete-item">Ничего не найдено</div>';
        autocompleteContainer.style.display = 'block';
        searchBox.classList.add('expanded');
        return;
    }
    
    autocompleteContainer.innerHTML = companies.map(company => {
        // Подсвечиваем совпадение
        const highlightedName = company.name.replace(
            new RegExp(`(${query})`, 'gi'),
            '<strong>$1</strong>'
        );
        return `<div class="autocomplete-item" data-slug="${company.slug}">${highlightedName}</div>`;
    }).join('');
    
    autocompleteContainer.style.display = 'block';
    searchBox.classList.add('expanded');
    
    // Обработчики клика на результат
    autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            const slug = this.getAttribute('data-slug');
            if (slug) {
                window.location.href = `/reviews/${slug}`;
            }
        });
    });
}

// Скрываем результаты при клике вне поиска
document.addEventListener('click', function(e) {
    if (!searchBox?.contains(e.target)) {
        autocompleteContainer.style.display = 'none';
        searchBox.classList.remove('expanded');
    }
});

// Поиск по кнопке
searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `/reviews/search?q=${encodeURIComponent(query)}`;
    }
});

// Поиск по Enter
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
            window.location.href = `/reviews/search?q=${encodeURIComponent(query)}`;
        }
    }
    
    // Навигация стрелками по результатам
    if (e.key === 'ArrowDown' && currentResults.length > 0) {
        e.preventDefault();
        const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
        if (items.length > 0) {
            items[0].focus();
        }
    }
});

