/**
 * Шаг 2: Данные о компании
 */
(function() {
    'use strict';

    let step2Ctx = null;
    let checkStep2Validity = null;

    function initStep2(ctx) {
        step2Ctx = ctx;
        const form = document.getElementById('companyClaimFormStep2');
        if (!form) return;

        const companyNameInput = document.getElementById('companyName');
        const submitBtn = form.querySelector('.company-claim-btn-primary');
        const backBtn = form.querySelector('[data-action="back"]');
        const requiredInputs = form.querySelectorAll('.company-claim-input[required]');
        const emailInput = document.getElementById('email');
        const emailErrorMsg = document.getElementById('email-error-msg');

        checkStep2Validity = function() {
            if (!submitBtn) return;
            
            let allFilled = true;
            
            requiredInputs.forEach(input => {
                // Для disabled полей проверяем что есть значение
                if (!input.disabled && input.value.trim() === '') {
                    allFilled = false;
                } else if (input.disabled && input.value.trim() === '') {
                    allFilled = false;
                }
            });
            
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    allFilled = false;
                }
            }
            
            if (allFilled) {
                submitBtn.classList.add('active');
                submitBtn.disabled = false;
            } else {
                submitBtn.classList.remove('active');
                submitBtn.disabled = true;
            }
        };
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', checkStep2Validity);
            input.addEventListener('change', checkStep2Validity);
        });

        if (emailInput && emailErrorMsg) {
            emailInput.addEventListener('input', function() {
                emailErrorMsg.classList.add("hide");
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', function() {
                ctx.goToStep(1);
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const companyName = document.getElementById('companyName').value.trim();
            const position = document.getElementById('position').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!companyName || !position || !email) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (emailErrorMsg) {
                    emailErrorMsg.innerHTML = "Неверный формат email";
                    emailErrorMsg.classList.remove("hide");
                }
                return;
            }
            
            ctx.formData.companyName = companyName;
            ctx.formData.position = position;
            ctx.formData.email = email;
            
            ctx.goToStep(3);
        });

        checkStep2Validity();
    }
    
    // Вызывается при переходе на шаг 2
    function activateStep2() {
        if (!step2Ctx) return;
        
        const companyNameInput = document.getElementById('companyName');
        
        // Автоматически подставляем название компании и блокируем поле
        if (companyNameInput && step2Ctx.formData.companyName) {
            companyNameInput.value = step2Ctx.formData.companyName;
            companyNameInput.disabled = true;
            companyNameInput.classList.add('disabled');
        }
        
        // Перепроверяем валидность после установки значения
        if (checkStep2Validity) {
            checkStep2Validity();
        }
    }

    window.CompanyClaimSteps = window.CompanyClaimSteps || {};
    window.CompanyClaimSteps.initStep2 = initStep2;
    window.CompanyClaimSteps.activateStep2 = activateStep2;
})();

