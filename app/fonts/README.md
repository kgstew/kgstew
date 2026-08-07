# Fonts

Three variable faces, all OFL, self-hosted rather than loaded from Google — the
Google loader needs network access on every CI build, can revise metrics under
you (silently breaking fallback matching), and won't ship a subset youcontrol.

| File | Family | Role | Axes kept |
| --- | --- | --- | --- |
| `Jost.woff2` | Jost, indestructible type | display | `wght 100–900` |
| `Newsreader.woff2` | Newsreader, Production Type | text serif | `wght 400–700`, `opsz 16–44` |
| `MartianMono.woff2` | Martian Mono, Evil Martians | mono | `wght 300–700`, `wdth 75–112.5` |

146 KB total.

## Regenerating

Sources are the unsubset variable TTFs in `google/fonts`. Axes are **limited,
not pinned** — Newsreader keeps optical sizing across the range actually set on
the site (16px table rows to 44px titles) and drops 6–15 and 45–72, which is
where most of its weight was.

```sh
pip install 'fonttools[woff]' brotli
fonttools varLib.instancer Newsreader.ttf 'opsz=16:44' 'wght=400:700' -o N.ttf
pyftsubset N.ttf --output-file=Newsreader.woff2 --flavor=woff2 \
  --unicodes="$BASE" --layout-features='*' --no-hinting --drop-tables+=DSIG
```

Keep `--layout-features='*'` or kerning is lost.

## Glyph coverage — two things the design has to work around

Neither `→` (U+2192) nor `⌀` (U+2300) can be subset in, because **the source
fonts do not contain them**:

- **`→` exists only in Martian Mono.** Fine in practice — arrows appear in mono
  legends anyway. Anywhere else, draw one in SVG rather than typing the
  character, or it will tofu in Jost and Newsreader.
- **`⌀` exists in none of the three.** Use `Ø` (U+00D8), which is in Latin-1 and
  present everywhere. Real drawings use it interchangeably.

`×`, `±`, `°`, em dashes and curly quotes are all present.
