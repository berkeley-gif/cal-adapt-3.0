'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import useMediaQuery from '@mui/material/useMediaQuery'

import useEmblaCarousel from 'embla-carousel-react'

import Typography from '@mui/material/Typography'

import styles from '@/app/page.module.scss'
import HeroMain from './components/Home/HeroMain'
import HeroSecondary from './components/Home/HeroSecondary'
import Card from './components/Home/Card'
import ImageText from './components/Home/ImageText'
import ToolCarousel from './components/Home/ToolCarousel'
import Footer from './components/Home/Footer'
import { genCarouselData } from './lib/home/gen-carousel-data'
import { analyticsCarouselData } from './lib/home/analytics-carousel-data'

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

  const isMobile = useMediaQuery('(max-width:992px)')

  const carouselsStyle = isMobile ?
    { maxWidth: '90vw', display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center' } :
    { display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }

  const cardsCarouselClass = isMobile ?
    'hidden no-height' : `${styles.cards}`

  const cardsMobileCarouselClass = isMobile ?
    `${styles['cards-mobile']}` : 'hidden no-height'

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    loop: true // or true if you want infinite
  })
  return (
    <ParallaxContext>
      <div className={styles.container}>
        <HeroMain />
        <section>
          <Typography sx={{
            textAlign: 'center',
            padding: isMobile ? '0 30px' : '0 20vw',
            margin: '0 auto'
          }} variant="body1">
            The new Cal-Adapt has been revamped to offer a more modern and intuitive experience for exploring <nobr>peer-reviewed</nobr> CMIP6 climate data. Our platform provides interactive visualizations, downloadable datasets, the Analytics Engine and the Cal-Adapt API, helping you analyze how climate change may impact California at both state and local levels.
          </Typography>
          <div>
            <div className={cardsCarouselClass}>
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
            <div className={cardsMobileCarouselClass}>
              <div style={{ padding: '0 30px' }}>
                <div className="embla" ref={emblaRef}>
                  <div className="embla__container">
                    <div className="embla__slide">
                      <Card
                        description="Analyze extreme heat, precipitation, fire weather, and other emerging trends shaping California’s uncertain climate future."
                        title="tools"
                        cta="#tools"
                        img={cardImgOne.src}
                      />
                    </div>
                    <div className="embla__slide">
                      <Card
                        description="Gain clarity on key concepts like uncertainty, Global Warming Levels, and other essential terms."
                        title="guidance"
                        cta=""
                        img={cardImgTwo.src}
                      />
                    </div>
                    <div className="embla__slide">
                      <Card
                        description="Learn about the data sources, methods, analyses, and how to access them."
                        title="data"
                        cta=""
                        img={cardImgThree.src}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="tools" className="blue carousels" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div className="content" style={carouselsStyle}>
            <Typography variant="h2" style={{ marginBottom: '60px' }}>
              Cal-Adapt&#39;s Tool Array
            </Typography>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
              Climate Insights for Everyone
            </Typography>
            <div style={{ alignSelf: 'center' }}>
              <ToolCarousel data={genCarouselData} />
            </div>
            <Typography variant="h4" style={{ marginBottom: '20px', marginTop: '40px' }}>
              Analytics for Advanced Users
            </Typography>
            <div style={{ alignSelf: 'center' }}>
              <ToolCarousel data={analyticsCarouselData} />
            </div>
          </div>
        </section>
        <section className="secondary-hero marginless">
          <HeroSecondary />
        </section>
        <section className="grants">
          <ImageText />
        </section>
        <Footer />
      </div>
    </ParallaxContext >
  )
}