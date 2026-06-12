/*
 * Shared site chrome — nav + footer.
 * Each page drops in <div data-component="nav"></div> and
 * <div data-component="footer"></div>; this fills them from one source,
 * highlights the active page, wires the mobile menu + scroll state, and
 * stamps the footer year. Edit the nav/footer in ONE place: here.
 */
(function () {
    const NAV_LINKS = [
        { href: 'index.html',       label: 'Home' },
        { href: 'about.html',       label: 'About' },
        { href: 'work.html',        label: 'Work' },
        { href: 'projects.html',    label: 'Projects' },
        { href: 'credentials.html', label: 'Credentials' },
        { href: 'resume.html',      label: 'Resume' }
    ];

    const SOCIALS = [
        { href: 'https://www.linkedin.com/in/jayashbhandary', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
        { href: 'https://github.com/JayashBhandary',          label: 'GitHub',   icon: 'fab fa-github' },
        { href: 'https://x.com/JayashBhandary',               label: 'Twitter',  icon: 'fab fa-twitter' }
    ];

    const EMAIL = 'findjayash@gmail.com';

    function currentPage() {
        let file = window.location.pathname.split('/').pop();
        return file === '' ? 'index.html' : file;
    }

    // Relative prefix back to the site root, based on how many directories
    // deep the current page lives (root → '', pages/ → '../', etc.).
    function rootPrefix() {
        const dir = window.location.pathname.replace(/[^/]*$/, '');
        const depth = dir.split('/').filter(Boolean).length;
        return '../'.repeat(depth);
    }

    // index.html sits at the site root; every other page lives in pages/.
    function resolveHref(file) {
        const prefix = rootPrefix();
        return file === 'index.html' ? prefix + 'index.html' : prefix + 'pages/' + file;
    }

    function buildNav() {
        const current = currentPage();
        const links = NAV_LINKS.map(l => {
            const active = l.href === current;
            return `<li><a href="${resolveHref(l.href)}"${active ? ' class="is-active" aria-current="page"' : ''}>${l.label}</a></li>`;
        }).join('');
        return `
        <nav class="navbar">
            <div class="container nav-inner">
                <a href="${resolveHref('index.html')}" class="logo">Jayash Bhandary</a>
                <ul class="nav-links">${links}</ul>
                <a href="mailto:${EMAIL}" class="nav-cta">Get in touch</a>
                <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>`;
    }

    function buildFooter() {
        const year = new Date().getFullYear();
        const socials = SOCIALS.map(s =>
            `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}"><i class="${s.icon}"></i></a>`
        ).join('');
        return `
        <footer class="footer">
            <div class="container footer-inner">
                <p class="footer-text">© ${year} Jayash Bhandary</p>
                <div class="social-links">${socials}</div>
            </div>
        </footer>`;
    }

    function wireNav() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            const close = () => {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            };
            hamburger.addEventListener('click', () => {
                const open = hamburger.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
                navLinks.classList.toggle('active');
            });
            navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
        }
    }

    function inject() {
        const navSlot = document.querySelector('[data-component="nav"]');
        const footSlot = document.querySelector('[data-component="footer"]');
        if (navSlot) navSlot.outerHTML = buildNav();
        if (footSlot) footSlot.outerHTML = buildFooter();
        wireNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
