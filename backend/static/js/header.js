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
            reviewBtn.href = `/${lang}/reviews/add`;
            reviewBtn.className = 'btn-login';
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
            
            themeLangContainer.appendChild(themeBtn);
            themeLangContainer.appendChild(langBtn);
            mobileMenuEl.appendChild(themeLangContainer);
            
            // Добавляем кнопки
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'header-right';
            
            const loginBtn = document.createElement('a');
            loginBtn.href = `/${lang}/login`;
            loginBtn.className = 'btn-login';
            loginBtn.textContent = 'Войти';
            
            const registerBtn = document.createElement('a');
            registerBtn.href = `/${lang}/registration`;
            registerBtn.className = 'btn-register';
            registerBtn.textContent = 'Зарегистрироваться';
            
            buttonsContainer.appendChild(loginBtn);
            buttonsContainer.appendChild(registerBtn);
            mobileMenuEl.appendChild(buttonsContainer);
            
            document.body.appendChild(mobileMenuEl);
        }
    
    const mobileMenuEl = document.querySelector('.mobile-menu');
    const headerEl = document.querySelector('.main-header');
    const setScrollLock = (locked) => {
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (locked) {
            document.body.dataset.scrollLocked = '1';
            document.body.style.overflow = 'hidden';
            if (scrollBarWidth > 0) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
                if (headerEl) headerEl.style.paddingRight = `${scrollBarWidth}px`;
            }
        } else {
            if (document.body.dataset.scrollLocked) {
                delete document.body.dataset.scrollLocked;
            }
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (headerEl) headerEl.style.paddingRight = '';
        }
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

