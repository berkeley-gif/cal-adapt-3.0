import Button from '@mui/material/Button'

import styles from './page.module.scss'
import HeroMain from './components/Home/HeroMain'

export default function Home() {
  return (
    <div className={styles.container}>
      <HeroMain /> 
      <div style={{height: '1200px'}} />
      <Button variant="contained" href="/dashboard">Go to the dashboard</Button>
    </div>
  )
}