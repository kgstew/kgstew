import Masthead from './Masthead'

/**
 * The only component that knows altitude names exist.
 *
 * Sets `data-altitude`, which rebinds the semantic colour tokens for everything
 * inside it — see app/styles/altitude-*.css. Nothing else in the tree needs to
 * branch on altitude for colour; `text-ink` and `border-hairline` resolve
 * differently by scope on their own.
 */
export default function Altitude({ name, surface, children }) {
  return (
    <div
      data-altitude={name}
      data-surface={surface}
      className="min-h-dvh bg-ground text-ink"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, var(--color-grid) 1.35px, transparent 0)',
        backgroundSize: 'var(--dot-pitch) var(--dot-pitch)',
      }}
    >
      <div className="mx-auto w-full max-w-(--page-max) px-(--page-gutter) py-12">
        <div className="flow">
          <Masthead />
        </div>
        <main>{children}</main>
        <footer className="mt-24 border-t border-hairline pt-6 text-sm text-dim">
          <a href="https://github.com/kgstew" className="hover:text-ink">
            GitHub
          </a>
          <span className="px-2" aria-hidden="true">
            ·
          </span>
          <a href="https://www.linkedin.com/in/kgstew" className="hover:text-ink">
            LinkedIn
          </a>
        </footer>
      </div>
    </div>
  )
}
