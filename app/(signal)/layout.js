import Altitude from '@/components/Altitude'

/* colorScheme keeps scrollbars and form controls in step; themeColor colors
   the mobile browser chrome. */
export const viewport = { colorScheme: 'light', themeColor: '#f8f5ee' }

export default function SignalLayout({ children }) {
  return <Altitude name="signal">{children}</Altitude>
}
