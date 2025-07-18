document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Behavior ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu for Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Experience Tabs ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentItems = document.querySelectorAll('.content-item');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetId = button.dataset.tab;
            contentItems.forEach(item => {
                item.classList.remove('active');
                if (item.id === targetId) {
                    item.classList.add('active');
                }
            });
        });
    });

    // --- Fade-in Animations on Scroll ---
    const fadeUpElements = document.querySelectorAll('.hero-content > *, .section-header, .about-card, .experience-card, .project-card, .certifications-grid, .education-card, .contact-content > *');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeUpElements.forEach((el, index) => {
        el.setAttribute('data-fade-up', '');
        el.style.transitionDelay = `${index * 50}ms`;
        observer.observe(el);
    });
});
