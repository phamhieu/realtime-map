import '../styles/globals.css'
import React, { useState, useEffect } from 'react'
import UserContext from 'lib/UserContext'
import { auth, supabase } from 'lib/Store'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const authUser = auth.currentUser()
        if (!authUser) return

        const { body: user } = await supabase.from('users')
          .select('*')
          .match({ id: authUser.id })
          .single()
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    }
    loadUser()
  }, [])

  function onSignOut() {
    try {
      const user = auth.currentUser();
      user.logout()
        .then(response => {
          console.log("User logged out")
          window.location.reload()
        })
        .catch(error => {
          console.log("Failed to logout user: %o", error)
        });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        signOut: onSignOut
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
