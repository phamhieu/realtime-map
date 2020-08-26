import React, { useState, useEffect } from 'react'
import { getCsrfToken } from 'next-auth/client'
import styles from 'styles/components/SignIn.module.css'

/**
 * Sign in with username and password
 * 
 * @param {String}       role     DRIVER/MANAGER. default as DRIVER
 */
export default function SignIn({ role = "DRIVER" }) {
  const [csrfToken, setToken] = useState("")

  useEffect(() => {
    async function csrfToken() {
      const token = await getCsrfToken()
      setToken(token)
    }
    csrfToken()
  }, [])

  return (
    <form className={styles.container} method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
      <input name='role' type='hidden' defaultValue={role} />
      <label className={styles.label}>
        Email
        <input className={styles.input} name='username' type='email' />
      </label>
      <label className={styles.label}>
        Password
        <input className={styles.input} name='password' type='password' />
      </label>
      <button className={styles.button} type='submit'>Sign in</button>
    </form>
  )
}