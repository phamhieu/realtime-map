import React, { useState, useEffect } from 'react'
import { getCsrfToken } from 'next-auth/client'
import { useRouter } from 'next/router'

/**
 * Sign in with username and password
 * 
 * @param {String}       role     DRIVER/MANAGER. default as DRIVER
 */
export default function SignIn({ role = "DRIVER" }) {
  const router = useRouter()
  const [csrfToken, setToken] = useState("")

  useEffect(() => {
    async function csrfToken() {
      const token = await getCsrfToken()
      setToken(token)
    }
    csrfToken()
  }, [])

  return (
    <form className="container" method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
      <input name='role' type='hidden' defaultValue={role} />
      <input name='callbackUrl' type='hidden' defaultValue={`${process.env.NEXT_PUBLIC_URL}${router.asPath}`} />
      <label>
        Email
        <input name='username' type='email' />
      </label>
      <label>
        Password
        <input name='password' type='password' />
      </label>
      <button type='submit'>Sign in</button>
      <style jsx>{`
        .container {
          min-width: 20rem;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
        }
        
        label {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        input {
          margin-top: 0.5rem;
          padding: 0.5rem;
        
          font-size: 1rem;
        }
        
        button {
          padding: 0.5rem;
          font-size: 1rem;
        }
      `}</style>
    </form>
  )
}