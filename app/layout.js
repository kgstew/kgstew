import Link from 'next/link'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://kgstew.com'),
  title: {
    default: 'Kyle Stewart',
    template: '%s — Kyle Stewart',
  },
  description: 'I design systems and assemble the people who build them.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <header className="mb-16 flex items-baseline justify-between gap-6">
            <Link href="/" className="font-semibold tracking-tight">
              Kyle Stewart
            </Link>
            <nav className="flex gap-5 text-sm text-dim">
              <Link href="/work">Work</Link>
              <Link href="/writing">Writing</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-24 border-t border-hairline pt-6 text-sm text-dim">
            <a href="https://github.com/kgstew">GitHub</a>
            <span className="px-2">·</span>
            <a href="https://www.linkedin.com/in/kgstew">LinkedIn</a>
          </footer>
        </div>
      </body>
    </html>
  )
}
