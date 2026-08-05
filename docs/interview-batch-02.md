# Interview — Batch 2: Technical Depth & Career Breadth

Asked 2026-08-05. Same rules: answer inline under `**A:**`, don't polish, partial is fine.

Each question is tagged **[quick]** (a few sentences or a list) or **[deep]** (this one
becomes real page content, give it room). If you only have twenty minutes, do Q1, then
whichever of Q3–Q6 you feel like talking about.

**One process change based on batch 1:** you answered "what are you working on" with a
rich, specific list, and answered "what's the hardest thing you've solved" with "I don't
know." So I've stopped asking you to characterize yourself and started asking about
systems, problems, and people. I'll assemble the self-portrait from your answers — you just
correct it. That's the deal, and it's how we work around you hating talking about yourself.

---

## Part 1 — Thesis check

### 1. Is this right? **[deep, but the most important question in the doc]**

Two things repeated in almost every answer you gave. I don't think they're what your
current site says about you.

**First — you go into systems you don't understand and make the thing exist.** Your words
on what firmware and the ship have in common:

> "It's all problem solving and the problem solving is the interesting part for me. I
> really enjoy looking at a system that I don't understand and trying to piece out how I'm
> going to make something exist."

You were careful to say you're *not* a career C++ developer, you'd *never* built art that
large, WMD has been *"a new exploration"* throughout. You're not claiming mastery of
domains. You're claiming you can enter any system and ship inside it.

**Second — you build with people on purpose, and they leave more capable.** The thing you
said you leave out because it takes too long:

> "I'm extremely good at helping people take their ideas and turn them into reality."

Then: *"much more interested in building things with teams than building things by myself"*
and *"in a lot of cases people came into the project not even knowing that they were
capable of [it]."* And every community thing you've done — freespace, denhac, Colorado
Maker Directory, League of Creative Technologists, Reallocate — is infrastructure for other
people to make things.

**So the draft through-line is:**

> One skill, applied in a lot of places: walk into a system nobody has explained — a
> language you've never written, a mechanism you've never built, a business process nobody
> documented — find the people, and make the thing exist. The people usually leave more
> capable than they arrived.

And the reason this matters for your actual complaint: a list of nouns (*software engineer,
fabricator, community organizer*) reads as scattered. But if the pitch is *one*
domain-independent capability, then the range stops being a list of hobbies and becomes the
**proof**. Firmware, welded steel, a 400-person floating island, a nonprofit directorship,
and a manufacturing accounting migration aren't five interests — they're five pieces of
evidence for one claim.

What's wrong with this? What's overstated, what's missing, what would you never say about
yourself?

**A:**

I don't disagree with the through line. I don't think it's very well formed. It's a little difficult to understand what the actual skill set is and how we're going to use it to continue to describe the proof that comes out of all of the hobbies in the different projects. I think we need a clear one line rather than an em-dashed paragraph that doesn't point to anything specific. 

Let's keep workshopping this as we continue to develop some more context here on the other questions. 
---

## Part 2 — Technical depth, re-asked

You asked me directly in batch 1: *"What do you think would be best to dig into here?"*

Here's my answer. I think Q4 was a bad question and you gave the honest response to it. I
asked for algorithmic cleverness you solved unaided, and you correctly said that's years
gone and that AI helped with the recent stuff — as though that disqualifies it.

It doesn't. Your differentiator isn't inventing a clever algorithm. It's **integration
across boundaries that don't normally get crossed by one person**: firmware to hardware,
hardware to network, network to cloud, cloud to a business process, business process to a
manufacturing line. Almost nobody spans that, and it's exactly what you described in Q2 and
Q6 without recognizing it as the answer to Q4.

You also said the real work was *"in the conceptual and theoretical space, understanding
how the system went together, rather than actually solving the problem myself."* That is a
description of architecture. It's the senior skill, and it's a current, honest story about
how experienced engineers actually work now. We're not hiding the AI part.

So: four systems to dig into instead.

### 2. The butterflies **[deep]**

You mentioned this almost in passing and I think it's the single most impressive thing on
your list: **networking infrastructure and movement systems design for 60 coordinated
animatronic butterflies** installed at a botanic garden.

First, the constraint question: it's not public, so what *can* be said, and when does that
change? Happy to write it now and hold it, or write it generically ("60-unit coordinated
animatronic installation") with no client named.

Then the system, at whatever depth you can:
- What coordinates 60 units? Wired, wireless, mesh, DMX/Art-Net, something custom?
- Where does motion get computed — centrally, or on each unit?
- What happens when one drops off the network mid-show?
- What's the hard part you're actually worried about?
- Who else is on this, and what's yours versus theirs?

**A:**

The system is 60 butterflies, each with an ESP32 that's running a custom firmware for controlling the movement of a single motor connected to a proximity sensor and LEDs, which all run at the butterfly. Each unit is then connected wirelessly to a mesh network. There are four nodes in the mesh that all connect to a central computer that runs a custom server application, which handles networked control for the entire installation.

The server application provides the ability to design your own movement control patterns and update them to each of the butterflies in the system. We can push new patterns without needing a firmware update. We can also do over-the-air updates to the units. The network system is self-repairing, so the butterflies will reload and try to put themselves back on the network if they're dropped.

It's not a show installation. It's a permanent installation at a botanical garden, so it's meant to run long term over the course of three months. The network connectivity and the long-term keeping things on the network piece is probably the biggest concern and the big unknown that I'm still researching and developing right now.

I did all of the software, all of the network control, all of the movement control, built the UIs, built the server, ventilation, and firmware for the butterflies, and designed the show patterning and how we create all of the different movement for the pieces. Anything on the software networking design side is all me. 

### 3. WMD business & manufacturing systems **[deep]**

You've now twice described your WMD work as primarily *business systems* — "systems
development," "migrations between our manufacturing and business accounting systems" — and
I've never seen an engineer's portfolio cover this well. It's unusual and it's genuinely
hard: a small hardware manufacturer's systems have to reconcile inventory, BOMs,
production, fulfillment, and accounting, and the failure modes are expensive.

- What did the systems landscape look like when you arrived, and what does it look like now?
- What was the migration, specifically? From what, to what, and what broke?
- What's automated now that used to be manual, and what did that change about the business?
- Any numbers you're willing to publish — SKUs, units, order volume, time saved, error rates?

**A:**
When I got to WMD, there were several disparate systems:
- Shopify
- Lineye for manufacturing
- QuickBooks for accounting
None of them talked to each other, so I built an integration API that connects all of these systems together and allows a custom operations dashboard tool to talk to all those different systems and provide reports and a higher-level overview of all the different operations that we do. It gives us more insight into:
- our lead times
- our manufacturing process
- our build planning
- our procurement
Now we're connecting our RMA process and the end result of our inventory manufacturing process through the systems that I built. Lots of custom connectors and pieces in there that didn't exist. More things you can't buy off the shelf to make these sorts of connections work

It's still too early to really tell the impact of what we're doing. We've just placed our first manufacturing build orders based on recommendations from the system, and we have really long lead times because it's a small hardware development business. We don't really do well with just-in-time ordering, but this is the thing that's coming out of it.

Now, I also put in place an issue tracking and engineering management system for all of our workflows. I built a marketing campaign project management system, and I've put in stronger controls and tracking for our manufacturing and assembly process and rates and times to make it easier for us to see how much things actually cost for us to build. 


### 4. WMD legacy firmware archaeology **[deep]**

From batch 1: *"interesting examples of firmware development in legacy projects here at WMD
that are quite complicated: languages that I didn't understand, systems that I didn't
build, and technologies and products that I had to learn."*

That's a great story and it's the honest version of technical depth — inheriting
undocumented firmware for a shipping product is harder than greenfield work.

Pick one module or one product. What was the codebase like? What did you need to change and
why? How did you figure out what the code was doing? What did you get wrong first? What's
in there now that you're proud of?

**A:**

When I started working on our Metron sequencer, I opened up a legacy codebase that was never version-controlled and started exploring a fairly complex state machine of seven different simultaneous state machines, which run the UI, the sequencer, the memory save, and the pattern control systems. We can dig into the actual repository and look at the specifics of it, but it was extremely hard to read. There were several 10,000-line files.

I refactored the entire codebase into a more modular system so that I could get more context into how it was working. I fixed over 300 compiler warnings to clean up the build process, built an actual build system for doing releases, and built a CI and testing system to test our functionality as we went. I have spent many, many months tracking down really sneaky SD card bugs with the help of AI, which were causing real data loss for our customers, and that's all been repaired, so very happy about that.

We've also just built a system now where it's much easier for us to make updates and improvements for this module, which we are going to be using as a hub for an ecosystem of other modules that will be communicating over CAN bus with the Metron sequencer. This enables a larger series of functionalities for other bits of our product. 

### 5. Fable Bound's control stack **[deep]**

The existing post is entirely about the idea, the grant, and the team — it stops before the
engineering. You described it in batch 1 as *"a steel and wooden structure with a pneumatic
control system that integrated sound through a custom software application that drove
firmware."* None of that is on the site.

- The pneumatics: what actually moves, what drives it, how is it valved and sequenced? How
  much force, how much travel?
- The custom application: what is it, what does it run on, what's the interface?
- The firmware underneath it: what board, what's it responsible for?
- Sound: triggered by what? Synced how?
- Safety — this is a public interactive piece with moving parts and people climbing on it.
  How did you handle that? (This is a question most artists can't answer well and it makes
  you look serious.)
- What failed on playa, and what did you fix in the field?

**A:**

The pneumatic system is four shop air jacks for lifting trucks. Each one's capable of lifting 3,500 lbs. It is valved using 12 V solenoids that are connected through relays on a custom circuit board that was made by one of our team members. It travels about 14 in., and it should be able to lift near 14,000 lbs. We've never tested it for that.
There are several custom applications:
- The firmware application, which actually handles the safety coordination and control of the relays. There are three different relays: one that pushes air into the jack, one that removes air from the jack, and one that loads a secondary ballast system to keep air available for the movement itself.
- The application that runs on the Mac Mini, which handles the centralized control for receiving MIDI commands to allow the ship to be programmable using MIDI notes, and then handles the actual patterns and programs that run based on the music that's playing. That's all written in Node.
That was a pretty big team effort. I love the design and an overview of that. I didn't write much of the code, though I did do a significant refactor on it after the fact to make it easier to update.
Sound: triggered by what? It's triggered by a soundscape. You can just run a DAW (we use Ableton) and have a track running in Ableton that plays MIDI notes. Each one of those MIDI notes triggers a different pattern or different program that runs on the ship, and so you can put it into a series of different sequences based on the notes that you send.
It's a public installation. It was made for Burning Man, so safety third. We've never actually installed it moving in a public, non-Burning Man context. It would require much more oversight and having people that were actually there with the piece all of the time, but we did put a lot of effort into making the pinch points in the system inaccessible. We built stairs and just made it something that was easy to climb and that you could get onto that felt dangerous but wasn't really dangerous unless you went into places where you're not supposed to go.
What failed on Playa? The air compressor that was supposed to continuously provide air to the installation blew up. We tried to source a secondary compressor and get our other compressor working, but we never really did. The lights and the music worked the entire time, but the movement only worked for about three days. We fixed it after the fact and brought it out to a couple of other Burning Man decompression events later on. It was an easy fix. We just didn't have the tools or equipment to do it in the moment.

---

## Part 3 — Breadth, mostly factual

### 6. Everything before Zenput **[quick]**

You skipped this in batch 1 and it's a real hole — the site currently starts in 2013 with
no explanation of how you got there.

Rough sketch is fine: where you grew up, education, first jobs, how you got into software,
how you got into welding and woodworking (the old post says woodworking since 2003, metal
since 2018 — what happened in 2018?), and how you ended up in San Francisco and then back
in Colorado.

**A:**

I got into software in 2013 when one of the founders of Zenput, who is a good friend of mine, offered me a job as a junior software engineer. Knowing that I had never written software before, he believed in me and said that I would figure it out. There we go: ten years later, I have a career as a software engineer and as a software engineering manager.

I started woodworking in high school with my dad, really in earnest, in San Diego around 2009, and then just kind of carried woodworking through. I learned to weld in 2016, or maybe 2018, when I was living in San Francisco.

While I was in San Francisco, I jumped around between a bunch of different jobs. I worked as a customer service manager for a small tech firm, and I was executive director of reallocate for a while. I spent ten years at Zenput. I worked on various other people's art projects in that period of time, mostly as a hobby. I ran a lot of community events, started a free community space, lived in two different co-living spaces, ran and organized parties for hundreds of people, ran art meetups, ran hackathons for nonprofits and tech organizations, and did a series of large builds surrounding Thumper Festival and Burning Man. 

### 7. Reallocate **[quick]**

You were **Executive Director of a nonprofit** and it's nowhere on your site. That's a
significant leadership credit and I'd never have known.

What was it, what years, how big, what did you actually do in the role, and what happened
to it?

**A:**

It was two years, from about 2013 to 2014. It's a very small organization. I was all volunteer. I was never actually paid as the executive director, which is why I don't dig into it too much.

The major outputs were that we ran a series of events called hacktivations, which were hackathons focused around pairing nonprofits with engineers, marketers, designers, skilled specialists, or skilled labor kind of people to provide pro bono work. It was the catalyst for us being able to sign the lease for free space to get donated or free community space. That was right around the same time that reallocate petered out, and I moved on to work with Zenput. 

### 8. Watch Duty **[quick]**

Also absent, also strong — Watch Duty is well known and well respected. What did you build
for them, when, and is the contribution visible anywhere?

**A:**

The team of folks that I worked with at Zenput, the original founder, John Mills, Brian Harris, and Dave Merritt, are the three founding members of Watch Duty. When they were getting set up initially, we were all living together, and I contributed to some of the early codebase there. I also did a stint as a contractor doing paid engineering work with them. That was back in 2024. They're still friends, still connected, but I don't actively work on Watch Duty any longer. 

### 9. The lighting / control side projects **[quick]**

You mentioned *"lighting system development, all of it heavily built on top of Raspberry
Pis, ESP32s, custom UIs, server cloud deployments."*

Are these one thing or several? Is it a reusable toolkit you keep applying to art projects,
or bespoke each time? Because "I have a stack I use to make big objects move and light up"
is a much better story than a list of parts — and it may be the connective tissue between
Fable Bound, the butterflies, and whatever's next.

**A:**

There are certain pieces of it that are reusable toolkits. I have predefined libraries that I like to spin up on Raspberry Pis for communicating with the computer to make it easier for me to do development work. A lot of the work on these projects is bespoke because it's specific to what the installation is actually using. There are plenty of tools that I use over and over and over again. There are lots of things that make it really easy to spin stuff up very quickly, especially using AI now.

I have built out some templated systems for how I get my ESPs up, depending on the complexity of the system and how much infrastructure that I need. I do keep coming back to these tools because they're easy to customize, they work well together, they're reliable, and I trust them. 

---

## Part 4 — The one story I need

### 10. Someone who didn't know they were capable **[deep]**

You've now said twice, in different words, that people come into your projects not knowing
they're capable of what they end up doing. That's the most compelling thing in either
batch, and right now it's an assertion.

I need one specific person. What did they show up able to do, what did you hand them, what
did they build, and where did they end up? First names or "a friend who'd never welded" is
fine — no need to expose anyone.

One real example does more for the site than three paragraphs of philosophy about
management. If you have two, give me two.

**A:**

My friend Matt is probably the best example. He showed up to the Fablebound builds without knowing me or anybody else associated with the project and just wanted to build art. He'd been around Burning Man for a long time. He'd worked on other people's art pieces, but he'd never really built his own art before or really been on a project this large, and he dove right in.

He learned to solder. He learned to weld. He learned a lot of things about project management and these sorts of artistic installations, and he really became my go-to on this project for being able to solve problems quickly. I can just kind of throw anything at him, and after a little bit of teaching and understanding, he would just take to it.

He is now pushing towards moving into art fabrication as a career, and he's working with several other people on the Fablebound project on art installations here in Denver. 

---

## Part 5 — Structural calls

### 11. Is fabrication a category or a capability? **[quick]**

You called general fabrication *"a side bucket, not really a primary thing"* and said
there's nothing in there you're excited to share. But the fabrication photos are the
strongest visual material you have.

My read: fabrication isn't a *section* of the site, it's a *capability* demonstrated inside
the projects — the ship, the butterflies, the wedding threshold. The furniture gallery
becomes a small "things I've made" strip rather than a portfolio pillar. Agree?

**A:**

Yeah, fabrication is probably a capability. It's something that I apply over and over and over in all kinds of different places. I guess I don't talk about it broadly because fabrication is not the go-to thing that I try to sell. I can fabricate, I can build, and I'm a good fabricator, but I do much better at the high-level design, project management, systems creation, organization, and structural side of things. Finding people who can do the fabrication is a much better use of my time than actually doing the fabrication myself. I'm much better at being able to coordinate a group of fabricators, engineers, and artists to create a thing than necessarily being an artisan in any one of the specific fabrication trades. 

### 12. What are your three best things? **[quick]**

The old site ordered your work by when it happened, so a 2005 furniture post and a
400-person island sat wherever the dates put them. The new index gets curated by you.

If a visitor only looks at three projects and leaves, which three, and in what order?

**A:**

If we're talking about art projects and its fable-bound, ephemeral, and this poetic kinetics butterfly installation, if we're adding in professional endeavors, then WMD and Zenput are the two major ones that I would focus on. 

### 13. Ephemerisle — confirm the demotion **[quick]**

You said it's distant past and you're not worried about focusing on it. But "led the build
for a 400-person floating island in the Sacramento Delta" is one of the best single lines
in your history, and it's evidence for exactly the thesis in Q1.

Proposed compromise: keep it as a compact credit with one strong photo and that one line —
no full project page, no new writing required from you. Fine?

**A:**

Yeah, it's a really interesting story. We can definitely expand on it more. It can warrant a full page. There's a lot to tell in there over the three years that I attended the event and worked on things. There are a lot of independent, interesting pieces that come out of it. It's very esoteric, and it's hard for a lot of people to comprehend this kind of building-a-city-on-water sort of thing. I just don't talk about it as much anymore because it was over ten years ago, but it is interesting. It has a lot of really interesting capabilities and experience that very few people on this planet have. 

---

## What I'll do with this

1. **Design and brand direction** — you asked me to own this and bring you options. I'll
   put together 2–3 distinct directions with real reasoning about what each says about you,
   rather than asking you to react to a blank page. Coming separately; it doesn't depend on
   these answers.
2. **Positioning draft** — homepage headline, bio, the through-line in your voice, once Q1
   is settled.
3. **The Fable Bound anchor page** — needs Q5.
4. **Batch 3** will be per-project detail for the Standard-tier writeups.
