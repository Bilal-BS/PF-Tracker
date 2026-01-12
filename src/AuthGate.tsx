import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function AuthGate({ children }: any) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      setUser(res.data.session?.user || null)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
  }, [])

  if (loading) return <p>Loading...</p>
  if (!user) return <p>Please login</p>

  return children
}
