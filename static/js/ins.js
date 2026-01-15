    // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const password = document.getElementById('password');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const confirmPassword = document.getElementById('confirm_password');

        if (togglePassword && password) {
            togglePassword.addEventListener('click', function() {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        }

        if (toggleConfirmPassword && confirmPassword) {
            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPassword.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        }

        // Password strength indicator
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');

        if (password && strengthFill && strengthText) {
            password.addEventListener('input', function() {
                const value = this.value;
                let strength = 0;
                
                // Check length
                if (value.length >= 8) strength += 25;
                if (value.length >= 12) strength += 15;
                
                // Check for lowercase
                if (/[a-z]/.test(value)) strength += 15;
                
                // Check for uppercase
                if (/[A-Z]/.test(value)) strength += 15;
                
                // Check for numbers
                if (/[0-9]/.test(value)) strength += 15;
                
                // Check for special characters
                if (/[^A-Za-z0-9]/.test(value)) strength += 15;
                
                // Cap at 100%
                strength = Math.min(strength, 100);
                
                // Update visual indicator
                strengthFill.style.width = strength + '%';
                
                // Update color and text
                if (strength < 40) {
                    strengthFill.className = 'strength-fill strength-weak';
                    strengthText.textContent = 'Weak';
                } else if (strength < 70) {
                    strengthFill.className = 'strength-fill strength-medium';
                    strengthText.textContent = 'Medium';
                } else {
                    strengthFill.className = 'strength-fill strength-strong';
                    strengthText.textContent = 'Strong';
                }
            });
        }


        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
                alert(`Sign up with ${provider} - To be implemented with OAuth`);
            });
        });

        // Feature cards hover effect
        document.querySelectorAll('.feature-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                icon.style.transform = '';
            });
        });