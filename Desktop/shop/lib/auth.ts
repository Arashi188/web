// lib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AdminPayload {
  id: number
  email: string
}

export function generateToken(admin: AdminPayload): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth() {
  return async function middleware(request: Request) {
    const token = cookies().get('admin_token')?.value
    
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return NextResponse.next()
  }
}