/**
 * Модальное окно для подтверждения компании
 */
(function() {
    'use strict';

    let modal = null;
    let form = null;
    let closeBtn = null;
    let overlay = null;

    function initModal() {
        // Модалка должна быть уже в HTML через include
        // Если её нет, создаем программно
        if (!document.getElementById('companyClaimModal')) {
            createModalProgrammatically();
        }
        setupModal();
    }

    function createModalProgrammatically() {
        // Модалка уже должна быть в HTML, но на случай если её нет
        const modalHTML = `
            <div id="companyClaimModal" class="company-claim-modal">
                <div class="company-claim-modal-overlay"></div>
                <div class="company-claim-modal-content">
                    <button class="company-claim-modal-close" aria-label="Закрыть">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="company-claim-modal-header">
                        <h2 class="company-claim-modal-title">Подтвердите, что вы представляете компанию</h2>
                        <p class="company-claim-modal-step">Шаг 1 из 3: Контактное лицо</p>
                    </div>
                    <form class="company-claim-form" id="companyClaimForm">
                        <div class="company-claim-form-group">
                            <label for="lastName" class="company-claim-label">Фамилия</label>
                            <input type="text" id="lastName" name="lastName" class="company-claim-input" placeholder="Введите фамилию" required>
                        </div>
                        <div class="company-claim-form-group">
                            <label for="firstName" class="company-claim-label">Имя</label>
                            <input type="text" id="firstName" name="firstName" class="company-claim-input" placeholder="Введите имя" required>
                        </div>
                        <div class="company-claim-form-group">
                            <label for="middleName" class="company-claim-label">Отчество</label>
                            <input type="text" id="middleName" name="middleName" class="company-claim-input" placeholder="Введите отчество">
                        </div>
                        <div class="company-claim-form-group">
                            <label for="phone" class="company-claim-label">Номер телефона</label>
                            <div class="company-claim-phone-wrapper">
                                <div class="company-claim-phone-flag">
                                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="#F5F5F5" stroke-width="0.5"/>
                                        <mask id="mask0_phone" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="20">
                                            <rect x="0.25" y="0.25" width="27.5" height="19.5" rx="1.75" fill="white" stroke="white" stroke-width="0.5"/>
                                        </mask>
                                        <g mask="url(#mask0_phone)">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3346H28V6.66797H0V13.3346Z" fill="#0C47B7"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 19.9987H28V13.332H0V19.9987Z" fill="#E53B35"/>
                                        </g>
                                    </svg>
                                </div>
                                <span class="company-claim-phone-code">+7</span>
                                <input type="tel" id="phone" name="phone" class="company-claim-input company-claim-phone-input" placeholder="Введите номер телефона" required>
                            </div>
                        </div>
                        <button type="submit" class="company-claim-submit-btn">Далее</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    function setupModal() {
        modal = document.getElementById('companyClaimModal');
        if (!modal) return;

        form = document.getElementById('companyClaimForm');
        closeBtn = modal.querySelector('.company-claim-modal-close');
        overlay = modal.querySelector('.company-claim-modal-overlay');

        // Закрытие по клику на overlay
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Закрытие по клику на кнопку закрытия
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Обработка отправки формы
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        // Маска для телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                // Форматируем: XXX XXX XX XX
                let formatted = '';
                if (value.length > 0) {
                    formatted = value.slice(0, 3);
                    if (value.length > 3) {
                        formatted += ' ' + value.slice(3, 6);
                    }
                    if (value.length > 6) {
                        formatted += ' ' + value.slice(6, 8);
                    }
                    if (value.length > 8) {
                        formatted += ' ' + value.slice(8, 10);
                    }
                }
                e.target.value = formatted;
            });
        }
    }

    function openModal() {
        if (!modal) {
            initModal();
            // Подождем немного, чтобы модалка успела создать
            setTimeout(openModal, 100);
            return;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            lastName: document.getElementById('lastName').value.trim(),
            firstName: document.getElementById('firstName').value.trim(),
            middleName: document.getElementById('middleName').value.trim(),
            phone: '+7' + document.getElementById('phone').value.replace(/\D/g, '')
        };

        // Валидация
        if (!formData.lastName || !formData.firstName || !formData.phone || formData.phone.length < 12) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        console.log('Отправка данных:', formData);
        // TODO: Отправить данные на сервер
        
        // Пока просто закрываем модалку
        // В будущем здесь будет переход на следующий шаг
        closeModal();
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        initModal();

        // Находим кнопку "Это моя компания" и добавляем обработчик
        const myCompanyBtn = document.getElementById('myCompanyBtn') || document.querySelector('.btn.ghost');
        if (myCompanyBtn) {
            myCompanyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            });
        }
    });

    // Экспортируем функции для глобального доступа
    window.openCompanyClaimModal = openModal;
    window.closeCompanyClaimModal = closeModal;
})();

