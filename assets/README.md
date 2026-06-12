# Media assets

Drop site images and video here. The site references them with relative paths
like `assets/img/foo.jpg` and `assets/video/foo.webm`.

```
assets/
├── img/     # photos, screenshots, covers, badges  (.jpg / .png / .webp / .svg)
└── video/   # short clips and GIFs-as-video         (.webm + .mp4)
```

## Conventions

**Naming** — lowercase, hyphenated, descriptive:
`2went6ex-cover.jpg`, `syneca-demo.webm`, `jayash-portrait.jpg`.

**Images**
- Prefer **WebP** (or optimized JPG/PNG). Keep covers ≈ 1200×630, thumbnails ≤ 800px wide.
- Always set `width`, `height`, `alt`, and `loading="lazy"` on `<img>`.
- Compress before committing (e.g. `cwebp -q 80`, ImageOptim, or Squoosh).

**GIFs → video** (a 5 MB GIF becomes ~300 KB as video, and looks smoother)
- Convert and provide both formats:
  ```sh
  ffmpeg -i demo.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" demo.mp4
  ffmpeg -i demo.gif -c vp9 -b:v 0 -crf 35 demo.webm
  ```
- Embed with the `media-figure` pattern:
  ```html
  <figure class="media-figure">
      <video autoplay muted loop playsinline poster="assets/img/demo-poster.jpg">
          <source src="assets/video/demo.webm" type="video/webm">
          <source src="assets/video/demo.mp4" type="video/mp4">
      </video>
      <figcaption>Optional caption.</figcaption>
  </figure>
  ```

Each page already has commented `MEDIA SLOT` markers showing where art drops in —
uncomment and point them at files here.
