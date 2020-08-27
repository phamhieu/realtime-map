import { auth, supabase } from "lib/Store"

export default async function (req, res) {
  try {
    const { email, password } = req.body

    const authBody = await auth.login(email, password)
    console.log("authBody", authBody)
    console.log("authBody.id", authBody.id)

    supabase.setAccessToken(authBody.token.access_token)
    const { body: user } = await supabase.from('users')
      .match({ id: authBody.id })
      .select('*')
      .single()
    console.log(user)

    return res.status(200).json({ ...user, refresh_token: authBody.token.refresh_token })
  } catch (error) {
    console.error('error', error)
    res.status(error.status || 500).end(error.message)
  }
}