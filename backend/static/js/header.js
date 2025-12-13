document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const headerNav = document.getElementById('headerNav');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Создаем мобильное меню, если его нет
    if (!mobileMenu && headerNav) {
        const mobileMenuEl = document.createElement('div');
        mobileMenuEl.className = 'mobile-menu';
        
        // Копируем навигационные ссылки
        const navLinks = headerNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileMenuEl.appendChild(mobileLink);
        });
        
        // Получаем язык из URL или используем 'ru' по умолчанию
        const lang = window.location.pathname.split('/')[1] || 'ru';
        
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

