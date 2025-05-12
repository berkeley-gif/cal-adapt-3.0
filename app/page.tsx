import Button from '@mui/material/Button'

import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Button variant="contained" href="/dashboard">Go to the dashboard</Button>
    </div>
  )
}