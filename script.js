document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar background on scroll ---
    const navbar = document.querySelector('.navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Mobile menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    };
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    // --- Scroll reveal ---
    const revealTargets = document.querySelectorAll(
        '.hero > .container > *, .section-head, .about-grid, .timeline-item, .project-card, .skill-group, .cert-list li, .contact > .container > *'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((el, i) => {
        el.setAttribute('data-reveal', '');
        el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
        observer.observe(el);
    });

    // --- Footer year ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
