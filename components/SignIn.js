import React, { useState, useEffect } from 'react'
import { auth } from 'lib/Store'

/**
 * Sign in with username and password
 * 
 * @param {String}       role     DRIVER/MANAGER. default as DRIVER
 */
export default function SignIn({ role = "DRIVER" }) {
  const [formData, updateFormData] = useState({ role });
  const [action, setAction] = useState(null);

  function onChange(e) {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  function onSubmit(event) {
    event.preventDefault();

    console.log(action, formData)
    if (action === "SIGNUP") {
      auth.signup(formData.email, formData.password)
        .then(response => {
          console.log("Success!Check your inbox! ", response)
          window.location.reload();
        })
        .catch(error => alert(error.error_description || error))
    } else if (action === "LOGIN") {
      auth.login(formData.email, formData.password, true)
        .then(response => {
          console.log("Success!Check your inbox! ", response);
          window.location.reload();
        })
        .catch(error => alert(error.error_description || error))
    }
  }

  return (
    <form className="container" onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type='email' onChange={onChange} />
      </label>
      <label>
        Password
        <input name="password" type='password' onChange={onChange} />
      </label>
      <button type='submit' onClick={() => setAction("SIGNUP")}>Sign up</button>
      <button type='submit' onClick={() => setAction("LOGIN")}>Login</button>
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
          margin-top: 0.5rem;
          padding: 0.5rem;
          font-size: 1rem;
        }
      `}</style>
    </form>
  )
}