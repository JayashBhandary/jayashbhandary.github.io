document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll reveal ---
    const revealTargets = document.querySelectorAll(
        '.hero > .container > *, .section-head, .about-grid, .timeline-item, .project-card, .skill-group, .cert-list li, .contact > .container > *, .resume-sheet, .media-figure'
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
});
