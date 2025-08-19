// Authentication Form Validation and Firebase Integration

document.addEventListener('DOMContentLoaded', function() {
    // Load Firebase configuration and auth service
    const script1 = document.createElement('script');
    script1.src = 'scripts/firebase-config.js';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'scripts/firebase-auth.js';
    document.head.appendChild(script2);

    // Wait for Firebase to load
    script2.onload = function() {
        initializeAuth();
    };
});

function initializeAuth() {
    // Password visibility toggle functionality
    setupPasswordToggle('loginPassword', 'loginPasswordToggle');
    setupPasswordToggle('signupPassword', 'signupPasswordToggle');
    setupPasswordToggle('confirmPassword', 'confirmPasswordToggle');

    // Password strength indicator for signup
    if (document.getElementById('signupPassword')) {
        setupPasswordStrength('signupPassword');
    }

    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Forgot password functionality
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', handleForgotPassword);
    }
}

// Password visibility toggle
function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    }
}

// Password strength indicator
function setupPasswordStrength(passwordId) {
    const passwordInput = document.getElementById(passwordId);
    const strengthIndicator = document.querySelector('.strength-indicator');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthIndicator && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            
            strengthIndicator.style.width = strength.percentage + '%';
            strengthIndicator.style.backgroundColor = strength.color;
            strengthText.textContent = strength.text;
        });
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const percentages = [0, 20, 40, 60, 80, 100];
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71'];
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
        percentage: percentages[score],
        color: colors[score],
        text: texts[score - 1] || 'Very Weak'
    };
}

// Login form validation
function validateLoginForm(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    let isValid = true;
    
    // Email validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('emailError');
    }
    
    // Password validation
    if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        isValid = false;
    } else {
        clearError('passwordError');
    }
    
    if (isValid) {
        // Simulate login (replace with actual API call)
        console.log('Login successful:', { email, password });
        alert('Login successful!');
    }
}

// Signup form validation
function validateSignupForm(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Full name validation
    if (fullName.length < 2) {
        showError('nameError', 'Full name must be at least 2 characters');
        isValid = false;
    } else {
        clearError('nameError');
    }
    
    // Email validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('emailError');
    }
    
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showError('passwordError', passwordValidation.message);
        isValid = false;
    } else {
        clearError('passwordError');
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    } else {
        clearError('confirmPasswordError');
    }
    
    if (isValid) {
        // Simulate signup (replace with actual API call)
        console.log('Signup successful:', { fullName, email, password });
        alert('Account created successfully!');
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password validation
function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: '' };
}

// Error display functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Forgot password handler
function handleForgotPassword(e) {
    e.preventDefault();
    const email = prompt('Please enter your email address for password reset:');
    if (email && validateEmail(email)) {
        alert('Password reset instructions have been sent to your email.');
    } else if (email) {
        alert('Please enter a valid email address.');
    }
}

// Real-time validation
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.classList.toggle('valid', isValid);
        e.target.classList.toggle('invalid', !isValid && e.target.value.length > 0);
    }
    
    if (e.target.type === 'password') {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    }
});

// Update password strength UI
function updatePasswordStrengthUI(strength) {
    const indicator = document.querySelector('.strength-indicator');
    const text = document.querySelector('.strength-text');
    
    if (indicator && text) {
        indicator.style.width = strength.percentage + '%';
        indicator.style.backgroundColor = strength.color;
        text.textContent = strength.text;
    }
}

// Firebase Authentication Functions

// Handle login with Firebase
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    let isValid = true;
    
    // Email validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('emailError');
    }
    
    // Password validation
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearError('passwordError');
    }
    
    if (!isValid) return;
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Signing in...';
    submitButton.disabled = true;
    
    try {
        const result = await window.firebaseAuthService.signIn(email, password);
        
        if (result.success) {
            showSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showError('passwordError', result.error);
        }
    } catch (error) {
        showError('passwordError', 'An unexpected error occurred. Please try again.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Handle signup with Firebase
async function handleSignup(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Full name validation
    if (fullName.length < 2) {
        showError('nameError', 'Full name must be at least 2 characters');
        isValid = false;
    } else {
        clearError('nameError');
    }
    
    // Email validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('emailError');
    }
    
    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showError('passwordError', passwordValidation.message);
        isValid = false;
    } else {
        clearError('passwordError');
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    } else {
        clearError('confirmPasswordError');
    }
    
    // Terms checkbox validation
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showError('termsError', 'Please accept the terms and conditions');
        isValid = false;
    } else {
        clearError('termsError');
    }
    
    if (!isValid) return;
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;
    
    try {
        const result = await window.firebaseAuthService.signUp(email, password, fullName);
        
        if (result.success) {
            showSuccessMessage(result.message);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            if (result.code === 'auth/email-already-in-use') {
                showError('emailError', result.error);
            } else {
                showError('passwordError', result.error);
            }
        }
    } catch (error) {
        showError('passwordError', 'An unexpected error occurred. Please try again.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Handle forgot password with Firebase
async function handleForgotPassword(e) {
    e.preventDefault();
    const email = prompt('Please enter your email address for password reset:');
    
    if (!email) return;
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    try {
        const result = await window.firebaseAuthService.resetPassword(email);
        
        if (result.success) {
            showSuccessMessage(result.message);
        } else {
            showError('passwordError', result.error);
        }
    } catch (error) {
        alert('An error occurred while sending reset email. Please try again.');
    }
}

// Show success message
function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Add CSS for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
