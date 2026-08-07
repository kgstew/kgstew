import Link from 'next/link'

/**
 * The wordmark is identical on every altitude. It used to change face and case
 * per altitude, which meant the site's own name looked like it belonged to
 * three different sites depending which page you were on.
 */
export default function Masthead() {
  return (
    <header className="mb-16 flex items-baseline justify-between gap-6">
      <Link
        href="/"
        className="font-display text-lg font-semibold tracking-signal"
      >
        Kyle Stewart
      </Link>
      <nav className="flex gap-5 text-sm text-dim">
        <Link href="/work" className="hover:text-ink">
          Work
        </Link>
        <Link href="/writing" className="hover:text-ink">
          Writing
        </Link>
      </nav>
    </header>
  )
}
