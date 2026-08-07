import Altitude from '@/components/Altitude'

export const viewport = { colorScheme: 'light', themeColor: '#f1f3f2' }

export default function DraftLayout({ children }) {
  return <Altitude name="draft">{children}</Altitude>
}
