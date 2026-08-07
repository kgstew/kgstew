import Altitude from '@/components/Altitude'

export const viewport = { colorScheme: 'light', themeColor: '#f2efe5' }

export default function DraftLayout({ children }) {
  return <Altitude name="draft">{children}</Altitude>
}
