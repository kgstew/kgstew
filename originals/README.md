# Originals

Camera originals, one folder per project. **Not tracked by git** — only the
`captions.yaml` sidecars and this file are.

```
originals/
  fable-bound/
    captions.yaml     ← tracked
    IMG_6613.HEIC     ← ignored
    IMG_5349.MP4      ← ignored
  butterflies/
    ...
```

Drop files in, then:

```sh
cd tools/ingest
npm run ingest -- --project fable-bound --init      # scaffold caption stubs
npm run ingest -- --project fable-bound --dry-run   # check before uploading
npm run ingest -- --project fable-bound             # derive + upload
```

See `tools/ingest/README.md` for the full pipeline.

## These files are not backed up

Git is not protecting anything in here. `git clean -xdf` at the repo root will
delete every original permanently, and a fresh clone arrives empty. Keep the real
copies somewhere else — Time Machine, an external drive, cloud storage — and treat
this directory as a working staging area rather than a library.

Derivatives on Blob are regenerable only if the originals still exist somewhere.

## Embargoed work

Blob is a public store, so **anything ingested is live at a public URL the moment
it uploads**, whether or not a page links to it. Do not ingest a project whose
`disclosure` is `work-only` or `embargoed` until it clears — see the disclosure
model in `docs/content-brief.md`. Staging the originals here is fine; running
ingest on them is not.
