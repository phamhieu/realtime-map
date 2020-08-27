import React from 'react'
import Head from 'next/head'
import styles from 'styles/Map.module.css'
import dynamic from 'next/dynamic'
import { supabase, auth } from 'lib/Store'
import SignIn from 'components/SignIn'

const MapView = dynamic(
  () => import('components/MapView'),
  { ssr: false }
)

export default function Page() {
  const user = auth.currentUser();
  const center = {
    lat: 1.3489728457596013,
    lng: 103.77043978311998
  }
  const zoomLevel = 11

  return (
    <div className={styles.container}>
      <Head>
        <title>Manager View</title>
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
          Manager View
        </h1>

        <p className={styles.description}>
          As manager, you can view all drivers' locations as long as the drivers are ONLINE
        </p>

        <div className={styles.grid}>
          {!user && <SignIn />}
          {user && (
            <div className={styles.card}>
              <MapView supabase={supabase} center={center} zoom={zoomLevel} />
              <div className={styles.profile_container}>
                Signed in as {user.email} [{user.role}]<br />
                <button className={styles.sign_out} onClick={() => {
                  user.logout()
                    .then(response => {
                      console.log("User logged out")
                      window.location.reload()
                    })
                    .catch(error => {
                      console.log("Failed to logout user: %o", error)
                    });
                }}>Sign out</button>
              </div>
            </div>
          )}
        </div>

      </main>

      <footer className="footer">
        <a
          href="https://supabase.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/supabase.svg" alt="Supabase Logo" className="logo" />
        </a>
      </footer>
    </div>
  )
}
