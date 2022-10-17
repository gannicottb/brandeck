import { drive_v3 } from 'googleapis'
import { DriveClient } from 'lib/DriveClient'
import { FolderType } from 'lib/import'
import { getRootId, Version } from 'lib/utils'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'


interface Folder {
  id: string
  name: string
}

async function getVersionsFor(drive: drive_v3.Drive, gameName: string) {
  // find the latest version for astromon
  const allMajorVersions = await drive.files.list({
    q: `name contains 'v' and mimeType = '${FolderType}' and parents in '${getRootId(gameName)}'`
  })

  const majors: Folder[] = (allMajorVersions.data.files || []).map(f => {
    return { id: f.id || "", name: f.name || "" }
  })

  const allVersions = await Promise.all(majors.map(async major => {
    const minorVersions = await drive.files.list({
      q: `name contains '.' and mimeType = '${FolderType}' and parents in '${major.id}'`
    })

    const names = (minorVersions.data.files || []).map(f => f.name || "").filter(s => s != "")
    return names.map<Version>(minor => {
      return { major: Number(major.name.replace("v", "")), minor: Number(minor.replace(".", "")) }
    })
  })).then(x => x.flat(1))

  return allVersions
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const drive = DriveClient.getInstance().drive()

  const gameVersions: GameVersionMap = {
    "astromon": await getVersionsFor(drive, "astromon")
  }

  return {
    props: {
      gameVersions
    }, // will be passed to the page component as props
  }
}

type GameVersionMap = {
  [key: string]: Version[]
}
interface HomeProps {
  gameVersions: GameVersionMap
}

const Home: NextPage<HomeProps, {}> = ({ gameVersions }: HomeProps) => {
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
          {Object.keys(gameVersions).flatMap(gameName => {
            const versions = gameVersions[gameName]

            return versions.map(v =>
              <div className={styles.card} key={`${v.major}.${v.minor}`}>
                <h3>{gameName}</h3>
                <h2><Link href={`/astromon/cards/${v.major}.${v.minor}`}>{`${v.major}.${v.minor}`}</Link></h2>
                <p>View this version.</p>
              </div>)
          }
          )}

          <div
            className={styles.card}
          >
            <h2>Other Versions</h2>
            <p>Go to /game/cards/X.Y to view those cards.</p>
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
