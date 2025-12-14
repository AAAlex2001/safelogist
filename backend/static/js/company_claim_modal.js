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

        // Инициализация intl-tel-input
        const phoneInput = document.getElementById('phone');
        const errorMsg = document.getElementById('phone-error-msg');
        const validMsg = document.getElementById('phone-valid-msg');
        const submitBtn = form ? form.querySelector('.company-claim-submit-btn') : null;
        const requiredInputs = form ? form.querySelectorAll('.company-claim-input[required]') : [];
        
        if (phoneInput && window.intlTelInput) {
            const iti = window.intlTelInput(phoneInput, {
                initialCountry: "ru",
                preferredCountries: ["ru", "kz", "by", "ua"],
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/utils.js",
                separateDialCode: false,
                nationalMode: false,
                autoFormat: true,
                autoPlaceholder: "aggressive"
            });
            
            phoneInput.intlTelInputInstance = iti;
            
            // Карта ошибок валидации
            const errorMap = [
                "Неверный номер",
                "Неверный код страны",
                "Слишком короткий номер",
                "Слишком длинный номер",
                "Неверный номер"
            ];
            
            // Функция сброса ошибок
            const resetPhoneValidation = () => {
                phoneInput.classList.remove("error");
                if (errorMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("hide");
                }
                if (validMsg) {
                    validMsg.classList.add("hide");
                }
            };
            
            // Функция показа ошибки
            const showPhoneError = (msg) => {
                phoneInput.classList.add("error");
                if (errorMsg) {
                    errorMsg.innerHTML = msg;
                    errorMsg.classList.remove("hide");
                }
                if (validMsg) {
                    validMsg.classList.add("hide");
                }
            };
            
            // Функция показа валидного номера (не показываем сообщение, только скрываем ошибки)
            const showPhoneValid = () => {
                phoneInput.classList.remove("error");
                if (errorMsg) {
                    errorMsg.classList.add("hide");
                }
                // Валидное сообщение не показываем - только скрываем его
                if (validMsg) {
                    validMsg.classList.add("hide");
                }
            };
            
            // Сброс при изменении
            phoneInput.addEventListener('change', resetPhoneValidation);
            phoneInput.addEventListener('keyup', resetPhoneValidation);
            
            // Сохраняем функции для использования в handleSubmit
            phoneInput.resetPhoneValidation = resetPhoneValidation;
            phoneInput.showPhoneError = showPhoneError;
            phoneInput.showPhoneValid = showPhoneValid;
            phoneInput.errorMap = errorMap;
        }
        
        // Функция проверки валидности формы и изменения стиля кнопки
        function checkFormValidity() {
            if (!submitBtn) return;
            
            let allFilled = true;
            
            // Проверяем обязательные поля
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            // Проверяем валидность телефона
            if (phoneInput && phoneInput.intlTelInputInstance) {
                const iti = phoneInput.intlTelInputInstance;
                if (!phoneInput.value.trim() || !iti.isValidNumber()) {
                    allFilled = false;
                }
            } else if (phoneInput) {
                // Fallback проверка
                const digits = phoneInput.value.replace(/\D/g, '');
                if (digits.length < 10) {
                    allFilled = false;
                }
            }
            
            // Меняем стиль кнопки
            if (allFilled) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }
        
        // Отслеживаем изменения во всех полях
        if (form) {
            requiredInputs.forEach(input => {
                input.addEventListener('input', checkFormValidity);
                input.addEventListener('change', checkFormValidity);
            });
            
            // Также проверяем при инициализации
            setTimeout(checkFormValidity, 100);
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
        
        const phoneInput = document.getElementById('phone');
        const lastName = document.getElementById('lastName').value.trim();
        const firstName = document.getElementById('firstName').value.trim();
        const middleName = document.getElementById('middleName').value.trim();
        
        // Валидация обязательных полей
        if (!lastName || !firstName) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Валидация телефона
        let phoneNumber = '';
        if (phoneInput && phoneInput.intlTelInputInstance) {
            const iti = phoneInput.intlTelInputInstance;
            
            // Сбрасываем предыдущие ошибки
            if (phoneInput.resetPhoneValidation) {
                phoneInput.resetPhoneValidation();
            }
            
            // Проверяем валидность
            if (!phoneInput.value.trim()) {
                if (phoneInput.showPhoneError) {
                    phoneInput.showPhoneError("Обязательное поле");
                }
                return;
            } else if (iti.isValidNumber()) {
                phoneNumber = iti.getNumber();
                // Скрываем ошибки, но не показываем валидное сообщение
                if (phoneInput.resetPhoneValidation) {
                    phoneInput.resetPhoneValidation();
                }
            } else {
                // Показываем ошибку валидации
                if (phoneInput.showPhoneError && phoneInput.errorMap) {
                    const errorCode = iti.getValidationError();
                    const msg = phoneInput.errorMap[errorCode] || "Неверный номер";
                    phoneInput.showPhoneError(msg);
                }
                return;
            }
        } else {
            // Fallback если библиотека не загрузилась
            const digits = phoneInput.value.replace(/\D/g, '');
            if (digits.length < 10) {
                alert('Пожалуйста, введите полный номер телефона');
                return;
            }
            phoneNumber = '+7' + digits;
        }
        
        const formData = {
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            phone: phoneNumber
        };

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

