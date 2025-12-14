/**
 * Модальное окно для подтверждения компании
 * Многошаговая форма
 */
(function() {
    'use strict';

    let modal = null;
    let currentStep = 1;
    const totalSteps = 3;
    let selectedFile = null;
    
    // Данные формы
    const formData = {
        // Шаг 1
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        // Шаг 2
        companyName: '',
        position: '',
        email: '',
        // Шаг 3
        documentName: ''
    };

    function initModal() {
        modal = document.getElementById('companyClaimModal');
        if (!modal) return;

        setupModalEvents();
        setupStep1();
        setupStep2();
        setupStep3();
    }

    function setupModalEvents() {
        const closeBtn = modal.querySelector('.company-claim-modal-close');
        const overlay = modal.querySelector('.company-claim-modal-overlay');

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ==================== ШАГ 1 ====================
    function setupStep1() {
        const form = document.getElementById('companyClaimFormStep1');
        if (!form) return;

        const phoneInput = document.getElementById('phone');
        const errorMsg = document.getElementById('phone-error-msg');
        const submitBtn = form.querySelector('.company-claim-btn-primary');
        const requiredInputs = form.querySelectorAll('.company-claim-input[required]');

        // Инициализация intl-tel-input
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
            
            const errorMap = [
                "Неверный номер",
                "Неверный код страны",
                "Слишком короткий номер",
                "Слишком длинный номер",
                "Неверный номер"
            ];
            
            phoneInput.resetPhoneValidation = () => {
                phoneInput.classList.remove("error");
                if (errorMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("hide");
                }
            };
            
            phoneInput.showPhoneError = (msg) => {
                phoneInput.classList.add("error");
                if (errorMsg) {
                    errorMsg.innerHTML = msg;
                    errorMsg.classList.remove("hide");
                }
            };
            
            phoneInput.errorMap = errorMap;
            
            phoneInput.addEventListener('change', phoneInput.resetPhoneValidation);
            phoneInput.addEventListener('keyup', phoneInput.resetPhoneValidation);
        }

        // Проверка валидности формы
        function checkStep1Validity() {
            if (!submitBtn) return;
            
            let allFilled = true;
            
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            if (phoneInput && phoneInput.intlTelInputInstance) {
                const iti = phoneInput.intlTelInputInstance;
                if (!phoneInput.value.trim() || !iti.isValidNumber()) {
                    allFilled = false;
                }
            } else if (phoneInput) {
                const digits = phoneInput.value.replace(/\D/g, '');
                if (digits.length < 10) {
                    allFilled = false;
                }
            }
            
            if (allFilled) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', checkStep1Validity);
            input.addEventListener('change', checkStep1Validity);
        });

        // Обработка отправки формы шага 1
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phoneInput = document.getElementById('phone');
            const lastName = document.getElementById('lastName').value.trim();
            const firstName = document.getElementById('firstName').value.trim();
            const middleName = document.getElementById('middleName').value.trim();
            
            if (!lastName || !firstName) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Валидация телефона
            let phoneNumber = '';
            if (phoneInput && phoneInput.intlTelInputInstance) {
                const iti = phoneInput.intlTelInputInstance;
                
                if (phoneInput.resetPhoneValidation) {
                    phoneInput.resetPhoneValidation();
                }
                
                if (!phoneInput.value.trim()) {
                    if (phoneInput.showPhoneError) {
                        phoneInput.showPhoneError("Обязательное поле");
                    }
                    return;
                } else if (iti.isValidNumber()) {
                    phoneNumber = iti.getNumber();
                } else {
                    if (phoneInput.showPhoneError && phoneInput.errorMap) {
                        const errorCode = iti.getValidationError();
                        const msg = phoneInput.errorMap[errorCode] || "Неверный номер";
                        phoneInput.showPhoneError(msg);
                    }
                    return;
                }
            } else {
                const digits = phoneInput.value.replace(/\D/g, '');
                if (digits.length < 10) {
                    alert('Пожалуйста, введите полный номер телефона');
                    return;
                }
                phoneNumber = '+7' + digits;
            }
            
            // Сохраняем данные
            formData.lastName = lastName;
            formData.firstName = firstName;
            formData.middleName = middleName;
            formData.phone = phoneNumber;
            
            // Переходим к шагу 2
            goToStep(2);
        });
    }

    // ==================== ШАГ 2 ====================
    function setupStep2() {
        const form = document.getElementById('companyClaimFormStep2');
        if (!form) return;

        const submitBtn = form.querySelector('.company-claim-btn-primary');
        const backBtn = form.querySelector('[data-action="back"]');
        const requiredInputs = form.querySelectorAll('.company-claim-input[required]');
        const emailInput = document.getElementById('email');
        const emailErrorMsg = document.getElementById('email-error-msg');

        // Проверка валидности формы
        function checkStep2Validity() {
            if (!submitBtn) return;
            
            let allFilled = true;
            
            requiredInputs.forEach(input => {
                if (input.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            // Проверка email
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    allFilled = false;
                }
            }
            
            if (allFilled) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', checkStep2Validity);
            input.addEventListener('change', checkStep2Validity);
        });

        // Кнопка "Назад"
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                goToStep(1);
            });
        }

        // Обработка отправки формы шага 2
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const companyName = document.getElementById('companyName').value.trim();
            const position = document.getElementById('position').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!companyName || !position || !email) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (emailErrorMsg) {
                    emailErrorMsg.innerHTML = "Неверный формат email";
                    emailErrorMsg.classList.remove("hide");
                }
                return;
            }
            
            // Сохраняем данные
            formData.companyName = companyName;
            formData.position = position;
            formData.email = email;
            
            console.log('Данные формы (шаг 2):', formData);
            
            // Переходим на шаг 3
            goToStep(3);
        });

        // Сброс ошибки email при вводе
        if (emailInput && emailErrorMsg) {
            emailInput.addEventListener('input', function() {
                emailErrorMsg.classList.add("hide");
            });
        }
    }

    // ==================== ШАГ 3 ====================
    function setupStep3() {
        const form = document.getElementById('companyClaimFormStep3');
        if (!form) return;

        const submitBtn = form.querySelector('.company-claim-btn-primary');
        const backBtn = form.querySelector('[data-action="back-step2"]');
        const fileInput = document.getElementById('claimFileInput');
        const filePill = document.getElementById('claim-file-pill');
        const fileNameEl = document.getElementById('claim-file-name');
        const fileRemove = document.getElementById('claim-file-remove');
        const fileError = document.getElementById('claim-file-error');

        function showFileError(msg) {
            if (fileError) {
                fileError.textContent = msg;
                fileError.classList.remove('hide');
            }
        }

        function clearFileError() {
            if (fileError) {
                fileError.textContent = '';
                fileError.classList.add('hide');
            }
        }

        function updateFileUI(file) {
            if (file && fileNameEl && filePill) {
                fileNameEl.textContent = file.name;
                filePill.classList.remove('hide');
            } else if (filePill) {
                filePill.classList.add('hide');
            }
        }

        function clearFile() {
            selectedFile = null;
            formData.documentName = '';
            if (fileInput) {
                fileInput.value = '';
            }
            updateFileUI(null);
            checkStep3Validity();
        }

        function checkStep3Validity() {
            if (!submitBtn) return;
            const hasFile = !!selectedFile;
            if (hasFile) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }

        // Обработчик выбора файла
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                clearFileError();
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                if (file) {
                    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
                    const tooBig = file.size > 10 * 1024 * 1024;
                    if (!allowed.includes(file.type)) {
                        showFileError('Допустимые форматы: PDF, JPG, PNG');
                        clearFile();
                        return;
                    }
                    if (tooBig) {
                        showFileError('Файл превышает 10 МБ');
                        clearFile();
                        return;
                    }
                    selectedFile = file;
                    formData.documentName = file.name;
                    updateFileUI(file);
                } else {
                    clearFile();
                }
                checkStep3Validity();
            });
        }

        // Удаление файла
        if (fileRemove) {
            fileRemove.addEventListener('click', function() {
                clearFileError();
                clearFile();
            });
        }

        // Кнопка "Назад"
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                clearFileError();
                goToStep(2);
            });
        }

        // Сабмит шага 3
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFileError();

            if (!selectedFile) {
                showFileError('Пожалуйста, прикрепите документ');
                return;
            }

            // TODO: отправка данных на сервер вместе с файлом
            console.log('Данные формы:', formData);
            console.log('Файл:', selectedFile);

            closeModal();
        });

        checkStep3Validity();
    }

    // ==================== НАВИГАЦИЯ ====================
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        // Скрываем все шаги
        const steps = modal.querySelectorAll('.company-claim-step');
        steps.forEach(s => {
            s.style.display = 'none';
        });
        
        // Показываем нужный шаг
        const targetStep = modal.querySelector(`.company-claim-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.style.display = 'block';
            currentStep = step;
            
            // Проверяем валидность нового шага
            setTimeout(() => {
                const form = targetStep.querySelector('form');
                if (form) {
                    const submitBtn = form.querySelector('.company-claim-btn-primary');
                    if (submitBtn) {
                        // Триггерим проверку валидности
                        const event = new Event('input', { bubbles: true });
                        const firstInput = form.querySelector('.company-claim-input');
                        if (firstInput) {
                            firstInput.dispatchEvent(event);
                        }
                    }
                }
            }, 50);
        }
    }

    function openModal() {
        if (!modal) {
            initModal();
            setTimeout(openModal, 100);
            return;
        }
        
        // Сбрасываем на первый шаг
        goToStep(1);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Сбрасываем форму
            resetForms();
        }
    }

    function resetForms() {
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Сбрасываем данные
        Object.keys(formData).forEach(key => {
            formData[key] = '';
        });
        
        // Сбрасываем состояние кнопок
        const buttons = modal.querySelectorAll('.company-claim-btn-primary');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Скрываем ошибки
        const errors = modal.querySelectorAll('.company-claim-msg');
        errors.forEach(err => err.classList.add('hide'));
        
        // Сброс файла
        selectedFile = null;
        const filePill = document.getElementById('claim-file-pill');
        const fileNameEl = document.getElementById('claim-file-name');
        if (filePill) filePill.classList.add('hide');
        if (fileNameEl) fileNameEl.textContent = '';
        
        currentStep = 1;
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        initModal();

        const myCompanyBtn = document.getElementById('myCompanyBtn') || document.querySelector('.btn.ghost');
        if (myCompanyBtn) {
            myCompanyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            });
        }
    });

    // Экспортируем функции
    window.openCompanyClaimModal = openModal;
    window.closeCompanyClaimModal = closeModal;
})();
