import Altitude from '@/components/Altitude'

export const viewport = { colorScheme: 'light', themeColor: '#f8f5ee' }

export default function IndexLayout({ children }) {
  return <Altitude name="index">{children}</Altitude>
}
