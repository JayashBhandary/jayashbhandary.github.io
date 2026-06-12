# Project pages

Each project page renders a GitHub repo's README **in the browser**, like a
GitHub project page — using [marked](https://marked.js.org),
[github-markdown-css](https://github.com/sindresorhus/github-markdown-css) and
[highlight.js](https://highlightjs.org). You list the repos in `projects.json`
(at the repo root) and run the generator to stamp out one shell page per repo:

```bash
node build-projects.js            # build every entry in projects.json
node build-projects.js notilus    # build just one (match by slug / repo name)
```

The generator does **not** parse any Markdown — it only writes the page shell
(hero + viewer), so there's no custom parser to break. Each page fetches the
README from `raw.githubusercontent.com` at view time (no GitHub API rate limit)
and rewrites the README's relative image/link paths to GitHub. You only re-run
the build when `projects.json` changes — README edits show up automatically.

## projects.json

An array of entries. Only `repo` is required:

```json
[
  {
    "repo": "https://github.com/JayashBhandary/Notilus",
    "tags": "Flutter, Dart, Ollama, Local-first",
    "cover": "assets/img/notilus.png"
  },
  { "repo": "owner/another-project" }
]
```

| Field         | Default                          | Notes |
|---------------|----------------------------------|-------|
| `repo`        | —                                | `owner/name` or a full GitHub URL (required) |
| `title`       | repo name                        | Page title / hero heading |
| `description` | README's first paragraph         | Hero subtitle |
| `tags`        | —                                | Comma string or array; shown in the hero |
| `cover`       | —                                | Hero image — a **portfolio** path (`assets/img/x.png`) or a URL |
| `demo`        | —                                | Adds a "Live demo" button |
| `branch`      | tries `main`, then `master`      | README branch to read |
| `slug`        | repo name, lowercased            | Output filename (`projects/<slug>.html`) |

A leading README `<h1>` that just repeats the title is removed at render time so
it doesn't duplicate the hero.

> Rendering happens client-side, so the README text isn't in the page HTML
> (lighter SEO). Internet is required to view a page, since it pulls the README
> live from GitHub.
