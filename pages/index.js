import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import styles from '../styles/Home.module.css'

const MapInput = dynamic(
  () => import('components/MapInput'),
  { ssr: false }
)

const MapView = dynamic(
  () => import('components/MapView'),
  { ssr: false }
)

export default function Home() {
  const [clientRef, setClientRef] = useState(null)
  const apiEndpoint = process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT || "https://BeQiprVORewGZImzsKAS.supabase.co"
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_APIKEY || "IHDL7hnmTSlqQ1fm7kYw5SBQPY11Rp"
  // Create a single supabase client for interacting with your database 
  const supabase = createClient(apiEndpoint, apiKey);
  const center = {
    lat: 1.3489728457596013,
    lng: 103.77043978311998
  }
  const zoomLevel = 14

  useEffect(() => {
    let ref = localStorage.getItem('_client-ref')
    if (!ref) {
      ref = nanoid()
      localStorage.setItem('_client-ref', ref)
    }
    setClientRef(ref)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Live Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossOrigin=""
        />
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
          integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
          crossOrigin=""></script>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Live Tracker
        </h1>

        <p className={styles.description}>
          Get started by drag-drop the marker around to simulate location update
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <MapInput supabase={supabase} clientRef={clientRef} center={center} zoom={zoomLevel} />
          </div>
          <div className={styles.card}>
            <MapView supabase={supabase} clientRef={clientRef} center={center} zoom={zoomLevel - 1} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://supabase.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/supabase.svg" alt="Supabase Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
