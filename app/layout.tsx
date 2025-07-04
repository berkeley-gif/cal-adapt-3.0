import './styles/globals.scss'
import { Inter } from 'next/font/google'
import ThemeRegistry from './components/Global/Theme Registry/ThemeRegistry'
import { LeftDrawerProvider } from './context/LeftDrawerContext'
import Navigation from '@/app/components/Home/Navigation'


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Cal-Adapt',
  description: 'Climate Tools and Data',
}
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
          <Navigation />
          <LeftDrawerProvider>
            <ThemeRegistry options={{ key: 'mui-theme' }}>{children}</ThemeRegistry>
          </LeftDrawerProvider>

      </body>
    </html>
  )
}