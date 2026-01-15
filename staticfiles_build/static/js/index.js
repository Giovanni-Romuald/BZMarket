// ============================================================================
// MOBILE MENU FUNCTIONALITY
// ============================================================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

function toggleMobileMenu() {
    const isActive = mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = isActive 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// ============================================================================
// HEADER SCROLL EFFECT
// ============================================================================

let lastScroll = 0;
const header = document.querySelector('header');

function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.top = '-100px';
    } else {
        header.style.top = '0';
    }
    
    lastScroll = currentScroll;
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const fadeElements = document.querySelectorAll('.fade-in');

function fadeInOnScroll() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================================================
// ACTION BUTTONS
// ============================================================================

function createButtonAnimation(button, targetSelector) {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Button click animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        // Scroll to target section
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ============================================================================
// NEWSLETTER FORM
// ============================================================================

function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
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
}

// ============================================================================
// FEATURE CARDS HOVER EFFECTS
// ============================================================================

function setupFeatureCardsHover() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}

// ============================================================================
// TYPEWRITER EFFECT
// ============================================================================

function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    const texts = [
        'boosts your business',
        'simplifies your sales', 
        'connects talents',
        'revolutionizes e-commerce',
        'unites Algeria'
    ];
    
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
    
    return typeWriter;
}

// ============================================================================
// STATISTICS ANIMATION
// ============================================================================

function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (stats.length === 0) return;
    
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

// ============================================================================
// PARALLAX EFFECT FOR FLOATING SHAPES
// ============================================================================

function setupParallaxEffect() {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed * 0.1);
            shape.style.transform = `translateY(${yPos}px) rotate(${yPos}deg)`;
        });
    });
}

// ============================================================================
// ADD SHAKE ANIMATION FOR ERRORS
// ============================================================================

function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// INITIALIZE ALL FUNCTIONALITY
// ============================================================================

function initializePage() {
    // Add shake animation
    addShakeAnimation();
    
    // Setup event listeners
    window.addEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Setup components
    setupSmoothScrolling();
    setupNewsletterForm();
    setupFeatureCardsHover();
    setupParallaxEffect();
    
    // Setup action buttons
    const sellerBtn = document.getElementById('seller-btn');
    const buyerBtn = document.getElementById('buyer-btn');
    
    if (sellerBtn) {
        createButtonAnimation(sellerBtn, '#for-sellers');
    }
    
    if (buyerBtn) {
        createButtonAnimation(buyerBtn, '#for-buyers');
    }
    
    // Initial animations
    fadeInOnScroll();
    
    // Start typewriter effect
    const typeWriter = initTypewriter();
    if (typeWriter) {
        typeWriter();
    }
    
    // Animate stats after a short delay
    setTimeout(animateStats, 500);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Reinitialize animations on window resize (optional)
window.addEventListener('resize', () => {
    fadeInOnScroll();
});