import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from 'styles/Home.module.css'

export default function Page() {

  useEffect(() => {
    
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Live Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Live Tracker
        </h1>

        <p className={styles.description}>
          Get started by drag-drop the marker around to simulate location update
        </p>

        <div className={styles.grid}>
          <a href="/driver" className={styles.card}>
            <h3>Driver View &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>
          <a href="/manager" className={styles.card}>
            <h3>Manager View &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>
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
