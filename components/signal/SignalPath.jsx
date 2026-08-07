/**
 * Three inputs converging into one system.
 *
 * People are first and carry the accent at the heaviest weight, per Kyle's
 * correction: "people are what's important, they're the ones that enable the
 * possibilities; my ability to coordinate them and the tools are always
 * secondary to the people we're supporting." The accent path runs unbroken from
 * PEOPLE through to the output — the other two merge into it rather than the
 * three averaging into something new.
 *
 * The labels are HTML, not SVG `<text>`. A 960-unit viewBox scaled into a 360px
 * phone is 0.375×, which turns a 13px label into 5px — the acceptance criterion
 * for this diagram is that it reads at 360px, and scaled text cannot. So the SVG
 * holds only the connective geometry and stretches to whatever width its grid
 * cell gets, with `preserveAspectRatio="none"` and `non-scaling-stroke` keeping
 * the line weights honest while the curves distort.
 *
 * Below `sm` the SVG is dropped entirely rather than shrunk. Three stacked rules
 * of descending weight feeding one output says the same thing in the space
 * available, and needs no second drawing to maintain.
 */

const INPUTS = [
  { label: 'People', kind: 'primary' },
  { label: 'Software', kind: 'secondary' },
  { label: 'Hardware', kind: 'secondary' },
]

export default function SignalPath() {
  return (
    <figure className="sig" aria-labelledby="sig-caption">
      {/* The wide arrangement: labels, connector, output. */}
      <div className="sig-wide">
        <div className="sig-inputs">
          {INPUTS.map(({ label, kind }) => (
            <span key={label} className="sig-label" data-kind={kind}>
              {label}
            </span>
          ))}
        </div>

        <svg
          className="sig-svg"
          viewBox="0 0 200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Secondary paths first so the accent sits on top where they meet. */}
          <path className="sig-line" data-kind="secondary" d="M0 60 H70 C112 60 112 60 150 60" />
          <path className="sig-line" data-kind="secondary" d="M0 100 H70 C112 100 112 60 150 60" />
          <path className="sig-line" data-kind="primary" d="M0 20 H70 C112 20 112 60 150 60" />
          <path className="sig-line" data-kind="primary" d="M150 60 H200" />
          {/* A node at the junction. Without it the middle input is collinear
              with the output and reads as the trunk that people branch off,
              which is backwards — people are the through-line here. */}
          <circle className="sig-node" cx="150" cy="60" r="4" />
        </svg>

        <span className="sig-output">One system</span>
      </div>

      {/* Under sm: descending rules into one output. No second drawing. */}
      <div className="sig-narrow">
        {INPUTS.map(({ label, kind }) => (
          <span key={label} className="sig-label" data-kind={kind}>
            {label}
          </span>
        ))}
        <span className="sig-narrow-join" aria-hidden="true" />
        <span className="sig-output">One system</span>
      </div>

      <figcaption id="sig-caption" className="sr-only">
        People, software and hardware converging into one system.
      </figcaption>
    </figure>
  )
}
