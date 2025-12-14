/**
 * Шаг 1: Контактное лицо
 * Требует window.intlTelInput (если доступен)
 */
(function() {
    'use strict';

    function initStep1(ctx) {
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
            ctx.formData.lastName = lastName;
            ctx.formData.firstName = firstName;
            ctx.formData.middleName = middleName;
            ctx.formData.phone = phoneNumber;
            
            ctx.goToStep(2);
        });
    }

    window.CompanyClaimSteps = window.CompanyClaimSteps || {};
    window.CompanyClaimSteps.initStep1 = initStep1;
})();

