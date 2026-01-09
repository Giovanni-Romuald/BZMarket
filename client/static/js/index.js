  // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Header scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.top = '-100px';
            } else {
                header.style.top = '0';
            }
            
            lastScroll = currentScroll;
        });

        // Scroll animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('visible');
                }
            });
        };

        // Initial check
        fadeInOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', fadeInOnScroll);
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    
                    // Scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Action buttons functionality
        const sellerBtn = document.getElementById('seller-btn');
        sellerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sellerBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                sellerBtn.style.transform = '';
            }, 200);
            
            // Smooth scroll to sellers section
            document.querySelector('#for-sellers').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        const buyerBtn = document.getElementById('buyer-btn');
        buyerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            buyerBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                buyerBtn.style.transform = '';
            }, 200);
            
            // Smooth scroll to buyers section
            document.querySelector('#for-buyers').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = newsletterForm.querySelector('input');
        const newsletterButton = newsletterForm.querySelector('button');
        
        newsletterButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (newsletterInput.value.trim() && newsletterInput.checkValidity()) {
                // Success animation
                newsletterButton.innerHTML = '<i class="fas fa-check"></i>';
                newsletterButton.style.background = 'var(--primary-dark)';
                
                setTimeout(() => {
                    newsletterButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    newsletterButton.style.background = '';
                }, 2000);
                
                alert(`Thank you for subscribing with email: ${newsletterInput.value}`);
                newsletterInput.value = '';
            } else {
                // Error animation
                newsletterForm.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    newsletterForm.style.animation = '';
                }, 500);
                alert('Please enter a valid email address');
            }
        });

        // Hover effects for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.feature-icon i');
                icon.style.transform = 'rotate(360deg) scale(1.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.feature-icon i');
                icon.style.transform = '';
            });
        });

        // Typewriter effect
        const typewriterElement = document.getElementById('typewriter');
        const texts = ['boosts your business', 'simplifies your sales', 'connects talents', 'revolutionizes e-commerce', 'unites Algeria'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, isDeleting ? 50 : 100);
            }
        }

        // Statistics animation
        function animateStats() {
            const stats = document.querySelectorAll('.stat-number[data-count]');
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const suffix = stat.textContent.includes('%') ? '%' : '';
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + suffix;
                }, 20);
            });
        }

        // Parallax effect on floating shapes
        window.addEventListener('scroll', () => {
            const shapes = document.querySelectorAll('.shape');
            const scrolled = window.pageYOffset;
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed * 0.1);
                shape.style.transform = `translateY(${yPos}px) rotate(${yPos}deg)`;
            });
        });

        // Add shake animation for errors
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

        // Initialize all animations on load
        window.addEventListener('load', () => {
            setTimeout(() => {
                fadeInOnScroll();
                typeWriter();
                animateStats();
            }, 300);
        });