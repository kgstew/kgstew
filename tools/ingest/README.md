# Asset ingest

Turns a folder of camera originals into web derivatives on Vercel Blob, plus a
small JSON manifest the site reads at build time.

## The rules this enforces

1. **Originals are never committed and never uploaded.** They sit in `originals/`
   for convenience but are gitignored, so derivatives can be regenerated at any
   size or format later without the repo carrying gigabytes. Their `captions.yaml`
   sidecars *are* tracked.
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
originals/                          # ASSETS_ROOT — gitignored except captions
  README.md                         # tracked
  fable-bound/
    captions.yaml                   # tracked — you edit this
    IMG_6613.HEIC                   # ignored
    IMG_5349.MP4                    # ignored
  butterflies/
    ...
```

Paths resolve from the repo root regardless of where you run the tool from.
Override with `ASSETS_ROOT` if you ever want originals elsewhere.

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

## Removing something already published

**Deleting an original does not unpublish it.** The derivatives stay live at public
URLs until they are explicitly deleted — which matters when a photo is pulled
because nobody consented to it being shared.

Delete the original, then:

```sh
npm run ingest -- --project fable-bound --prune
```

Every run reports orphans whether or not you pass `--prune`, and records them in
the manifest under `pendingDeletion` so the list survives until it is dealt with.
Nothing is ever deleted if a live asset still references the same URL, so
restoring a file you removed is safe.

Note that objects are uploaded with a one-year cache header, so an edge cache may
serve a deleted file briefly after the origin returns 404. For anything urgent,
verify with `curl -I` rather than a browser, which will have its own cache.

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
