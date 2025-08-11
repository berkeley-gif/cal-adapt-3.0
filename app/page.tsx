import dynamic from 'next/dynamic'

import HeroMain from './components/Home/HeroMain'
import { ParallaxContext } from '@/app/context/Parallax'

// Lazy-load the interactive homepage body
const HomeClient = dynamic(() => import('./components/Home/HomeClient'), { ssr: false })

export default function Home() {
  return (
    <>
      <ParallaxContext>
        <HeroMain />
        <HomeClient />
      </ParallaxContext>
    </>
  )
}