import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SCRIPT-8 v2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SCRIPT-8 v2</h1>

        <p>This is the SCRIPT-8 rewrite.</p>
      </main>
    </div>
  )
}
