# Asset ingest

Turns a folder of camera originals into web derivatives on Vercel Blob, plus a
small JSON manifest the site reads at build time.

## The rules this enforces

1. **Originals never enter the repo and are never uploaded.** They live outside
   the project so they can be re-derived at any size or format later, for free.
2. **All metadata is stripped, and that is verified.** Every derivative is probed
   after encoding and the run fails if any EXIF, XMP, or IPTC survived. This is
   not decorative: five of the first six test photos carried a GPS IFD pointing at
   a home address.
3. **Captions live in YAML next to the originals**, never in component code.
4. **Re-running is safe.** Uploads are content-addressed, so anything unchanged is
   skipped. Curate a project over several passes without re-uploading the world.

## Setup

```sh
cd tools/ingest
npm install
```

Create a Blob store at <https://vercel.com/dashboard/stores>, then:

```sh
echo 'BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...' > .env.local
```

`ffmpeg` and `ffprobe` must be on `PATH` for video.

## Layout

```
~/kgstew-assets/originals/          # ASSETS_ROOT — outside the repo
  fable-bound/
    captions.yaml                   # you edit this
    IMG_6613.HEIC
    IMG_5349.MP4
  butterflies/
    ...
```

## Use

```sh
# scaffold captions.yaml stubs for anything new, process nothing
npm run ingest -- --project fable-bound --init

# derive everything and report, upload nothing
# writes content/assets/fable-bound.dry.json so you can inspect the shape
npm run ingest -- --project fable-bound --dry-run

# the real thing
npm run ingest -- --project fable-bound

# everything, or just one media type
npm run ingest -- --all
npm run ingest -- --project fable-bound --only video
```

`--force` re-uploads and re-derives even when nothing changed. Only needed after
changing encoder settings in `lib/config.mjs`.

## What comes out

Per image: AVIF and WebP at 400/800/1200/2000 plus native width capped at 2400,
one JPEG at 1600 for social cards, and a 20px inline blur placeholder.

Per video: a silent 6-second H.264 loop at 1280 wide and a poster frame. Anything
longer is flagged `needsStreamHost` in the manifest — the loop is for the top of a
project page, not a substitute for the full piece.

Manifests land in `content/assets/<project>.json`, sorted hero → process → detail.
They are small, committed, and the only thing the site reads, so a production build
never needs the Blob token or the originals.

## captions.yaml

```yaml
assets:
  IMG_6613.HEIC:
    alt: The finished ship on grass under a blue sky, shields mounted along the hull
    caption: First full assembly outside the shop, Denver
    credit: ''
    role: hero        # hero | process | detail
    order: 1
    skip: false
```

`--init` appends stubs for new files and never overwrites what you have written.
The run warns about any asset still missing `alt`.

## Notes

Some iPhone HEICs trip libheif's reference-count limit and sharp refuses them.
Those are transcoded through `sips` (macOS) or `ffmpeg` first at maximum quality;
you'll see `(HEIC transcoded)` in the output when it happens.

Video IDs hash path, size, and mtime rather than file contents — reading a 90 MB
original just to name it isn't worth it. Re-encoding a video therefore changes its
ID; images are true content hashes and are stable.
