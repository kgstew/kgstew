/**
 * People, software and hardware converging into one system.
 *
 * Follows the original design pitch: each input has its own color, each path
 * begins at a filled node, and the terminus is an open square rather than a dot.
 * The first implementation flattened all of that to one monochrome pair of
 * weights, which is what made it read as decoration.
 *
 * People are first and heaviest, per Kyle's correction: "people are what's
 * important, they're the ones that enable the possibilities; my ability to
 * coordinate them and the tools are always secondary to the people we're
 * supporting."
 *
 * Only the curves live in the SVG. The labels are HTML because a 560-unit
 * viewBox scaled into a 360px phone turns a 9px label into 6px, and the diagram
 * has to read at 360px. The nodes and the terminal square are HTML too: the
 * curves need `preserveAspectRatio="none"` to stretch, which would squash a
 * circle into an ellipse and a square into a rectangle. Keeping the shapes in
 * CSS avoids counter-scaling four of them against a width nobody knows ahead of
 * time.
 */

const INPUTS = [
  { label: 'People', kind: 'people' },
  { label: 'Software', kind: 'software' },
  { label: 'Hardware', kind: 'hardware' },
]

export default function SignalPath() {
  return (
    <figure className="sig" aria-labelledby="sig-caption">
      <div className="sig-wide">
        <div className="sig-col sig-labels">
          {INPUTS.map(({ label, kind }) => (
            <span key={label} className="sig-label" data-kind={kind}>
              {label}
            </span>
          ))}
        </div>

        <div className="sig-col sig-nodes" aria-hidden="true">
          {INPUTS.map(({ kind }) => (
            <span key={kind} className="sig-node" data-kind={kind} />
          ))}
        </div>

        {/* Curve control points carried over from the original: a long flat run
            before a late bend, so the convergence reads as deliberate rather
            than as three diagonals meeting. */}
        <svg
          className="sig-svg"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path className="sig-line" data-kind="software" d="M0 50 H200" />
          <path className="sig-line" data-kind="hardware" d="M0 90 C79 90, 109 50, 200 50" />
          <path className="sig-line" data-kind="people" d="M0 10 C79 10, 109 50, 200 50" />
        </svg>

        <span className="sig-terminal" aria-hidden="true" />

        <span className="sig-output">
          One
          <br />
          system
        </span>
      </div>

      {/* Under sm the drawing is dropped rather than shrunk. Three rules of
          descending weight feeding one terminus says the same thing. */}
      <div className="sig-narrow">
        {INPUTS.map(({ label, kind }) => (
          <span key={label} className="sig-label" data-kind={kind}>
            {label}
          </span>
        ))}
        <span className="sig-narrow-join" aria-hidden="true" />
        <span className="sig-output-inline">One system</span>
      </div>

      <figcaption id="sig-caption" className="sr-only">
        People, software and hardware converging into one working system, with people drawn as the
        primary input.
      </figcaption>
    </figure>
  )
}
