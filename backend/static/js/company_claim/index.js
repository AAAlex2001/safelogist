/**
 * Оркестратор модального окна (3 шага)
 * Шаги: static/js/company_claim/step1.js, step2.js, step3.js
 */
(function() {
    'use strict';

    let modal = null;
    let currentStep = 1;
    const totalSteps = 3;

    const ctx = {
        formData: {
            lastName: '',
            firstName: '',
            middleName: '',
            phone: '',
            companyName: '',
            position: '',
            email: '',
            documentName: ''
        },
        selectedFile: null,
        goToStep,
        closeModal
    };

    function initModal() {
        modal = document.getElementById('companyClaimModal');
        if (!modal) return;

        setupModalEvents();

        if (window.CompanyClaimSteps) {
            window.CompanyClaimSteps.initStep1 && window.CompanyClaimSteps.initStep1(ctx);
            window.CompanyClaimSteps.initStep2 && window.CompanyClaimSteps.initStep2(ctx);
            window.CompanyClaimSteps.initStep3 && window.CompanyClaimSteps.initStep3(ctx);
        }
    }

    function setupModalEvents() {
        const closeBtn = modal.querySelector('.company-claim-modal-close');
        const overlay = modal.querySelector('.company-claim-modal-overlay');

        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        if (!modal) return;
        
        const steps = modal.querySelectorAll('.company-claim-step');
        steps.forEach(s => s.style.display = 'none');
        
        const targetStep = modal.querySelector(`.company-claim-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.style.display = 'block';
            currentStep = step;
            
            setTimeout(() => {
                const form = targetStep.querySelector('form');
                if (form) {
                    const submitBtn = form.querySelector('.company-claim-btn-primary');
                    if (submitBtn) {
                        const event = new Event('input', { bubbles: true });
                        const firstInput = form.querySelector('.company-claim-input');
                        if (firstInput) {
                            firstInput.dispatchEvent(event);
                        }
                    }
                }
            }, 30);
        }
    }

    function openModal() {
        if (!modal) {
            initModal();
            setTimeout(openModal, 50);
            return;
        }
        
        goToStep(1);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            resetForms();
        }
    }

    function resetForms() {
        if (!modal) return;

        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        Object.keys(ctx.formData).forEach(key => {
            ctx.formData[key] = '';
        });
        
        const buttons = modal.querySelectorAll('.company-claim-btn-primary');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const errors = modal.querySelectorAll('.company-claim-msg');
        errors.forEach(err => err.classList.add('hide'));
        
        ctx.selectedFile = null;
        const filePill = document.getElementById('claim-file-pill');
        const fileNameEl = document.getElementById('claim-file-name');
        if (filePill) filePill.classList.add('hide');
        if (fileNameEl) fileNameEl.textContent = '';
        
        currentStep = 1;
    }

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

    window.openCompanyClaimModal = openModal;
    window.closeCompanyClaimModal = closeModal;
})();

