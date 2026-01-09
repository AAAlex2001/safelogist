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

    // === AUTH STATE ELEMENTS ===
    const headerLoggedIn = document.getElementById('headerLoggedIn');
    const headerNotLoggedIn = document.getElementById('headerNotLoggedIn');
    const headerNav = document.getElementById('headerNav');
    const burgerMenuLogged = document.getElementById('burgerMenuLogged');
    const burgerMenuNotLogged = document.getElementById('burgerMenuNotLogged');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const profileMenuButton = document.getElementById('profileMenuButton');

    // === AUTH CHECK AND UI TOGGLE ===
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const checkAuthAndUpdateUI = async () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken') || getCookie('authToken');

        if (token) {
            // User is logged in - show logged-in UI
            if (headerLoggedIn) headerLoggedIn.style.display = 'flex';
            if (headerNotLoggedIn) headerNotLoggedIn.style.display = 'none';
            if (headerNav) headerNav.style.display = 'none';
            if (burgerMenuLogged) burgerMenuLogged.style.display = 'block';
            if (burgerMenuNotLogged) burgerMenuNotLogged.style.display = 'none';

            // Add logged class to burger menu panel
            if (burgerMenuPanel) burgerMenuPanel.classList.add('BurgerMenu--logged');

            // Fetch user profile data
            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (userNameDisplay) {
                        userNameDisplay.textContent = userData.name || userData.first_name || 'User';
                    }
                    if (userEmailDisplay) {
                        userEmailDisplay.textContent = userData.email || '';
                    }
                } else if (response.status === 401) {
                    // Token is invalid - clear and show not-logged UI
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('isLoggedIn');
                    document.cookie = 'authToken=; path=/; max-age=0';
                    showNotLoggedUI();
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        } else {
            // User is not logged in - show not-logged UI
            showNotLoggedUI();
        }
    };

    const showNotLoggedUI = () => {
        if (headerLoggedIn) headerLoggedIn.style.display = 'none';
        if (headerNotLoggedIn) headerNotLoggedIn.style.display = 'flex';
        if (headerNav) headerNav.style.display = 'flex';
        if (burgerMenuLogged) burgerMenuLogged.style.display = 'none';
        if (burgerMenuNotLogged) burgerMenuNotLogged.style.display = 'block';
        if (burgerMenuPanel) burgerMenuPanel.classList.remove('BurgerMenu--logged');
    };

    // Run auth check on page load
    checkAuthAndUpdateUI();

    // === PROFILE MENU BUTTON (opens burger menu for logged user) ===
    if (profileMenuButton && burgerMenu && burgerMenuPanel) {
        profileMenuButton.addEventListener('click', () => {
            burgerMenu.classList.add('active');
            burgerMenuPanel.classList.add('active');
        });
    }

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

    // === REGION SELECTOR (для залогиненного пользователя) ===
    const regionButton = document.getElementById('regionButton');
    const regionDropdown = document.getElementById('regionDropdown');
    const regionValue = document.getElementById('regionValue');
    const mobileRegionButton = document.getElementById('mobileRegionButton');
    const mobileRegionDropdown = document.getElementById('mobileRegionDropdown');
    const mobileRegionValue = document.getElementById('mobileRegionValue');
    const regionOptions = document.querySelectorAll('.regionOption');

    // Получаем сохраненный регион из localStorage
    const getSavedRegion = () => {
        return localStorage.getItem('selectedRegion') || 'cis';
    };

    // Сохраняем регион в localStorage
    const saveRegion = (region) => {
        localStorage.setItem('selectedRegion', region);
    };

    // Закрытие всех dropdown регионов
    const closeAllRegionDropdowns = () => {
        if (regionDropdown) regionDropdown.classList.remove('active');
        if (regionButton) regionButton.classList.remove('active');
        if (mobileRegionDropdown) mobileRegionDropdown.classList.remove('active');
        if (mobileRegionButton) mobileRegionButton.classList.remove('active');
    };

    // Переключение dropdown региона (desktop)
    if (regionButton && regionDropdown) {
        regionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = regionDropdown.classList.contains('active');
            closeAllLangPanels();
            closeAllRegionDropdowns();
            if (!isActive) {
                regionDropdown.classList.add('active');
                regionButton.classList.add('active');
            }
        });
    }

    // Переключение dropdown региона (mobile)
    if (mobileRegionButton && mobileRegionDropdown) {
        mobileRegionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileRegionDropdown.classList.contains('active');
            closeAllRegionDropdowns();
            if (!isActive) {
                mobileRegionDropdown.classList.add('active');
                mobileRegionButton.classList.add('active');
            }
        });
    }

    // Выбор региона (обновляет оба селектора)
    if (regionOptions.length > 0) {
        regionOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const selectedValue = option.getAttribute('data-value');
                const selectedText = option.textContent.trim();
                
                // Убираем selected у всех, добавляем выбранному значению во всех селекторах
                regionOptions.forEach(opt => {
                    if (opt.getAttribute('data-value') === selectedValue) {
                        opt.classList.add('selected');
                    } else {
                        opt.classList.remove('selected');
                    }
                });
                
                // Обновляем текст кнопок
                if (regionValue) regionValue.textContent = selectedText;
                if (mobileRegionValue) mobileRegionValue.textContent = selectedText;
                
                // Сохраняем в localStorage
                saveRegion(selectedValue);
                
                // Закрываем dropdown
                closeAllRegionDropdowns();
            });
        });

        // Устанавливаем начальный регион для всех селекторов
        const savedRegion = getSavedRegion();
        let savedText = '';
        regionOptions.forEach(option => {
            if (option.getAttribute('data-value') === savedRegion) {
                option.classList.add('selected');
                savedText = option.textContent.trim();
            }
        });
        if (savedText) {
            if (regionValue) regionValue.textContent = savedText;
            if (mobileRegionValue) mobileRegionValue.textContent = savedText;
        }
    }

    // Закрытие dropdown региона при клике вне
    document.addEventListener('click', (e) => {
        const clickedInsideRegion =
            (regionButton?.contains(e.target) || regionDropdown?.contains(e.target)) ||
            (mobileRegionButton?.contains(e.target) || mobileRegionDropdown?.contains(e.target));

        if (!clickedInsideRegion) {
            closeAllRegionDropdowns();
        }
    });

    // === LOGOUT (для залогиненного пользователя) ===
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    // Очищаем localStorage
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('isLoggedIn');

                    // Очищаем cookie
                    document.cookie = 'authToken=; path=/; max-age=0';

                    // Определяем текущий язык для редиректа
                    const pathParts = window.location.pathname.split('/').filter(p => p);
                    const lang = pathParts[0] && ['ru', 'en', 'ro', 'uk'].includes(pathParts[0]) ? pathParts[0] : 'ru';

                    // Перенаправляем на страницу логина
                    window.location.href = '/' + lang + '/login';
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
                // В случае ошибки всё равно перенаправляем на логин
                const pathParts = window.location.pathname.split('/').filter(p => p);
                const lang = pathParts[0] && ['ru', 'en', 'ro', 'uk'].includes(pathParts[0]) ? pathParts[0] : 'ru';
                window.location.href = '/' + lang + '/login';
            }
        });
    }

    // === Закрытие меню при клике на menuTabs ссылки ===
    if (burgerMenuPanel) {
        const menuTabLinks = burgerMenuPanel.querySelectorAll('.menuTabs a');
        menuTabLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (burgerMenu) burgerMenu.classList.remove('active');
                burgerMenuPanel.classList.remove('active');
            });
        });
    }
});