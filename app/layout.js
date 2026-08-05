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
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <header className="mb-16 flex items-baseline justify-between gap-6">
            <a href="/" className="font-semibold tracking-tight">
              Kyle Stewart
            </a>
            <nav className="flex gap-5 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="/work">Work</a>
              <a href="/writing">Writing</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-24 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800">
            <a href="https://github.com/kgstew">GitHub</a>
            <span className="px-2">·</span>
            <a href="https://www.linkedin.com/in/kgstew">LinkedIn</a>
          </footer>
        </div>
      </body>
    </html>
  )
}
