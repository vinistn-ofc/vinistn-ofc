// Projects Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                // Add animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Skill Bars Animation - Corrigido para não oscilar
const skillBars = document.querySelectorAll('.skill-bar');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            
            // Marcar como animado para não repetir
            bar.classList.add('animated');
            
            // Animar a barra
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    // Iniciar com largura 0
    bar.style.width = '0%';
    bar.style.transition = 'width 1.5s ease';
    skillsObserver.observe(bar);
});

// Enhanced Smooth Scrolling with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Enhanced Form Validation with Real-time Feedback
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
        
        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            // Remove previous error
            field.classList.remove('error');
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Validation rules
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório';
            } else if (field.type === 'email' && value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido';
            } else if (field.id === 'name' && value && value.length < 3) {
                isValid = false;
                errorMessage = 'O nome deve ter pelo menos 3 caracteres';
            } else if (field.id === 'message' && value && value.length < 10) {
                isValid = false;
                errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
            }
            
            if (!isValid) {
                field.classList.add('error');
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                errorElement.style.cssText = `
                    color: #f56565;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                    display: block;
                `;
                field.parentNode.appendChild(errorElement);
            }
            
            return isValid;
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                // Show success message
                showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                
                // Reset form with animation
                const formElements = contactForm.querySelectorAll('input, textarea');
                formElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.value = '';
                        el.classList.remove('error');
                    }, index * 100);
                });
                
            } else {
                showNotification('Por favor, corrija os erros no formulário.', 'error');
            }
        });
    }
});

// Add error field styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #f56565 !important;
        box-shadow: 0 0 0 4px rgba(245, 101, 101, 0.1) !important;
    }
`;
document.head.appendChild(errorStyles);

// Enhanced Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        // Animate hero elements sequentially
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
    }, 100);
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    z-index: 10000;
    transition: width 0.3s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Enhanced Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
    }
    
    if (profilePlaceholder) {
        profilePlaceholder.style.transform = `translateY(${scrolled * 0.6}px) rotate(${scrolled * 0.1}deg)`;
    }
});

// Mouse Move Effect for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            const profilePlaceholder = document.querySelector('.profile-placeholder');
            if (profilePlaceholder) {
                profilePlaceholder.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${xPos * 0.5}deg)`;
            }
        });
        
        hero.addEventListener('mouseleave', () => {
            const profilePlaceholder = document.querySelector('.profile-placeholder');
            if (profilePlaceholder) {
                profilePlaceholder.style.transform = 'translate(0, 0) rotate(0deg)';
            }
        });
    }
});

// Console welcome message with style
console.log('%c🚀 Bem-vindo ao meu portfólio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cDesenvolvido com ❤️ usando HTML, CSS e JavaScript', 'color: #764ba2; font-size: 14px;');
console.log('%c🔧 Tecnologias: React, Vue.js, Node.js, Python, Docker', 'color: #48bb78; font-size: 12px;');
console.log('%c📧 Contato: vinistn@example.com', 'color: #ed8936; font-size: 12px;');

// Menu Mobile Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .stat, .about-text, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animations
document.addEventListener('DOMContentLoaded', () => {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (!isNaN(number)) {
                        entry.target.classList.add('animated');
                        animateCounter(statNumber, number);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
});
