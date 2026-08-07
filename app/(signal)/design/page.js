/**
 * TEMPORARY — three homepage directions for Kyle to choose between.
 *
 * Delete this route once a direction is picked. It lives inside the (signal)
 * route group so it inherits the real altitude, masthead, tokens and fonts;
 * comparing copy in a mock is comparing the wrong thing.
 *
 * What all three fix, from Kyle's read of the shipped page: the copy argued
 * about his range instead of saying what he does. "It looks scattered — it's the
 * qualification" was a rebuttal to an earlier draft of my own that leaked into
 * public copy: it plants a doubt the reader did not have, then defends against
 * it. And the diagram was decoration, because nothing on the page said what it
 * depicted.
 */

const Rule = ({ label }) => (
  <div className="span-full mt-24 mb-10 border-t-2 border-ink pt-3">
    <span className="font-mono text-xs font-medium tracking-[0.18em] uppercase">{label}</span>
  </div>
)

export default function DesignDirections() {
  return (
    <div className="flow">
      <p className="span-text mt-4 text-sm text-dim">
        Three directions. Same tokens, same fonts, same page width as the live site.
      </p>

      {/* ────────────────────────────────────────────────────────────── A ── */}
      <Rule label="A · Capability-led — say what you do and what it is worth" />

      <h1 className="max-w-[20ch] text-display text-balance">
        I design technical systems and run the crews that build them.
      </h1>

      <p className="span-text mt-8 text-lg text-soft">
        Since 2013 that has meant control systems and firmware for art installations, engineering
        leadership at a software company and a hardware manufacturer, and founding or running the
        spaces and crews that make the rest of it possible.
      </p>

      <div className="mt-14 grid gap-10 sm:grid-cols-3">
        <div>
          <h2 className="legend">Control systems</h2>
          <p className="mt-3 text-[15px] leading-relaxed">
            Firmware, lighting, movement, networking and operator interfaces for pieces that have to
            run unattended in public.
          </p>
          <p className="mt-3 text-sm text-soft">
            Seventy-four fixtures on a Hong Kong lobby ceiling, driven from one touchscreen. 2,500
            addressable LEDs across a climbable stupa and six gates that sense you walking through
            them. Fourteen inches of pneumatic hull movement, sequenced from the same Ableton session
            playing the music.
          </p>
        </div>
        <div>
          <h2 className="legend">Engineering leadership</h2>
          <p className="mt-3 text-[15px] leading-relaxed">
            Ten years at one company, from a junior engineer who had never written code to IoT
            Director running product teams.
          </p>
          <p className="mt-3 text-sm text-soft">
            Restaurant operations software used by Chipotle, McDonald&rsquo;s and Domino&rsquo;s. Now
            firmware and systems at a synthesizer manufacturer, including the integration that
            finally connected its production floor to its accounting.
          </p>
        </div>
        <div>
          <h2 className="legend">Crews and organisations</h2>
          <p className="mt-3 text-[15px] leading-relaxed">
            The part most technical people skip: getting a group of volunteers to finish something
            hard, on a deadline, for free.
          </p>
          <p className="mt-3 text-sm text-soft">
            Sixty volunteers over eleven months on a Burning Man honorarium. Build lead for a
            four-hundred-person neighbourhood on the water. Operations Director of a member-run maker
            space, executive director of a nonprofit, co-founder of a monthly room where artists and
            engineers find each other.
          </p>
        </div>
      </div>

      <p className="span-text mt-12 text-lg">
        The three are one job. You can only integrate systems you can speak the language of — which
        is why the welding, the firmware and the volunteer schedule all end up being mine.
      </p>

      {/* ────────────────────────────────────────────────────────────── B ── */}
      <Rule label="B · Evidence-led — almost no self-description" />

      <h1 className="max-w-[24ch] text-4xl leading-tight text-balance">
        Ships that move on pneumatics. Ceilings that listen to one touchscreen. Factories that
        finally talk to their accounting.
      </h1>

      <p className="span-text mt-8 text-lg text-soft">
        I design the system, then build the parts nobody else is covering. Usually that is firmware,
        control and networking. Often it is also the crew.
      </p>

      <ul className="mt-14 border-t border-hairline">
        {[
          ['Fable Bound', '2023–25', 'Lead artist — design, control systems, fundraising, crew'],
          ['Star Trace', '2025–', 'Lighting control firmware, networking, operator interface'],
          ['The Seventh Gate', '2023–', 'Lighting systems — control, harness, power distribution'],
          ['WMD', '2023–', 'Systems and firmware; business operations'],
          ['Zenput', '2013–23', 'Junior engineer → full-stack → engineering manager → IoT Director'],
          ['Ephemerisle', '2016–18', 'Build lead, Elysium archipelago'],
        ].map(([title, years, role]) => (
          <li key={title} className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[10rem_5rem_1fr]">
            <span className="font-display font-semibold tracking-signal">{title}</span>
            <span className="font-mono text-xs text-dim tabular-nums">{years}</span>
            <span className="text-sm text-soft">{role}</span>
          </li>
        ))}
      </ul>

      <p className="span-text mt-10 text-soft">
        Fourteen projects across firmware, fabrication, show control, operations and organising. The
        list is the argument; there is no version of it that is one discipline.
      </p>

      {/* ────────────────────────────────────────────────────────────── C ── */}
      <Rule label="C · Keep the diagram, but make it describe something real" />

      <h1 className="max-w-[18ch] text-display text-balance">I build the thing in the middle.</h1>

      <p className="span-text mt-8 text-lg text-soft">
        A MIDI note in a live Ableton set becomes fourteen inches of a twenty-foot ship rising out of
        the desert. Nothing off the shelf does that. Someone has to design the chain and write the
        parts that do not exist.
      </p>

      {/* The same visual language as the live diagram, but labelled with an
          actual signal path instead of three abstractions. */}
      <div className="mt-12 overflow-x-auto">
        <ol className="flex min-w-[640px] items-stretch gap-0">
          {[
            ['Ableton', 'live set'],
            ['MIDI note', 'one per pattern'],
            ['Node app', 'Mac mini'],
            ['Firmware', 'ESP32 + relays'],
            ['Solenoids', '12 V'],
            ['Air jacks', '4 × 3,500 lb'],
            ['Movement', '14 in of hull'],
          ].map(([label, sub], i, arr) => (
            <li key={label} className="flex flex-1 items-center">
              <div className="min-w-0">
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase">{label}</div>
                <div className="mt-1 text-xs text-dim">{sub}</div>
              </div>
              {i < arr.length - 1 && (
                <span aria-hidden="true" className="mx-3 h-px flex-1 bg-accent" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="span-text mt-12 text-soft">
        It is the same job whether the parts are hardware modules, software services or people. A
        synthesizer factory whose production floor could not see its own accounting. Sixty
        animatronic butterflies that had to move as one flock. Nonprofits that needed engineers and
        engineers who wanted to help.
      </p>

      <p className="span-text mt-4 text-lg">
        I design the system, build the connective parts, and assemble the people who build the rest.
      </p>

      <div className="mt-24" />
    </div>
  )
}
