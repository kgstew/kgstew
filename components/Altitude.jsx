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
    <div data-altitude={name} data-surface={surface} className="min-h-dvh bg-ground text-ink">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Masthead />
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
