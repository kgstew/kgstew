# kgstew.com — Content Brief

Living working doc for the site rebuild. Kyle edits freely; Claude keeps it current.
Started 2026-08-04. Last updated after interview batch 2.

---

## Locked decisions

| Decision | Choice |
| --- | --- |
| **Audience** | Everyone at once — the mix is the pitch. Not segmented by lane. |
| **Structure** | Unified body of work. One project index, filterable by discipline. |
| **Content process** | Interview-driven: Claude asks, drafts in Kyle's voice, Kyle edits. |
| **Scope** | Clean rebuild. Next.js App Router, React 19, Tailwind 4, native MDX. |
| **Domain** | kgstew.com, existing Vercel deployment. Unchanged. |
| **Timeline** | No deadline. Exploration pace. |
| **Cooking** | Cut from the bio. May appear as occasional posts, not a claimed skill. |
| **Talks / writing / teaching / OSS** | No sections. Kyle: none ongoing, no notable GitHub work. |
| **Fabrication** | A capability shown inside projects, not a portfolio section. Confirmed. |
| **Headline** | "I design systems and assemble the people who build them." |
| **Job title** | None. The headline carries it. |
| **2013 origin story** | Homepage, below the work. |
| **AI-assisted workflow** | Named plainly on the site, without apology. |
| **Design direction** | **Approved:** Signal (identity) + Index (work page) + Shop Drawing (project pages). Revised pitch → https://claude.ai/code/artifact/2fcdd20f-ccae-46c1-9d87-0d416a32a2f0 |
| **Typefaces** | Confirmed as pitched. |
| **Card copy** | Human stake, never specs. Specs live on project pages only. |
| **Disclosure** | Per project, not site-wide. See the disclosure model below. |

---

## Positioning

**Full draft lives in [`positioning.md`](./positioning.md). Summary:**

Kyle is not a generalist maker — he's the person who **builds the thing in the middle**. Every
project across his history is the same shape: separate parts that don't work together, and
he builds the connective tissue. Shopify/Lineye/QuickBooks → an integration API. Sixty
ESP32 butterflies → a mesh network and pattern layer. Pneumatics + firmware + Ableton → a
control chain. Nonprofits + engineers → hacktivations. Artists + engineers → a monthly
meetup.

Software services, hardware modules, and people: same job.

**The range is the qualification, not a list of hobbies.** You can only integrate systems you
can speak the language of. That's the sentence that solves Kyle's original complaint.

Working headline (pending his pick): *"I connect things that don't talk to each other."*
Supported by: *"I design systems and assemble the people who build them."*

---

## Timeline & facts

| When | What |
| --- | --- |
| ~2009 | Woodworking in earnest, San Diego, learned with his dad (started in high school) |
| 2013 | A Zenput founder friend hires him as a junior engineer — **he had never written software before**. "He believed in me and said that I would figure it out." |
| 2013–2014 | Executive Director, Reallocate (unpaid, all-volunteer). Ran "hacktivations" pairing nonprofits with pro bono engineers/designers/marketers. Directly catalyzed the freespace lease. |
| 2013 | Co-founds freespace, San Francisco |
| 2013 | Founding resident, Red Victorian co-living / experimental hotel |
| 2013–2023 | Ten years at Zenput — junior engineer → full-stack → engineering manager of two product teams. Acquired by Crunchtime, June 2022. |
| 2016 or 2018 | Learns to weld, San Francisco |
| 2016–2018 | Ephemerisle: build lead for Elysium, a **400-person** floating island; separately an Alice in Wonderland art boat |
| ~2022 | Back in Colorado. denhac, Colorado Maker Directory, League of Creative Technologists |
| 2024 | Paid contract engineering for Watch Duty (founded by his Zenput colleagues John Mills, Brian Harris, Dave Merritt — he contributed to the early codebase while living with them) |
| Nov 2023 – Oct 2024 | Fable Bound |
| Current | WMD; Poetic Kinetics butterflies; wedding threshold piece |

Also in the SF years: customer service manager at a small tech firm, various other people's
art projects, ran hackathons, ran parties for hundreds, lived in two co-living spaces, large
builds for Thumper Festival and Burning Man.

---

## Work inventory

Status: **Anchor** = deep, fully-built project page · **Standard** = solid writeup ·
**Credit** = compact entry, no full page.

### Kyle's own top picks (Q12)
Art: **Fable Bound, Ephemerisle, Poetic Kinetics butterflies.**
Professional: **WMD, Zenput.**

### Anchors

**WMD** — *embedded firmware + business/manufacturing systems + ops leadership*
- Arrived to three systems that didn't talk: Shopify, Lineye (manufacturing), QuickBooks.
  Built an integration API plus a custom operations dashboard unifying them. Gives visibility
  into lead times, manufacturing process, build planning, procurement. Now extending to RMA
  and inventory/manufacturing outcomes. "Lots of custom connectors… you can't buy off the
  shelf."
- Also built: an issue tracking / engineering management system, a marketing campaign PM
  system, and controls + tracking for manufacturing/assembly rates and true build costs.
- First manufacturing build orders have now been placed on the system's recommendations.
  Impact numbers too early — long lead times, small hardware business, JIT doesn't fit.
- **Metron sequencer firmware archaeology:** legacy codebase, never version controlled,
  seven simultaneous state machines (UI, sequencer, memory save, pattern control), several
  10,000-line files, "extremely hard to read." He refactored to modular, fixed 300+ compiler
  warnings, built a real release build system, added CI and functional testing. Spent months
  tracking down SD card bugs **causing real customer data loss** — fixed. Metron is now
  becoming the CAN bus hub for an ecosystem of other modules.
- Also: unannounced product launches, systems design, marketing, business ops.

**Poetic Kinetics — 60 animatronic butterflies** *(NDA; unannounced. Constraint question still open.)*
- 60 units, each an ESP32 running custom firmware driving one motor, a proximity sensor, and LEDs.
- Wireless mesh: 4 mesh nodes → central computer running a custom server application.
- Server app allows authoring movement patterns and pushing them to units **without a
  firmware update**; also does OTA updates. Network is self-healing — units rejoin on drop.
- **Permanent installation at a botanic garden, must run continuously for three months.**
  Long-term network stability is the open risk he's actively researching.
- Scope: all software, network control, movement control, UIs, server, firmware, and show
  pattern design. "Anything on the software networking design side is all me."

**Fable Bound** — *steel + wood, pneumatics, control stack, 11-month volunteer crew*
- Existing 1,427-word post covers idea → grant → team and stops before the engineering.
- Pneumatics: four shop air jacks, 3,500 lb capacity each (~14,000 lb theoretical, untested),
  ~14" travel. 12V solenoids via relays on a custom PCB built by a team member.
- Firmware handles safety coordination and three relays: fill, exhaust, and a secondary
  ballast system keeping air available for movement.
- Mac Mini running a Node application: centralized control, **MIDI-programmable** — patterns
  and programs triggered by MIDI notes from Ableton, so the ship is sequenced against the
  music. Kyle designed the system, didn't write much of the code, later did a significant
  refactor for maintainability.
- Safety: pinch points made inaccessible; stairs built for climbing; "felt dangerous but
  wasn't really dangerous unless you went where you're not supposed to go." Not yet installed
  in a non-Burning Man public context — would need constant on-site oversight.
- **Playa failure:** the air compressor blew up. Lights and music ran all week; movement
  worked ~3 days. Couldn't source a replacement or repair in the field. Fixed afterward and
  shown at Burning Man decompression events.

**Ephemerisle / Elysium** — *promoted to a full page (Kyle reversed his own demotion)*
- Build lead for a 400-person floating island, three years attending. Separately, an Alice in
  Wonderland art boat with a surrealist living room, floating grass lawn, full kitchen, and
  six rooftop camping spots.
- Kyle: *"It can warrant a full page. There's a lot to tell… building a city on water… a lot
  of really interesting capabilities and experience that very few people on this planet have."*
- Needs batch 3 detail — the two things are separate projects.

### Lighting & control systems for other people's art — **NEW, a category of its own**

Surfaced 2026-08-05 when Kyle dropped assets in. On all three he was **the lighting design and
control systems person, not the project lead** — he said so explicitly. That shapes the
presentation: these are *systems by Kyle inside someone else's piece*, and the artist keeps the
credit line.

This is arguably a fourth leg of the portfolio alongside WMD, the big builds, and community.
It's recent, it's growing, and it's the cleanest proof of the thesis available — other artists
bring him in specifically to be the connective tissue in their work. Connects directly to the
reusable Pi/ESP32 toolkit (batch 2 Q9) and to the butterflies.

| Project | What | Handling |
| --- | --- | --- |
| **The Seventh Gate** | Darrell Onsted's Burning Man piece, this year. Kyle designed all the lighting systems. His words: "definitely worth talking about." | Credit Darrell. **Check release timing** — Burning Man 2026 may not have happened yet. |
| **Wadsworth** | A friend's art piece; Kyle volunteered, building movement systems. | Credit the artist — need their name. |
| **Star Trace** | Kyle came in late to rescue the build after another fabricator; got the system running. Partially installed in Hong Kong, still an active source of stress. | **Sensitive — see below.** |

**Star Trace handling.** The technical work is fine to cover. The rescue-and-management story
is not: Kyle called it "too taboo or too touchy… for the friend that I bailed out on the piece."
He said we can come back to it another time. Until *he* raises it, cover the systems work only
or leave the project out. Don't prompt on it.

### Standard

- **Zenput** — 10 years, junior engineer → eng manager of two product teams. React, Django,
  React Native, IoT restaurant monitoring. Chipotle, McDonald's, Domino's. Acquired 2022.
  Needs the 2013 origin story woven in.
- **Reallocate** — ED 2013–2014, unpaid. Hacktivations. Catalyzed freespace.
- **freespace** — 261 words exist. 300+ events, 10,000+ visitors, 30 murals in three months.
- **Red Victorian** — founding resident, co-living / experimental hotel, Haight-Ashbury.
- **League of Creative Technologists** — monthly art+tech meetup he founded and still runs.
  Dedupe with the "Technical Artists in Denver Boulder" post; these are one thing.
- **Control & lighting toolkit** — reusable Raspberry Pi libraries and templated ESP32
  setups. Bespoke per installation, but a trusted, repeatedly-applied stack. Frame as the
  connective tissue between Fable Bound, the butterflies, and what's next.

### Credit only

- **Watch Duty** — early codebase contributions + a paid contract stint in 2024. Strong
  credibility signal; small footprint.
- **denhac** — volunteer, space operations.
- **Colorado Maker Directory** — built with founder Karen Corliss, hundreds of listings.
- **Furniture & general fabrication** — 15-image gallery becomes a small "things I've made"
  strip, not a pillar.
- **Wedding threshold door piece** — in progress; a "now" post.

### The Matt story
Not a project — a sidebar or pull quote, probably on the about page next to the 2013 story.
Showed up to a Fable Bound build day knowing nobody, had worked on others' art but never his
own. Learned to solder, learned to weld, became Kyle's go-to for solving problems fast. Now
moving into art fabrication as a career and building installations in Denver with other Fable
Bound people.

---

## Disclosure model

Corrected 2026-08-05 — this is **per project**, not a blanket rule, and it belongs in the
content model rather than in anyone's memory. Most of Kyle's work isn't client work at all;
some of it is.

Fields on every project:

| Field | Meaning |
| --- | --- |
| `disclosure` | `open` · `work-only` · `embargoed` |
| `client` | omitted entirely when not disclosable |
| `destination` | where it's installed / who it's for |
| `embargoUntil` | optional date after which `open` applies |

- **`open`** — default. Client and destination can be named. Applies to everything released.
- **`work-only`** — describe the installation, never the client or destination. Some pieces
  sit here only until release, then flip to `open`.
- **`embargoed`** — not mentioned at all yet.

**The butterflies are the sole permanent `work-only` project.** The installation can be
described in full; the client and destination never. Everything else becomes `open` on release.

Making this a data field rather than a convention means a page rebuild can't leak by accident.

---

## Open problems

1. **Headline not chosen.** Four options in `positioning.md`. Blocks homepage copy.
2. **Poetic Kinetics NDA.** Most impressive current credit; need to know what's sayable and
   when. Fallback: describe generically with no client named.
3. **Job title.** No clean one exists. Options in `positioning.md`; leaning on no title at all.
4. **Whether to name the AI-assisted workflow openly.** Recommendation: yes, plainly.
5. **Welding year** — 2016 or 2018? Old post says metalwork since 2018.

---

## Assets

**Current:** `temp/` holds 48 files / 416 MB — **344 MB of that is video**, 72 MB images. Mostly
Fable Bound (build, playa, Denver park, night/LED) plus welded furniture. HEIC + MOV.
`public/static/images/` has the existing low-res blog images. Kyle is bringing "way more" —
photos and video across many installations.

**Needed:** butterfly photos/video, WMD dashboard screenshots (redacted), Metron before/after,
Ephemerisle island + art boat, Reallocate/hacktivation. Off-repo to mine: LinkedIn,
buildtostrike.org, WMD product docs, Instagram, the Fable Bound grant proposal (Google Drive),
freespace/Red Vic press coverage.

### Asset pipeline — **built**, `tools/ingest/`

Decided: **Vercel Blob** (hundreds of images now, growing significantly; thousands of Fable
Bound frames to curate down from). Verified end to end in `--dry-run` against real originals;
the upload path is untested pending a `BLOB_READ_WRITE_TOKEN`. See `tools/ingest/README.md`.

**Finding:** five of the six test photos carried a GPS IFD. `mdls` had reported only one, so
the exposure is wider than the first spot-check suggested. Every derivative is now probed
after encoding and the run fails if any metadata survived.

Original design, all implemented:

1. **Originals live in `originals/<project>/` and are gitignored** — in the repo for
   convenience, never committed, never uploaded. Their `captions.yaml` sidecars *are*
   tracked, since hand-written alt text is content worth versioning. Nothing in there is
   backed up by git, so the real copies must live somewhere else too.
2. **A `sharp`-based script** reads originals → emits AVIF + WebP + JPEG at 400/800/1200/2000px,
   plus dimensions and an inline LQIP placeholder, into `assets/manifest.json`.
3. **Captions in a sidecar, not in code.** One `captions.yaml` per project with alt text,
   caption, credit, and a role (`hero` / `process` / `detail`). Kyle edits that file only.
4. **EXIF stripped by default — non-negotiable.** Verified: `temp/IMG_3697.HEIC` carries GPS
   coordinates 40.145, -105.155 (Longmont area). Several photos are publishing shop/home location.
5. **Video:** short silent autoplay loops (2–6s, muted) at the top of every kinetic project —
   he builds things that *move*, and a still is the least interesting version. Anything over
   ~10s goes to a streaming host, never the repo. `ffmpeg` is available locally.

**Still open:** Cloudflare Stream vs YouTube for anything longer than a 6s loop. Not blocking —
the loop encoder covers the kinetic work either way.

**Status: live.** Blob store `kgstew-blob` created (public access), token in `.env.local` at
the repo root. First real ingest done — 55 objects, all URLs verified 200 with correct content
types, published files confirmed free of EXIF/XMP/IPTC.

Workflow: drop originals in `originals/<project>/`, then
`cd tools/ingest && npm run ingest -- --project <slug>`.

**Caution:** Blob is a public store, so anything ingested is live at a public URL immediately,
linked or not. Never ingest a `work-only` or `embargoed` project before it clears.

---

## Process notes

**Kyle: *"I just hate talking about myself."*** The most operationally important line in
batch 1, and both batches confirm it. He answers questions about *systems* with dense,
specific, generous detail. He answers questions about *himself* with "I don't know."

**He systematically undersells.** He called his best visual asset a "side bucket," dismissed
leading a 400-person island build as distant past (then reversed and asked for a full page
when given a reason), never mentioned an Executive Director title or Watch Duty until
directly prompted, buried the butterflies in a list, and volunteered his career-origin story
inside a **[quick]** question without noting it was remarkable.

**Technique:** ask about the system, the problem, and the people. Never ask him to
characterize himself. Assemble the portrait from his answers and let him correct it — he edits
accurately and willingly. When he undersells something, push back once with the specific
reason it's strong and propose a low-effort path to including it. The Ephemerisle reversal
shows this works.

**Two of the three best things on the site came from [quick] questions.** Don't assume
importance tracks the depth tag.

---

## Interview log

### Batch 1 — positioning & inventory (2026-08-04) — **answered**
[`interview-batch-01.md`](./interview-batch-01.md). Yielded the first thesis attempt, the
"hate talking about myself" constraint, the cooking cut, and four unknown projects.

### Batch 2 — technical depth & career breadth (2026-08-05) — **answered**
[`interview-batch-02.md`](./interview-batch-02.md). Yielded the real thesis (via Q11), full
technical detail on four systems, the 2013 origin story, the Matt story, the Ephemerisle
reversal, and Kyle's own top-five ranking. He rejected draft-1 positioning as too vague and
asked for one clear line.

### Batch 3 — per-project detail — **not yet written**
Needed for: the three new lighting/control projects (The Seventh Gate, Wadsworth, Star Trace —
respecting the Star Trace boundary), Ephemerisle split into two projects, Zenput specifics with
the 2013 origin woven in, freespace/Red Vic. Plus artist names and credit lines for the
contributed work.

### Fable Bound assets — **ingested 2026-08-05**
27 assets, 213 objects, 45.5 MB of derivatives from 169 MB of originals. 17 originals carried
GPS; all stripped. Nine HEICs required the transcode fallback. Two videos (39.5s, 32.2s) are
flagged `needsStreamHost` — they have 6s loops for page use, but the full versions force the
Stream-vs-YouTube decision.

**No captions yet.** Every asset defaults to `role: detail`, so nothing is marked as a hero.
Drafting alt text and roles from the photographs is a Claude task in the established
interview-and-draft pattern — Kyle corrects rather than writes.

---

## Technical plan (sketch — revisit after content)

Rebuild target: Next.js App Router, React 19, Tailwind 4, MDX via native support or
`next-mdx-remote`. Content model needs a real `Project` type — discipline tags, context,
scale, role, dates, collaborators, outcome, status, **plus the disclosure fields above and an
`accent` colour** — not the current blog-post-with-tags. Plus a separate lightweight `Post`
type for the ongoing feed. Projects reference assets by manifest id from
`content/assets/<project>.json`.

Dropping from the old stack: `contentlayer2` (community fork of an abandoned project, weakest
link in the build), `daisyui`, `@emotion/*`, `pliny`, and the entire `db/` directory (Drizzle
+ Vercel Postgres scaffolding, zero imports anywhere in the app). Also deleting
`data/examples/` — 13 leftover starter-template posts.

**Tag axis fix:** current tags mix audience (`professional`), medium (`hardware`, `software`),
and activity (`create`, `volunteer`). Use discipline as the single tag axis, with an
orthogonal context field (professional / art / community).

**Ordering fix:** the old site sorts by when work happened, so quality is invisible. The new
index is explicitly curated — Kyle's Q12 answer is the seed order.

**Structural idea worth considering:** if the thesis is "connective tissue," each project page
could open with the *parts that didn't work together* and then what he built between them.
That's a repeatable page template that makes the argument on every page instead of only on
the homepage.
