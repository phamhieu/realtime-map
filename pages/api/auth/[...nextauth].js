import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_ENDPOINT, process.env.NEXT_PUBLIC_SUPABASE_APIKEY);

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Supabase Auth',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      authorize: async (credentials) => {
        const { username, password, role } = credentials

        let authBody = null
        let isSignup = false
        try {
          const { body } = await supabase.auth.login(username, password)
          authBody = body
        } catch (error) {
          isSignup = true
          const { body } = await supabase.auth.signup(username, password)
          authBody = body
        }
        if (!authBody) return Promise.resolve(null)
        // console.log(authBody)

        let user = null
        try {
          const { body } = isSignup
            ? await supabase.from('users').insert([{ id: authBody.user.id, username, role }]).single()
            : await supabase
              .from('users')
              .match({ id: authBody.user.id })
              .select('*')
              .single()
          user = body
        } catch (error) {
          console.log(error)
        }
        return Promise.resolve(user)
      }
    })
  ],
  callbacks: {
    /**
     * @param  {object} session      Session object
     * @param  {object} user         User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client 
     */
    session: async (session, user, sessionToken) => {
      console.log(user)
      session.user.id = user.id
      session.user.role = user.role
      return Promise.resolve(session)
    },
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    jwt: async (token, user, account, profile, isNewUser) => {
      console.log("jwt", user)
      const isSignIn = (user) ? true : false
      if (isSignIn) {
        token.id = user.id
        token.email = user.username
        token.name = user.username
        token.role = user.role
      }
      return Promise.resolve(token)
    }
  }
}

export default (req, res) => NextAuth(req, res, options)