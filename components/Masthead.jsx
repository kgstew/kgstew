import Link from 'next/link'

/**
 * Colour is free here — the tokens handle it. What differs per altitude is
 * typographic: the wordmark's face and weight, and how the nav sits under it.
 * This is the legitimate use of the altitude variants; reaching for them to set
 * a colour means the token vocabulary is wrong.
 */
export default function Masthead() {
  return (
    <header className="mb-16 flex items-baseline justify-between gap-6">
      <Link
        href="/"
        className="font-display text-lg font-semibold tracking-signal signal:text-xl draft:font-mono draft:text-base draft:tracking-legend draft:uppercase"
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
