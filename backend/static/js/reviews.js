const root = document.getElementById('reviews-root');
const lang = root?.dataset.lang || 'ru';
const emptyText = root?.dataset.empty || 'Ничего не найдено';
const basePath = `/${lang}/reviews`;
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let searchTimeout = null;
let currentResults = [];

const autocompleteContainer = document.createElement('div');
autocompleteContainer.id = 'autocomplete-results';
autocompleteContainer.className = 'autocomplete-results';
const searchBox = searchInput.closest('.search-box');
if (searchBox) {
    searchBox.appendChild(autocompleteContainer);
}

searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    if (query.length < 2) {
        autocompleteContainer.classList.remove('show');
        searchBox.classList.remove('expanded');
        setTimeout(() => {
            autocompleteContainer.innerHTML = '';
        }, 300);
        return;
    }
    
    searchTimeout = setTimeout(async function() {
        try {
            const response = await fetch(`/api/reviews/search?q=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();
            currentResults = data.companies || [];
            displayAutocompleteResults(currentResults, query);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    }, 300);
});

function displayAutocompleteResults(companies, query) {
    if (companies.length === 0) {
        autocompleteContainer.innerHTML = `<div class="autocomplete-item">${emptyText}</div>`;
        searchBox.classList.add('expanded');
        setTimeout(() => autocompleteContainer.classList.add('show'), 10);
        return;
    }
    
    autocompleteContainer.innerHTML = companies.map(company => {
        const highlightedName = company.name.replace(
            new RegExp(`(${query})`, 'gi'),
            '<strong>$1</strong>'
        );
        return `<div class="autocomplete-item" data-slug="${company.slug}">${highlightedName}</div>`;
    }).join('');
    
    searchBox.classList.add('expanded');
    setTimeout(() => autocompleteContainer.classList.add('show'), 10);
    
    autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            const slug = this.getAttribute('data-slug');
            if (slug) {
                window.location.href = `${basePath}/${slug}`;
            }
        });
    });
}

document.addEventListener('click', function(e) {
    if (!searchBox?.contains(e.target)) {
        autocompleteContainer.classList.remove('show');
        searchBox.classList.remove('expanded');
        setTimeout(() => {
            autocompleteContainer.innerHTML = '';
        }, 300);
    }
});

searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `${basePath}/search?q=${encodeURIComponent(query)}`;
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
            window.location.href = `${basePath}/search?q=${encodeURIComponent(query)}`;
        }
    }
    
    if (e.key === 'ArrowDown' && currentResults.length > 0) {
        e.preventDefault();
        const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
        if (items.length > 0) {
            items[0].focus();
        }
    }
});

