import Altitude from '@/components/Altitude'

export const viewport = { colorScheme: 'light', themeColor: '#fcfcfa' }

export default function IndexLayout({ children }) {
  return <Altitude name="index">{children}</Altitude>
}
