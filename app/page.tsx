'use client'
import Button from '@mui/material/Button'

import styles from './page.module.scss'
import HeroMain from './components/Home/HeroMain'
import Card from './components/Home/Card'

import { ParallaxContext } from '@/app/context/Parallax'

import cardImgOne from '@/public/img/homepage-cards/card_1.png'
import cardImgTwo from '@/public/img/homepage-cards/card_2.png'
import cardImgThree from '@/public/img/homepage-cards/card_3.png'

export default function Home() {
  return (
    <ParallaxContext>
      <div className={styles.container}>
        <HeroMain />
        <div className="cards" style={{
          display: 'flex',
          margin: '75px 50px',
          gap: '30px',
          justifyContent: 'center',
        }}>
          <Card
            description="Analyze extreme heat, precipitation, fire weather, and other emerging trends shaping California’s uncertain climate future."
            title="tools"
            cta="#tools"
            img={cardImgOne.src}
          />
          <Card
            description="Gain clarity on key concepts like uncertainty, Global Warming Levels, and other essential terms."
            title="guidance"
            cta=""
            img={cardImgTwo.src}
          />
          <Card
            description="Learn about the data sources, methods, analyses, and how to access them."
            title="data"
            cta=""
            img={cardImgThree.src}
          />
        </div>
        <div style={{ height: '1200px' }} />
        <Button variant="contained" href="/dashboard">Go to the dashboard</Button>
      </div>
    </ParallaxContext>
  )
}