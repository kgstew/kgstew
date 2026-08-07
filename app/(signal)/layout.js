import Altitude from '@/components/Altitude'

/**
 * `colorScheme` is not cosmetic — it is what makes scrollbars, form controls and
 * the mobile browser chrome match, and it stops the browser applying its own
 * forced-dark heuristics. `themeColor` covers the flash on a hard navigation.
 */
export const viewport = { colorScheme: 'dark', themeColor: '#0e0f11' }

export default function SignalLayout({ children }) {
  return <Altitude name="signal">{children}</Altitude>
}
