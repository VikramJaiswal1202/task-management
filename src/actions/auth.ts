'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signup(formData: FormData) {
  const raw = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  return { success: true, message: 'Check your email to confirm your account.' }
}

export async function login(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const raw = { email: formData.get('email') as string }
  const parsed = forgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) return { error: error.message }

  return { success: true, message: 'Check your email for a password reset link.' }
}

export async function resetPassword(formData: FormData) {
  const raw = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) return { error: error.message }

  redirect('/login')
}

