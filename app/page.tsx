'use client'
import Button from '@mui/material/Button'

import styles from './page.module.scss'
import HeroMain from './components/Home/HeroMain'

import { ParallaxContext } from '@/app/context/Parallax'

export default function Home() {
  return (
    <ParallaxContext>
      <div className={styles.container}>
        <HeroMain />
        <div style={{ height: '1200px' }} />
        <Button variant="contained" href="/dashboard">Go to the dashboard</Button>
      </div>
    </ParallaxContext>
  )
}