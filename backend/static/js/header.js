document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const headerNav = document.getElementById('headerNav');
    const mobileMenu = document.querySelector('.mobile-menu');
    
        // Создаем мобильное меню, если его нет
        if (!mobileMenu && headerNav) {
            const mobileMenuEl = document.createElement('div');
            mobileMenuEl.className = 'mobile-menu';
            
            // Получаем язык из URL или используем 'ru' по умолчанию
            const lang = window.location.pathname.split('/')[1] || 'ru';
            
            // Добавляем кнопку "Оставить отзыв" в начало
            const reviewBtn = document.createElement('a');
            reviewBtn.href = `/${lang}/reviews-profile/add`;
            reviewBtn.className = 'btn-add-review';
            reviewBtn.textContent = 'Оставить отзыв';
            mobileMenuEl.appendChild(reviewBtn);
            
            // Копируем навигационные ссылки
            const navLinks = headerNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const mobileLink = link.cloneNode(true);
                mobileMenuEl.appendChild(mobileLink);
            });
            
            // Добавляем кнопки смены темы и языка
            const themeLangContainer = document.createElement('div');
            themeLangContainer.className = 'mobile-menu-theme-lang';
            
            // Кнопка смены темы
            const themeBtn = document.createElement('button');
            themeBtn.className = 'mobile-menu-theme-btn';
            themeBtn.setAttribute('aria-label', 'Сменить тему');
            themeBtn.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 3V1M11 21V19M19 11H21M1 11H3M16.657 5.343L18.07 3.93M3.93 18.07L5.344 16.656M5.344 5.342L3.93 3.93M18.07 18.07L16.656 16.656M11 16C12.3261 16 13.5979 15.4732 14.5355 14.5355C15.4732 13.5979 16 12.3261 16 11C16 9.67392 15.4732 8.40215 14.5355 7.46447C13.5979 6.52678 12.3261 6 11 6C9.67392 6 8.40215 6.52678 7.46447 7.46447C6.52678 8.40215 6 9.67392 6 11C6 12.3261 6.52678 13.5979 7.46447 14.5355C8.40215 15.4732 9.67392 16 11 16Z" stroke="#4D4D4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
        // === Тема: применение и переключение ===
        const getInitialTheme = () => {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        };

        applyTheme(getInitialTheme());

        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });

            // Контейнер для языка (кнопка + флаги в одном боксе)
            const langContainer = document.createElement('div');
            langContainer.className = 'lang-container';
            langContainer.style.position = 'relative';
            
            // Кнопка смены языка
            const langBtn = document.createElement('button');
            langBtn.className = 'mobile-menu-lang-btn';
            langBtn.setAttribute('aria-label', 'Сменить язык');
            langBtn.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.66667 7.66667H20.3333M1.66667 14.3333H20.3333M1 11C1 12.3132 1.25866 13.6136 1.7612 14.8268C2.26375 16.0401 3.00035 17.1425 3.92893 18.0711C4.85752 18.9997 5.95991 19.7363 7.17317 20.2388C8.38642 20.7413 9.68678 21 11 21C12.3132 21 13.6136 20.7413 14.8268 20.2388C16.0401 19.7363 17.1425 18.9997 18.0711 18.0711C18.9997 17.1425 19.7363 16.0401 20.2388 14.8268C20.7413 13.6136 21 12.3132 21 11C21 8.34784 19.9464 5.8043 18.0711 3.92893C16.1957 2.05357 13.6522 1 11 1C8.34784 1 5.8043 2.05357 3.92893 3.92893C2.05357 5.8043 1 8.34784 1 11Z" stroke="#4D4D4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.4423 1C8.5705 3.99957 7.57813 7.46429 7.57812 11C7.57813 14.5357 8.5705 18.0004 10.4423 21M11.5535 1C13.4253 3.99957 14.4177 7.46429 14.4177 11C14.4177 14.5357 13.4253 18.0004 11.5535 21" stroke="#4D4D4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>RU</span>
            `;
            
            // Панель с флагами языков
            const langPanel = document.createElement('div');
            langPanel.className = 'lang-selector-panel';
            langPanel.innerHTML = `
                <div class="lang-selector-content">
                    <button class="lang-option" data-lang="ru">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5" stroke-width="0.5"/>
                            <mask id="mask0_1945_17170" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
                                <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white" stroke-width="0.5"/>
                            </mask>
                            <g mask="url(#mask0_1945_17170)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3346H28V6.66797H0V13.3346Z" fill="#0C47B7"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 19.9987H28V13.332H0V19.9987Z" fill="#E53B35"/>
                            </g>
                        </svg>
                        <span>RU</span>
                    </button>
                    <button class="lang-option" data-lang="en">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="28" height="20" rx="2" fill="white"/>
                            <mask id="mask0_1945_17520" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
                                <rect width="28" height="20" rx="2" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_1945_17520)">
                                <path d="M28 20H0V18.667H28V20ZM28 17.333H0V16H28V17.333ZM28 14.667H0V13.333H28V14.667ZM28 12H0V10.667H28V12ZM28 9.33301H0V8H28V9.33301ZM28 6.66699H0V5.33301H28V6.66699ZM28 4H0V2.66699H28V4ZM28 1.33301H0V0H28V1.33301Z" fill="#D02F44"/>
                                <rect width="12" height="9.33333" fill="#46467F"/>
                                <g filter="url(#filter0_d_1945_17520)">
                                    <path d="M1.99902 6.66504C2.36706 6.66522 2.66504 6.96395 2.66504 7.33203C2.66504 7.70011 2.36706 7.99885 1.99902 7.99902C1.63083 7.99902 1.33203 7.70022 1.33203 7.33203C1.33203 6.96384 1.63083 6.66504 1.99902 6.66504ZM4.66504 6.66504C5.03323 6.66504 5.33203 6.96384 5.33203 7.33203C5.33203 7.70022 5.03323 7.99902 4.66504 7.99902C4.297 7.99885 3.99902 7.70011 3.99902 7.33203C3.99902 6.96395 4.297 6.66522 4.66504 6.66504ZM7.33203 6.66504C7.70022 6.66504 7.99902 6.96384 7.99902 7.33203C7.99902 7.70022 7.70022 7.99902 7.33203 7.99902C6.96384 7.99902 6.66504 7.70022 6.66504 7.33203C6.66504 6.96384 6.96384 6.66504 7.33203 6.66504ZM9.99902 6.66504C10.3671 6.66522 10.665 6.96395 10.665 7.33203C10.665 7.70011 10.3671 7.99885 9.99902 7.99902C9.63083 7.99902 9.33203 7.70022 9.33203 7.33203C9.33203 6.96384 9.63083 6.66504 9.99902 6.66504ZM3.33203 5.33203C3.70022 5.33203 3.99902 5.63083 3.99902 5.99902C3.99885 6.36706 3.70011 6.66504 3.33203 6.66504C2.96395 6.66504 2.66521 6.36706 2.66504 5.99902C2.66504 5.63083 2.96384 5.33203 3.33203 5.33203ZM5.99902 5.33203C6.36706 5.33221 6.66504 5.63094 6.66504 5.99902C6.66486 6.36696 6.36696 6.66486 5.99902 6.66504C5.63094 6.66504 5.33221 6.36706 5.33203 5.99902C5.33203 5.63083 5.63083 5.33203 5.99902 5.33203ZM8.66504 5.33203C9.03323 5.33203 9.33203 5.63083 9.33203 5.99902C9.33186 6.36706 9.03312 6.66504 8.66504 6.66504C8.29711 6.66486 7.9992 6.36696 7.99902 5.99902C7.99902 5.63094 8.297 5.33221 8.66504 5.33203ZM1.99902 3.99902C2.36696 3.9992 2.66486 4.29711 2.66504 4.66504C2.66504 5.03312 2.36706 5.33186 1.99902 5.33203C1.63083 5.33203 1.33203 5.03323 1.33203 4.66504C1.33221 4.297 1.63094 3.99902 1.99902 3.99902ZM4.66504 3.99902C5.03312 3.99902 5.33186 4.297 5.33203 4.66504C5.33203 5.03323 5.03323 5.33203 4.66504 5.33203C4.297 5.33186 3.99902 5.03312 3.99902 4.66504C3.9992 4.29711 4.29711 3.9992 4.66504 3.99902ZM7.33203 3.99902C7.70011 3.99902 7.99885 4.297 7.99902 4.66504C7.99902 5.03323 7.70022 5.33203 7.33203 5.33203C6.96384 5.33203 6.66504 5.03323 6.66504 4.66504C6.66522 4.297 6.96395 3.99902 7.33203 3.99902ZM9.99902 3.99902C10.367 3.9992 10.6649 4.29711 10.665 4.66504C10.665 5.03312 10.3671 5.33186 9.99902 5.33203C9.63083 5.33203 9.33203 5.03323 9.33203 4.66504C9.33221 4.297 9.63094 3.99902 9.99902 3.99902ZM3.33203 2.66504C3.70022 2.66504 3.99902 2.96384 3.99902 3.33203C3.99902 3.70022 3.70022 3.99902 3.33203 3.99902C2.96384 3.99902 2.66504 3.70022 2.66504 3.33203C2.66504 2.96384 2.96384 2.66504 3.33203 2.66504ZM5.99902 2.66504C6.36706 2.66521 6.66504 2.96395 6.66504 3.33203C6.66504 3.70011 6.36706 3.99885 5.99902 3.99902C5.63083 3.99902 5.33203 3.70022 5.33203 3.33203C5.33203 2.96384 5.63083 2.66504 5.99902 2.66504ZM8.66504 2.66504C9.03323 2.66504 9.33203 2.96384 9.33203 3.33203C9.33203 3.70022 9.03323 3.99902 8.66504 3.99902C8.297 3.99885 7.99902 3.70011 7.99902 3.33203C7.99902 2.96395 8.297 2.66521 8.66504 2.66504ZM1.99902 1.33203C2.36706 1.33221 2.66504 1.63094 2.66504 1.99902C2.66486 2.36696 2.36696 2.66486 1.99902 2.66504C1.63094 2.66504 1.33221 2.36706 1.33203 1.99902C1.33203 1.63083 1.63083 1.33203 1.99902 1.33203ZM4.66504 1.33203C5.03323 1.33203 5.33203 1.63083 5.33203 1.99902C5.33186 2.36706 5.03312 2.66504 4.66504 2.66504C4.29711 2.66486 3.9992 2.36696 3.99902 1.99902C3.99902 1.63094 4.297 1.33221 4.66504 1.33203ZM7.33203 1.33203C7.70022 1.33203 7.99902 1.63083 7.99902 1.99902C7.99885 2.36706 7.70011 2.66504 7.33203 2.66504C6.96395 2.66504 6.66522 2.36706 6.66504 1.99902C6.66504 1.63083 6.96384 1.33203 7.33203 1.33203ZM9.99902 1.33203C10.3671 1.33221 10.665 1.63094 10.665 1.99902C10.6649 2.36696 10.367 2.66486 9.99902 2.66504C9.63094 2.66504 9.33221 2.36706 9.33203 1.99902C9.33203 1.63083 9.63083 1.33203 9.99902 1.33203Z" fill="url(#paint0_linear_1945_17520)"/>
                                </g>
                            </g>
                            <defs>
                                <filter id="filter0_d_1945_17520" x="1.33203" y="1.33203" width="9.33203" height="7.66797" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="1"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1945_17520"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1945_17520" result="shape"/>
                                </filter>
                                <linearGradient id="paint0_linear_1945_17520" x1="1.33203" y1="1.33203" x2="1.33203" y2="7.99902" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white"/>
                                    <stop offset="1" stop-color="#F0F0F0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>EN</span>
                    </button>
                    <button class="lang-option" data-lang="ro">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="28" height="20" rx="2" fill="white"/>
                            <mask id="mask0_1945_17164" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
                                <rect width="28" height="20" rx="2" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_1945_17164)">
                                <rect x="13.332" width="14.6667" height="20" fill="#E5253D"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 20H9.33333V0H0V20Z" fill="#0A3D9C"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33203 20H18.6654V0H9.33203V20Z" fill="#FFD955"/>
                            </g>
                        </svg>
                        <span>RO</span>
                    </button>
                    <button class="lang-option" data-lang="uk">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="28" height="20" rx="2" fill="white"/>
                            <mask id="mask0_1945_17500" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
                                <rect width="28" height="20" rx="2" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_1945_17500)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10.6667H28V0H0V10.6667Z" fill="#156DD1"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 20.0013H28V10.668H0V20.0013Z" fill="#FFD948"/>
                            </g>
                        </svg>
                        <span>UK</span>
                    </button>
                </div>
            `;
            
            // Добавляем кнопку и панель в контейнер
            langContainer.appendChild(langBtn);
            langContainer.appendChild(langPanel);
            
            // Состояние: показываем кнопку или флаги
            let showFlags = false;
            
            // Обработчик переключения
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showFlags = !showFlags;
                langBtn.classList.toggle('hidden', showFlags);
                langPanel.classList.toggle('active', showFlags);
            });
            
            // Обработчики выбора языка
            const langOptions = langPanel.querySelectorAll('.lang-option');
            langOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const selectedLang = this.getAttribute('data-lang');
                    const currentPath = window.location.pathname;
                    const pathParts = currentPath.split('/').filter(p => p);
                    
                    // Определяем текущий язык
                    const currentLang = pathParts[0] && ['ru', 'en', 'ro', 'uk'].includes(pathParts[0]) 
                        ? pathParts[0] 
                        : 'ru';
                    
                    // Заменяем язык в пути
                    if (pathParts[0] && ['ru', 'en', 'ro', 'uk'].includes(pathParts[0])) {
                        pathParts[0] = selectedLang;
                    } else {
                        pathParts.unshift(selectedLang);
                    }
                    
                    const newPath = '/' + pathParts.join('/') + window.location.search;
                    window.location.href = newPath;
                });
            });
            
            // Закрываем панель при клике вне её
            document.addEventListener('click', function(e) {
                if (!langContainer.contains(e.target)) {
                    showFlags = false;
                    langBtn.classList.remove('hidden');
                    langPanel.classList.remove('active');
                }
            });
            
            themeLangContainer.appendChild(themeBtn);
            themeLangContainer.appendChild(langContainer);
            mobileMenuEl.appendChild(themeLangContainer);
            
            // Добавляем кнопки
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'header-right';
            
            const loginBtn = document.createElement('a');
            loginBtn.href = `/${lang}/login`;
            loginBtn.className = 'btn-login';
            loginBtn.textContent = 'Войти';
            
            const registerBtn = document.createElement('a');
            registerBtn.href = `/${lang}/register`;
            registerBtn.className = 'btn-register';
            registerBtn.textContent = 'Зарегистрироваться';
            
            buttonsContainer.appendChild(loginBtn);
            buttonsContainer.appendChild(registerBtn);
            mobileMenuEl.appendChild(buttonsContainer);
            
            document.body.appendChild(mobileMenuEl);
        }
    
    const mobileMenuEl = document.querySelector('.mobile-menu');
    const headerEl = document.querySelector('.main-header');
    // Disable scroll lock when mobile menu opens — allow page to scroll.
    const setScrollLock = (/* locked */) => {
        // intentionally no-op to avoid setting `overflow: hidden` on body
    };
    
    if (burgerMenu && mobileMenuEl) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            mobileMenuEl.classList.toggle('active');
            
            // Блокируем скролл при открытом меню
            setScrollLock(mobileMenuEl.classList.contains('active'));
        });
        
        // Закрываем меню при клике на ссылку
        const mobileLinks = mobileMenuEl.querySelectorAll('.nav-link, .btn-login, .btn-register');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                mobileMenuEl.classList.remove('active');
                setScrollLock(false);
            });
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!burgerMenu.contains(e.target) && 
                !mobileMenuEl.contains(e.target) && 
                mobileMenuEl.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                mobileMenuEl.classList.remove('active');
                setScrollLock(false);
            }
        });
    }
});

