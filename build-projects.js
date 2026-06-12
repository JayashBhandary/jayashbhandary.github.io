#!/usr/bin/env node
/*
 * build-projects.js — generate a project page per repo listed in projects.json.
 *
 *   node build-projects.js              # build all entries in projects.json
 *   node build-projects.js notilus      # build one (match by slug / repo name)
 *
 * Each generated page (projects/<slug>.html) is a thin shell: a portfolio hero
 * plus a viewer that fetches the repo's README from raw.githubusercontent.com
 * and renders it in the browser with marked + github-markdown-css + highlight.js
 * — so it looks like a GitHub project page. Relative image/link paths in the
 * README are rewritten to GitHub at render time. No Markdown is parsed here, so
 * there is no custom parser to break; re-run only when projects.json changes.
 *
 * projects.json entry fields (only `repo` is required):
 *   repo         "owner/name" or a full https://github.com/owner/name URL
 *   title        page title / hero heading   (default: repo name)
 *   description  hero subtitle               (default: README's first paragraph)
 *   tags         comma string or array       (shown in the hero)
 *   cover        hero image — a portfolio path (assets/img/x.png) or a URL
 *   demo         "Live demo" button URL
 *   branch       README branch to read       (default: tries main then master)
 *   slug         output filename             (default: repo name, lowercased)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'projects');
const MANIFEST = path.join(ROOT, 'projects.json');
const SITE = 'https://jayashbhandary.github.io';

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}
const escapeAttr = s => escapeHtml(s).replace(/'/g, '&#39;');
const portfolioAsset = p => (/^https?:/.test(p) ? p : '../' + p.replace(/^\.?\//, ''));

function parseRepo(s) {
    const clean = String(s || '').trim()
        .replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/+$/, '');
    const [owner, name] = clean.split('/');
    return { owner, name };
}

// ------------------------------------------------------------------ template
function page(entry) {
    const { owner, name } = parseRepo(entry.repo || entry.link || entry.url);
    if (!owner || !name) throw new Error(`entry needs a "repo" (owner/name): ${JSON.stringify(entry)}`);

    const slug = (entry.slug || name).toLowerCase();
    const title = entry.title || entry.name || name;
    const desc = entry.description || '';
    const fullTitle = `${title} — Jayash Bhandary`;
    const canonical = `${SITE}/projects/${slug}.html`;
    const repoUrl = `https://github.com/${owner}/${name}`;
    const branches = entry.branch ? [entry.branch] : ['main', 'master'];

    const tagList = (Array.isArray(entry.tags) ? entry.tags : String(entry.tags || '').split(','))
        .map(t => t.trim()).filter(Boolean);
    const tagsHtml = tagList.length
        ? `<p class="project-meta"><span><i class="fas fa-tag"></i> ${tagList.map(escapeHtml).join(', ')}</span></p>`
        : '';
    const links = [`<a href="${repoUrl}" class="btn btn-ghost" target="_blank" rel="noopener"><i class="fab fa-github"></i> View on GitHub</a>`];
    if (entry.demo) links.unshift(`<a href="${escapeAttr(entry.demo)}" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Live demo</a>`);
    const coverFig = entry.cover
        ? `\n                <figure class="media-figure"><img src="${escapeAttr(portfolioAsset(entry.cover))}" alt="${escapeAttr(title)}" loading="lazy"></figure>`
        : '';

    // Config the in-page viewer reads (safely embedded as JSON).
    const cfg = JSON.stringify({ owner, name, branches, title });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>${escapeHtml(fullTitle)}</title>

    <meta name="description" content="${escapeAttr(desc || title + ' — a project by Jayash Bhandary.')}">
    <meta name="author" content="Jayash Bhandary">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="theme-color" content="#ffffff">
    <meta name="color-scheme" content="light">

    <link rel="canonical" href="${canonical}">

    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Jayash Bhandary">
    <meta property="og:title" content="${escapeAttr(fullTitle)}">
    <meta property="og:description" content="${escapeAttr(desc || title + ' — a project by Jayash Bhandary.')}">
    <meta property="og:image" content="https://raw.githubusercontent.com/JayashBhandary/jayashbhandary.github.io/master/image.jpeg">
    <meta property="og:locale" content="en_US">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(fullTitle)}">
    <meta name="twitter:site" content="@JayashBhandary">

    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" href="../favicon.ico">

    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- GitHub-style Markdown rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-light.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
    <div data-component="nav"></div>

    <main>
        <header class="hero page-hero">
            <div class="container">
                <p class="hero-eyebrow"><a href="../pages/projects.html" class="breadcrumb"><i class="fas fa-arrow-left"></i> Projects</a></p>
                <h1 class="hero-title">${escapeHtml(title)}</h1>
                <p class="hero-subtitle" id="project-lead">${escapeHtml(desc)}</p>
                ${tagsHtml}
                <div class="hero-actions">${links.join('')}</div>
            </div>
        </header>

        <section class="section">
            <div class="container">${coverFig}
                <article class="markdown-body" id="readme"><p class="readme-status">Loading README…</p></article>
            </div>
        </section>
    </main>

    <div data-component="footer"></div>

    <script src="../components.js"></script>
    <script src="../script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
    (function () {
        var cfg = ${cfg};
        var el = document.getElementById('readme');
        var files = ['README.md', 'readme.md', 'Readme.md', 'README.markdown'];

        function rawBase(branch) {
            return 'https://raw.githubusercontent.com/' + cfg.owner + '/' + cfg.name + '/' + branch + '/';
        }
        function blobBase(branch) {
            return 'https://github.com/' + cfg.owner + '/' + cfg.name + '/blob/' + branch + '/';
        }
        function isAbsolute(u) { return /^(https?:|mailto:|tel:|data:|#|\\/\\/)/.test(u); }

        function render(md, branch) {
            marked.setOptions({ gfm: true, breaks: false });
            el.innerHTML = marked.parse(md);

            // Rewrite README-relative paths to GitHub.
            el.querySelectorAll('img[src]').forEach(function (img) {
                var s = img.getAttribute('src');
                if (s && !isAbsolute(s)) img.setAttribute('src', rawBase(branch) + s.replace(/^\\.?\\//, ''));
            });
            el.querySelectorAll('a[href]').forEach(function (a) {
                var h = a.getAttribute('href');
                if (h && !isAbsolute(h)) a.setAttribute('href', blobBase(branch) + h.replace(/^\\.?\\//, ''));
                if (a.hostname && a.hostname !== location.hostname) { a.target = '_blank'; a.rel = 'noopener'; }
            });

            // Syntax highlight + drop a duplicate leading title (the hero shows it).
            if (window.hljs) el.querySelectorAll('pre code').forEach(function (b) { hljs.highlightElement(b); });
            var h1 = el.querySelector('h1');
            if (h1 && h1.textContent.trim().toLowerCase() === cfg.title.toLowerCase()) h1.remove();

            // Fill the hero subtitle from the first paragraph if none was given.
            var lead = document.getElementById('project-lead');
            if (lead && !lead.textContent.trim()) {
                var p = el.querySelector('p');
                if (p) lead.textContent = p.textContent.trim().slice(0, 200);
            }
        }

        function attempt(bi, fi) {
            if (bi >= cfg.branches.length) {
                el.innerHTML = '<p class="readme-status">Couldn\\'t load the README. ' +
                    '<a href="https://github.com/' + cfg.owner + '/' + cfg.name + '" target="_blank" rel="noopener">View it on GitHub</a>.</p>';
                return;
            }
            if (fi >= files.length) return attempt(bi + 1, 0);
            var branch = cfg.branches[bi];
            fetch(rawBase(branch) + files[fi])
                .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
                .then(function (md) { render(md, branch); })
                .catch(function () { attempt(bi, fi + 1); });
        }
        attempt(0, 0);
    })();
    </script>
</body>
</html>
`;
    return { slug, html };
}

// ----------------------------------------------------- projects.html grid
const LISTING = path.join(ROOT, 'pages', 'projects.html');
const GRID_START = '<!-- generated:projects:start';
const GRID_END = '<!-- generated:projects:end -->';

// One card for the listing grid, linking to the project's own page.
function card(entry) {
    const { name } = parseRepo(entry.repo || entry.link || entry.url);
    const slug = (entry.slug || name).toLowerCase();
    const title = entry.title || entry.name || name;
    const tags = (Array.isArray(entry.tags) ? entry.tags : String(entry.tags || '').split(','))
        .map(t => t.trim()).filter(Boolean);
    const fig = entry.cover
        ? `\n                        <figure class="media-figure" style="margin: -32px -32px 22px;"><img src="${escapeAttr(portfolioAsset(entry.cover))}" alt="${escapeAttr(title)}" loading="lazy"></figure>`
        : '';
    const desc = entry.description ? `\n                        <p class="project-desc">${escapeHtml(entry.description)}</p>` : '';
    const tagHtml = tags.length
        ? `\n                        <ul class="tag-list">${tags.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
        : '';
    return `                    <a href="../projects/${slug}.html" class="project-card">${fig}
                        <div class="project-top">
                            <h3>${escapeHtml(title)}</h3>
                            <span class="project-arrow"><i class="fas fa-arrow-right"></i></span>
                        </div>${desc}${tagHtml}
                    </a>`;
}

// Rewrite the generated card block in pages/projects.html from the manifest.
function injectGrid(entries) {
    if (!fs.existsSync(LISTING)) { console.warn(`(skipped grid: ${LISTING} not found)`); return; }
    const html = fs.readFileSync(LISTING, 'utf8');
    const s = html.indexOf(GRID_START), e = html.indexOf(GRID_END);
    if (s === -1 || e === -1) { console.warn('(skipped grid: markers not found in pages/projects.html)'); return; }
    const startEnd = html.indexOf('-->', s) + 3;          // keep the start marker line
    const cards = entries.map(card).join('\n\n');
    const next = html.slice(0, startEnd) + '\n' + cards + '\n                    ' + html.slice(e);
    fs.writeFileSync(LISTING, next);
    console.log(`✓ updated pages/projects.html grid (${entries.length} card${entries.length === 1 ? '' : 's'})`);
}

// ----------------------------------------------------------------------- run
function main() {
    if (!fs.existsSync(MANIFEST)) {
        console.error(`No projects.json found at ${MANIFEST}. Create it with a list of repos.`);
        process.exit(1);
    }
    let allEntries;
    try {
        allEntries = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    } catch (e) {
        console.error(`projects.json is not valid JSON: ${e.message}`);
        process.exit(1);
    }
    if (!Array.isArray(allEntries) || !allEntries.length) {
        console.log('projects.json has no entries yet. Add a { "repo": "owner/name" } and re-run.');
        return;
    }

    // The grid always reflects the whole manifest; page generation may be filtered.
    let entries = allEntries;
    const arg = process.argv[2];
    if (arg) {
        const want = arg.replace(/\.(md|html)$/, '').toLowerCase();
        entries = allEntries.filter(e => {
            const { name } = parseRepo(e.repo || e.link || e.url || '');
            return (e.slug || name || '').toLowerCase() === want;
        });
        if (!entries.length) { console.error(`No projects.json entry matches "${arg}".`); process.exit(1); }
    }

    fs.mkdirSync(SRC_DIR, { recursive: true });
    let ok = 0;
    for (const entry of entries) {
        try {
            const { slug, html } = page(entry);
            fs.writeFileSync(path.join(SRC_DIR, slug + '.html'), html);
            console.log(`✓ ${entry.repo || entry.link} → projects/${slug}.html`);
            ok++;
        } catch (e) {
            console.error(`✗ ${entry.repo || entry.link || JSON.stringify(entry)}: ${e.message}`);
        }
    }
    injectGrid(allEntries);
    console.log(`\nDone — ${ok}/${entries.length} page(s) generated.`);
}

main();
