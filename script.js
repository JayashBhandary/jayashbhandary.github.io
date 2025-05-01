// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
gsap.from('.hero-title', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.5
});

gsap.from('.hero-subtitle', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.8
});

gsap.from('.hero-location', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 1.1
});

gsap.from('.hero-scroll-indicator', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 1.4
});

// Gradient Circles Animation
gsap.from('.gradient-circle:nth-child(1)', {
    duration: 2,
    scale: 0,
    opacity: 0,
    ease: 'power2.out',
    delay: 0.5
});

gsap.from('.gradient-circle:nth-child(2)', {
    duration: 2,
    scale: 0,
    opacity: 0,
    ease: 'power2.out',
    delay: 0.8
});

gsap.from('.gradient-circle:nth-child(3)', {
    duration: 2,
    scale: 0,
    opacity: 0,
    ease: 'power2.out',
    delay: 1.1
});

// Section Header Animations
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// About Section Animation
gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Skills Section Animations
gsap.utils.toArray('.skill-category').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        ease: 'power3.out'
    });
});

// Contact Section Animation
gsap.from('.contact p', {
    scrollTrigger: {
        trigger: '.contact p',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.social-links', {
    scrollTrigger: {
        trigger: '.social-links',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to skill cards when they come into view
const skillCards = document.querySelectorAll('.skill-category');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
}); 
