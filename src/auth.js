import { supabase } from './supabase'

export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      approved: false,
      role: 'user'
    })
  }

  return { data, error }
}
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('approved, role')
      .eq('id', data.user.id)
      .single()

    if (!profile.approved) {
      alert('Waiting for admin approval')
      await supabase.auth.signOut()
      return
    }
  }

  return { data, error }
}
