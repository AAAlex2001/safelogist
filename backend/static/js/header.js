document.addEventListener('DOMContentLoaded', function() {
    // === ЭЛЕМЕНТЫ ===
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerMenuPanel = document.getElementById('burgerMenuPanel');
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleRight = document.getElementById('themeToggleRight');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const langBtn = document.getElementById('langBtn');
    const langPanel = document.getElementById('langPanel');
    const langBtnRight = document.getElementById('langBtnRight');
    const langPanelRight = document.getElementById('langPanelRight');
    const mobileLangBtn = document.getElementById('mobileLangBtn');
    const mobileLangPanel = document.getElementById('mobileLangPanel');
    const currentLangSpan = document.getElementById('currentLang');

    // === ТЕМА ===
    const getInitialTheme = () => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    };

    // Применяем начальную тему
    applyTheme(getInitialTheme());

    // Обработчики темы
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleRight) {
        themeToggleRight.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // === ЯЗЫК ===
    // Определяем текущий язык из URL
    const getCurrentLang = () => {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts[0] && ['ru', 'en', 'ro', 'uk'].includes(pathParts[0])) {
            return pathParts[0].toUpperCase();
        }
        return 'RU';
    };

    // Устанавливаем текущий язык
    if (currentLangSpan) {
        currentLangSpan.textContent = getCurrentLang();
    }

    // Функция закрытия всех панелей языка
    const closeAllLangPanels = () => {
        if (langPanel) langPanel.classList.remove('active');
        if (langPanelRight) langPanelRight.classList.remove('active');
        if (mobileLangPanel) mobileLangPanel.classList.remove('active');
    };

    // Переключение панели языка (desktop - logged in)
    if (langBtn && langPanel) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = langPanel.classList.contains('active');
            closeAllLangPanels();
            if (!isActive) langPanel.classList.add('active');
        });
    }

    // Переключение панели языка (desktop - logged out)
    if (langBtnRight && langPanelRight) {
        langBtnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = langPanelRight.classList.contains('active');
            closeAllLangPanels();
            if (!isActive) langPanelRight.classList.add('active');
        });
    }

    // Переключение панели языка (mobile)
    if (mobileLangBtn && mobileLangPanel) {
        mobileLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileLangPanel.classList.contains('active');
            closeAllLangPanels();
            if (!isActive) mobileLangPanel.classList.add('active');
        });
    }

    // Закрытие панели языка при клике вне
    document.addEventListener('click', (e) => {
        const clickedInsideLangContainer = 
            (langBtn?.contains(e.target) || langPanel?.contains(e.target)) ||
            (langBtnRight?.contains(e.target) || langPanelRight?.contains(e.target)) ||
            (mobileLangBtn?.contains(e.target) || mobileLangPanel?.contains(e.target));
        
        if (!clickedInsideLangContainer) {
            closeAllLangPanels();
        }
    });

    // === БУРГЕР МЕНЮ ===
    if (burgerMenu && burgerMenuPanel) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            burgerMenuPanel.classList.toggle('active');
        });

        // Закрываем меню при клике на ссылку
        const menuLinks = burgerMenuPanel.querySelectorAll('.navLink, .btn-login, .btn-register');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                burgerMenuPanel.classList.remove('active');
            });
        });

        // Закрываем меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target) && 
                !burgerMenuPanel.contains(e.target) && 
                burgerMenuPanel.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                burgerMenuPanel.classList.remove('active');
            }
        });

        // Закрываем меню при ресайзе на большой экран
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1440) {
                burgerMenu.classList.remove('active');
                burgerMenuPanel.classList.remove('active');
            }
        });
    }
});

