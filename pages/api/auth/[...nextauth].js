import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { supabase } from 'lib/Store'

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
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { username, password } = credentials

        let authUser = null
        let isSignup = false
        try {
          const { body } = await supabase.auth.login(username, password)
          authUser = body.user
        } catch (error) {
          isSignup = true
          const { body } = await supabase.auth.signup(username, password)
          authUser = body.user
        }
        if (!authUser) return Promise.resolve(null)

        let user = null
        try {
          const { body } = isSignup
            ? await supabase.from('users').insert([{ id: authUser.id, username }]).single()
            : await supabase
              .from('users')
              .match({ id: authUser.id })
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
      session.user.id = user.id
      session.user.is_manager = user.is_manager
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
      const isSignIn = (user) ? true : false
      if (isSignIn) {
        token.id = user.id
        token.email = user.username
        token.name = user.username
        token.is_manager = user.is_manager
      }
      return Promise.resolve(token)
    }
  }
}

export default (req, res) => NextAuth(req, res, options)