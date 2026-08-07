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

/**
 * Deliberately carries no colour. Each route group wraps its children in an
 * Altitude, which is what binds the ground and ink — putting them here would
 * mean one of the three altitudes always painted underneath the others.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
