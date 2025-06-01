'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import styles from './page.module.scss'
import HeroMain from './components/Home/HeroMain'
import Card from './components/Home/Card'
import ToolCarousel from './components/Home/ToolCarousel'

import { ParallaxContext } from '@/app/context/Parallax'

import cardImgOne from '@/public/img/homepage-cards/card_1.png'
import cardImgTwo from '@/public/img/homepage-cards/card_2.png'
import cardImgThree from '@/public/img/homepage-cards/card_3.png'

export default function Home() {
  useEffect(() => {
    AOS.init({
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <ParallaxContext>
      <div className={styles.container}>
        <HeroMain />
        <section>
          <Typography sx={{
            textAlign: 'center',
            padding: '0 20vw',
            margin: '0 auto'
          }} variant="body1" data-aos="fade-right">
            The new Cal-Adapt has been revamped to offer a more modern and intuitive experience for exploring <nobr>peer-reviewed</nobr> CMIP6 climate data. Our platform provides interactive visualizations, downloadable datasets, the Analytics Engine and the Cal-Adapt API, helping you analyze how climate change may impact California at both state and local levels.
          </Typography>
          <div data-aos="fade-right">
            <div className="cards" style={{
              display: 'flex',
              gap: '30px',
              marginTop: '65px',
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
          </div>
        </section>
        <section className="blue">
          <ToolCarousel />
        </section>
        <div style={{ height: '1200px' }} />
        <Button variant="contained" href="/dashboard">Go to the dashboard</Button>
      </div>
    </ParallaxContext>
  )
}