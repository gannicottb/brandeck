import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Brandeck</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Brandeck
        </h1>

        <div>Winding Road Games card preview/generation utility.</div>

        <div className={styles.grid}>
          <a href="/cards/latest" className={styles.card}>
            <h2>Latest cards &rarr;</h2>
            <p>View the in progress patch.</p>
            <p>Note: this is slower than just going to /cards/X.Y.</p>
          </a>

          <div
            className={styles.card}
          >
            <h2>Other Versions</h2>
            <p>Go to /cards/X.Y to view those cards.</p>
          </div>

          <div
            className={styles.card}
          >
            <h2>Generate (Admin) &rarr;</h2>
            <p>
              Generate images for each card and upload to Drive
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
        <p>2022 Winding Road Games</p>
      </footer>
    </div>
  )
}

export default Home
