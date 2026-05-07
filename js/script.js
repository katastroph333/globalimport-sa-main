// This file contains JavaScript functionality for the GlobalImport S.A. website.
// It includes handling for the responsive navigation bar and hamburger menu toggle.

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href*="index.html#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            let targetId;
            
            if (href.includes('#')) {
                targetId = href.split('#')[1];
            } else if (href.startsWith('#')) {
                targetId = href.substring(1);
            }
            
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            }
        });
    });

    // Password strength indicator - will be updated in contact and access validation section

    // Character counter for reference textarea
    const referenceTextarea = document.getElementById('reference');
    if (referenceTextarea) {
        const counter = document.createElement('div');
        counter.id = 'char-counter';
        counter.style.fontSize = '12px';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '-10px';
        counter.style.marginBottom = '15px';
        referenceTextarea.parentNode.insertBefore(counter, referenceTextarea.nextSibling);

        function updateCounter() {
            const remaining = 200 - referenceTextarea.value.length;
            counter.textContent = `${referenceTextarea.value.length}/200 caracteres`;
            if (remaining < 0) {
                counter.style.color = 'red';
            } else {
                counter.style.color = '#666';
            }
        }

        referenceTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial call
    }

    // Form validation functions
    function validateFullName(name) {
        // Solo letras y espacios, mínimo 3 caracteres, máximo 60
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return name.length >= 3 && name.length <= 60 && nameRegex.test(name.trim());
    }

    function validateBirthDate(birthDate) {
        // Usuario debe ser mayor de 18 años
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    function validateRUT(rut) {
        // Limpiar el RUT de puntos y guiones
        rut = rut.replace(/\./g, '').replace(/-/g, '').trim();
        
        // Solo números, 7-8 dígitos
        const rutRegex = /^\d{7,8}$/;
        if (!rutRegex.test(rut)) return false;
        
        // Algoritmo de validación RUT chileno
        const rutDigits = rut.split('');
        const verifier = parseInt(rutDigits.pop()); // Último dígito es el verificador
        const rutNumber = rutDigits.join('');
        
        let sum = 0;
        let multiplier = 2;
        
        // Calcular suma ponderada desde el final hacia el inicio
        for (let i = rutNumber.length - 1; i >= 0; i--) {
            sum += parseInt(rutNumber[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        
        const expectedVerifier = 11 - (sum % 11);
        let actualVerifier;
        
        if (expectedVerifier === 11) {
            actualVerifier = 0;
        } else if (expectedVerifier === 10) {
            actualVerifier = 1; // K se representa como 1 en algunos sistemas
        } else {
            actualVerifier = expectedVerifier;
        }
        
        return verifier === actualVerifier;
    }

    function validateSelect(selectId) {
        const select = document.getElementById(selectId);
        return select && select.value !== "" && select.value !== "Seleccione";
    }

    // Contact and Access validation functions
    function validateEmail(email) {
        // Formato válido: debe contener @ y dominio
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validateEmailMatch(email, confirmEmail) {
        // Deben coincidir exactamente
        return email.trim() === confirmEmail.trim() && email.trim() !== "";
    }

    function validatePassword(password) {
        // Mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 carácter especial
        if (password.length < 8) return false;
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        
        return hasUppercase && hasNumber && hasSpecialChar;
    }

    function validatePasswordMatch(password, confirmPassword) {
        // Deben coincidir exactamente
        return password === confirmPassword && password !== "";
    }

    function validatePhone(phone) {
        // Solo dígitos y puede incluir +, -, espacios. Mínimo 8 dígitos numéricos
        const phoneDigits = phone.replace(/[\s\-+]/g, '');
        const phoneRegex = /^\d+$/;
        return phoneDigits.length >= 8 && phoneRegex.test(phoneDigits);
    }

    // Address validation functions
    function validateCountry(country) {
        // No puede estar vacío
        return country.trim() !== "" && country !== "Seleccione";
    }

    function validateProvince(province) {
        // No puede estar vacío
        return province.trim() !== "";
    }

    function validateCity(city) {
        // Solo letras y espacios, mínimo 2 caracteres
        const cityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return city.trim().length >= 2 && cityRegex.test(city.trim());
    }

    function validateStreet(street) {
        // No puede estar vacío, mínimo 5 caracteres
        return street.trim().length >= 5;
    }

    function validatePostalCode(postalCode) {
        // Solo alfanumérico, entre 4 y 10 caracteres
        const postalRegex = /^[a-zA-Z0-9]+$/;
        const cleanPostal = postalCode.replace(/[\s\-\.]/g, '');
        return cleanPostal.length >= 4 && cleanPostal.length <= 10 && postalRegex.test(cleanPostal);
    }

    function validateReference(reference) {
        // Si se completa, no puede superar los 200 caracteres (ya es forzado por maxlength)
        return reference.length <= 200;
    }

    // Preferences and terms validation functions
    function validateInterestCategories() {
        // Al menos una categoría debe estar seleccionada
        const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
        return checkboxes.length > 0;
    }

    function validateClientType() {
        // El tipo de cliente debe estar seleccionado
        const radioButtons = document.querySelectorAll('input[name="client-type"]:checked');
        return radioButtons.length > 0;
    }

    function validateTermsCheckbox() {
        // Terms and Conditions checkbox debe estar marcado
        const termsCheckbox = document.getElementById('terms');
        return termsCheckbox && termsCheckbox.checked;
    }

    function validatePrivacyCheckbox() {
        // Privacy Policy checkbox debe estar marcado
        const privacyCheckbox = document.getElementById('privacy');
        return privacyCheckbox && privacyCheckbox.checked;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '-10px';
            errorDiv.style.marginBottom = '10px';
            errorDiv.textContent = message;
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    // Form submission validation
    const registrationForm = document.querySelector('form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Clear all previous errors
            document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(msg => msg.remove());
            
            // Validate full name
            const nameField = document.getElementById('name');
            if (!nameField || !nameField.value.trim()) {
                showError('name', 'El nombre completo es obligatorio.');
                isValid = false;
            } else if (!validateFullName(nameField.value)) {
                showError('name', 'El nombre debe contener solo letras y espacios (3-60 caracteres).');
                isValid = false;
            }
            
            // Validate birth date
            const dobField = document.getElementById('dob');
            if (!dobField || !dobField.value) {
                showError('dob', 'La fecha de nacimiento es obligatoria.');
                isValid = false;
            } else if (!validateBirthDate(dobField.value)) {
                showError('dob', 'Debes ser mayor de 18 años para registrarte.');
                isValid = false;
            }
            
            // Validate RUT
            const rutField = document.getElementById('rut');
            if (!rutField || !rutField.value.trim()) {
                showError('rut', 'El RUT es obligatorio.');
                isValid = false;
            } else if (!validateRUT(rutField.value.replace(/\./g, '').replace(/-/g, ''))) {
                showError('rut', 'El RUT ingresado no es válido.');
                isValid = false;
            }
            
            // Validate gender
            if (!validateSelect('gender')) {
                showError('gender', 'Debes seleccionar un género.');
                isValid = false;
            }
            
            // Validate nationality
            if (!validateSelect('nationality')) {
                showError('nationality', 'Debes seleccionar una nacionalidad.');
                isValid = false;
            }

            // Validate email
            const emailField = document.getElementById('email');
            if (!emailField || !emailField.value.trim()) {
                showError('email', 'El correo electrónico es obligatorio.');
                isValid = false;
            } else if (!validateEmail(emailField.value)) {
                showError('email', 'Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).');
                isValid = false;
            }

            // Validate confirm email
            const confirmEmailField = document.getElementById('confirm-email');
            if (!confirmEmailField || !confirmEmailField.value.trim()) {
                showError('confirm-email', 'Debes confirmar tu correo electrónico.');
                isValid = false;
            } else if (!validateEmailMatch(emailField.value, confirmEmailField.value)) {
                showError('confirm-email', 'Los correos electrónicos no coinciden.');
                isValid = false;
            }

            // Validate password
            const passwordField = document.getElementById('password');
            if (!passwordField || !passwordField.value) {
                showError('password', 'La contraseña es obligatoria.');
                isValid = false;
            } else if (!validatePassword(passwordField.value)) {
                showError('password', 'La contraseña debe tener mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 carácter especial (!@#$%^&*).');
                isValid = false;
            }

            // Validate confirm password
            const confirmPasswordField = document.getElementById('confirm-password');
            if (!confirmPasswordField || !confirmPasswordField.value) {
                showError('confirm-password', 'Debes confirmar tu contraseña.');
                isValid = false;
            } else if (!validatePasswordMatch(passwordField.value, confirmPasswordField.value)) {
                showError('confirm-password', 'Las contraseñas no coinciden.');
                isValid = false;
            }

            // Validate phone
            const phoneField = document.getElementById('phone');
            if (!phoneField || !phoneField.value.trim()) {
                showError('phone', 'El teléfono es obligatorio.');
                isValid = false;
            } else if (!validatePhone(phoneField.value)) {
                showError('phone', 'Ingresa un teléfono válido con al menos 8 dígitos.');
                isValid = false;
            }

            // Validate delivery country
            if (!validateCountry(document.getElementById('delivery-country').value)) {
                showError('delivery-country', 'Debes seleccionar un país.');
                isValid = false;
            }

            // Validate province
            const provinceField = document.getElementById('province');
            if (!provinceField || !provinceField.value.trim()) {
                showError('province', 'La provincia/estado es obligatoria.');
                isValid = false;
            } else if (!validateProvince(provinceField.value)) {
                showError('province', 'La provincia/estado no puede estar vacía.');
                isValid = false;
            }

            // Validate city
            const cityField = document.getElementById('delivery-city');
            if (!cityField || !cityField.value.trim()) {
                showError('delivery-city', 'La ciudad es obligatoria.');
                isValid = false;
            } else if (!validateCity(cityField.value)) {
                showError('delivery-city', 'La ciudad debe contener solo letras y espacios (mínimo 2 caracteres).');
                isValid = false;
            }

            // Validate street
            const streetField = document.getElementById('street');
            if (!streetField || !streetField.value.trim()) {
                showError('street', 'La calle y número es obligatoria.');
                isValid = false;
            } else if (!validateStreet(streetField.value)) {
                showError('street', 'La calle y número debe tener al menos 5 caracteres.');
                isValid = false;
            }

            // Validate postal code
            const postalCodeField = document.getElementById('postal-code');
            if (!postalCodeField || !postalCodeField.value.trim()) {
                showError('postal-code', 'El código postal es obligatorio.');
                isValid = false;
            } else if (!validatePostalCode(postalCodeField.value)) {
                showError('postal-code', 'El código postal debe ser alfanumérico y contener entre 4 y 10 caracteres.');
                isValid = false;
            }

            // Validate interest categories
            if (!validateInterestCategories()) {
                // Show error on the fieldset containing checkboxes
                const interestFieldset = document.querySelector('fieldset:first-of-type');
                if (interestFieldset) {
                    interestFieldset.classList.add('error');
                    const existingError = interestFieldset.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = 'Debes seleccionar al menos una categoría de interés.';
                    interestFieldset.parentNode.insertBefore(errorDiv, interestFieldset.nextSibling);
                }
                isValid = false;
            }

            // Validate client type
            if (!validateClientType()) {
                // Show error on the fieldset containing radio buttons
                const clientTypeFieldset = document.querySelector('fieldset:nth-of-type(2)');
                if (clientTypeFieldset) {
                    clientTypeFieldset.classList.add('error');
                    const existingError = clientTypeFieldset.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = 'Debes seleccionar un tipo de cliente.';
                    clientTypeFieldset.parentNode.insertBefore(errorDiv, clientTypeFieldset.nextSibling);
                }
                isValid = false;
            }

            // Validate terms checkbox
            if (!validateTermsCheckbox()) {
                showError('terms', 'Debes aceptar los Términos y Condiciones.');
                isValid = false;
            }

            // Validate privacy checkbox
            if (!validatePrivacyCheckbox()) {
                showError('privacy', 'Debes aceptar la Política de Privacidad.');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Real-time validation for personal data fields
    const nameField = document.getElementById('name');
    if (nameField) {
        nameField.addEventListener('blur', function() {
            if (this.value.trim() && !validateFullName(this.value)) {
                showError('name', 'El nombre debe contener solo letras y espacios (3-60 caracteres).');
            } else {
                clearError('name');
            }
        });
        nameField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateFullName(this.value)) {
                clearError('name');
            }
        });
    }

    const dobField = document.getElementById('dob');
    if (dobField) {
        dobField.addEventListener('blur', function() {
            if (this.value && !validateBirthDate(this.value)) {
                showError('dob', 'Debes ser mayor de 18 años para registrarte.');
            } else {
                clearError('dob');
            }
        });
        dobField.addEventListener('change', function() {
            if (this.classList.contains('error') && validateBirthDate(this.value)) {
                clearError('dob');
            }
        });
    }

    const rutField = document.getElementById('rut');
    if (rutField) {
        rutField.addEventListener('blur', function() {
            if (this.value.trim() && !validateRUT(this.value.replace(/\./g, '').replace(/-/g, ''))) {
                showError('rut', 'El RUT ingresado no es válido.');
            } else {
                clearError('rut');
            }
        });
        rutField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateRUT(this.value.replace(/\./g, '').replace(/-/g, ''))) {
                clearError('rut');
            }
        });
    }

    const genderField = document.getElementById('gender');
    if (genderField) {
        genderField.addEventListener('change', function() {
            if (this.classList.contains('error') && validateSelect('gender')) {
                clearError('gender');
            }
        });
    }

    const nationalityField = document.getElementById('nationality');
    if (nationalityField) {
        nationalityField.addEventListener('change', function() {
            if (this.classList.contains('error') && validateSelect('nationality')) {
                clearError('nationality');
            }
        });
    }

    // Real-time validation for contact and access fields
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value.trim() && !validateEmail(this.value)) {
                showError('email', 'Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).');
            } else {
                clearError('email');
            }
        });
        emailField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateEmail(this.value)) {
                clearError('email');
            }
        });
    }

    const confirmEmailField = document.getElementById('confirm-email');
    if (confirmEmailField && emailField) {
        confirmEmailField.addEventListener('blur', function() {
            if (this.value.trim() && !validateEmailMatch(emailField.value, this.value)) {
                showError('confirm-email', 'Los correos electrónicos no coinciden.');
            } else if (this.value.trim()) {
                clearError('confirm-email');
            }
        });
        confirmEmailField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateEmailMatch(emailField.value, this.value)) {
                clearError('confirm-email');
            }
        });
    }

    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            // Update password strength indicator
            const strengthText = document.getElementById('strength-text');
            if (strengthText) {
                const password = this.value;
                if (validatePassword(password)) {
                    strengthText.textContent = 'Fuerte';
                    strengthText.style.color = 'white';
                    strengthText.style.backgroundColor = '#27ae60';
                } else if (password.length >= 6) {
                    strengthText.textContent = 'Media';
                    strengthText.style.color = 'white';
                    strengthText.style.backgroundColor = '#f39c12';
                } else {
                    strengthText.textContent = 'Débil';
                    strengthText.style.color = 'white';
                    strengthText.style.backgroundColor = '#e74c3c';
                }
            }
            
            if (this.classList.contains('error') && validatePassword(this.value)) {
                clearError('password');
            }
        });
    }

    const confirmPasswordField = document.getElementById('confirm-password');
    if (confirmPasswordField && passwordField) {
        confirmPasswordField.addEventListener('blur', function() {
            if (this.value && !validatePasswordMatch(passwordField.value, this.value)) {
                showError('confirm-password', 'Las contraseñas no coinciden.');
            } else if (this.value) {
                clearError('confirm-password');
            }
        });
        confirmPasswordField.addEventListener('input', function() {
            if (this.classList.contains('error') && validatePasswordMatch(passwordField.value, this.value)) {
                clearError('confirm-password');
            }
        });
    }

    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value.trim() && !validatePhone(this.value)) {
                showError('phone', 'Ingresa un teléfono válido con al menos 8 dígitos.');
            } else {
                clearError('phone');
            }
        });
        phoneField.addEventListener('input', function() {
            if (this.classList.contains('error') && validatePhone(this.value)) {
                clearError('phone');
            }
        });
    }

    // Real-time validation for address fields
    const deliveryCountryField = document.getElementById('delivery-country');
    if (deliveryCountryField) {
        deliveryCountryField.addEventListener('change', function() {
            if (this.classList.contains('error') && validateCountry(this.value)) {
                clearError('delivery-country');
            }
        });
    }

    const provinceField = document.getElementById('province');
    if (provinceField) {
        provinceField.addEventListener('blur', function() {
            if (this.value.trim() && !validateProvince(this.value)) {
                showError('province', 'La provincia/estado no puede estar vacía.');
            } else {
                clearError('province');
            }
        });
        provinceField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateProvince(this.value)) {
                clearError('province');
            }
        });
    }

    const deliveryCityField = document.getElementById('delivery-city');
    if (deliveryCityField) {
        deliveryCityField.addEventListener('blur', function() {
            if (this.value.trim() && !validateCity(this.value)) {
                showError('delivery-city', 'La ciudad debe contener solo letras y espacios (mínimo 2 caracteres).');
            } else {
                clearError('delivery-city');
            }
        });
        deliveryCityField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateCity(this.value)) {
                clearError('delivery-city');
            }
        });
    }

    const streetField = document.getElementById('street');
    if (streetField) {
        streetField.addEventListener('blur', function() {
            if (this.value.trim() && !validateStreet(this.value)) {
                showError('street', 'La calle y número debe tener al menos 5 caracteres.');
            } else {
                clearError('street');
            }
        });
        streetField.addEventListener('input', function() {
            if (this.classList.contains('error') && validateStreet(this.value)) {
                clearError('street');
            }
        });
    }

    const postalCodeField = document.getElementById('postal-code');
    if (postalCodeField) {
        postalCodeField.addEventListener('blur', function() {
            if (this.value.trim() && !validatePostalCode(this.value)) {
                showError('postal-code', 'El código postal debe ser alfanumérico y contener entre 4 y 10 caracteres.');
            } else {
                clearError('postal-code');
            }
        });
        postalCodeField.addEventListener('input', function() {
            if (this.classList.contains('error') && validatePostalCode(this.value)) {
                clearError('postal-code');
            }
        });
    }

    // Real-time validation for preferences and terms
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const interestFieldset = document.querySelector('fieldset:first-of-type');
            if (interestFieldset && interestFieldset.classList.contains('error')) {
                if (validateInterestCategories()) {
                    interestFieldset.classList.remove('error');
                    const errorMessage = interestFieldset.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            }
        });
    });

    const clientTypeRadios = document.querySelectorAll('input[name="client-type"]');
    clientTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const clientTypeFieldset = document.querySelector('fieldset:nth-of-type(2)');
            if (clientTypeFieldset && clientTypeFieldset.classList.contains('error')) {
                if (validateClientType()) {
                    clientTypeFieldset.classList.remove('error');
                    const errorMessage = clientTypeFieldset.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            }
        });
    });

    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            if (this.classList.contains('error') && validateTermsCheckbox()) {
                clearError('terms');
            }
        });
    }

    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            if (this.classList.contains('error') && validatePrivacyCheckbox()) {
                clearError('privacy');
            }
        });
    }

    // Reset button confirmation
    const resetButton = document.querySelector('.btn-secondary');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            if (!confirm('¿Estás seguro de que quieres limpiar el formulario? Se perderán todos los datos ingresados.')) {
                e.preventDefault();
            }
        });
    }
});