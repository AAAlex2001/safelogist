/**
 * Шаг 3: Подтверждение (загрузка документа)
 */
(function() {
    'use strict';

    function initStep3(ctx) {
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
            ctx.selectedFile = null;
            ctx.formData.documentName = '';
            if (fileInput) {
                fileInput.value = '';
            }
            updateFileUI(null);
            checkStep3Validity();
        }

        function checkStep3Validity() {
            if (!submitBtn) return;
            const hasFile = !!ctx.selectedFile;
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
                    ctx.selectedFile = file;
                    ctx.formData.documentName = file.name;
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
                ctx.goToStep(2);
            });
        }

        // Сабмит шага 3
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearFileError();

            if (!ctx.selectedFile) {
                showFileError('Пожалуйста, прикрепите документ');
                return;
            }

            // Блокируем кнопку отправки
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }

            try {
                // Формируем FormData для отправки
                const formData = new FormData();
                formData.append('last_name', ctx.formData.lastName);
                formData.append('first_name', ctx.formData.firstName);
                if (ctx.formData.middleName) {
                    formData.append('middle_name', ctx.formData.middleName);
                }
                formData.append('phone', ctx.formData.phone);
                formData.append('company_name', ctx.formData.companyName);
                formData.append('position', ctx.formData.position);
                formData.append('email', ctx.formData.email);
                formData.append('document', ctx.selectedFile);

                // Отправляем на сервер
                const response = await fetch('/api/company-claim', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.detail || 'Ошибка при отправке заявки');
                }

                // Успешно отправлено
                alert(result.message || 'Заявка успешно отправлена. Мы рассмотрим её в течение 48 часов.');
                ctx.closeModal();
            } catch (error) {
                console.error('Ошибка отправки заявки:', error);
                showFileError(error.message || 'Ошибка при отправке заявки. Попробуйте позже.');
            } finally {
                // Разблокируем кнопку
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить запрос';
                }
            }
        });

        checkStep3Validity();
    }

    window.CompanyClaimSteps = window.CompanyClaimSteps || {};
    window.CompanyClaimSteps.initStep3 = initStep3;
})();

