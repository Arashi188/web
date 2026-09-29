// lib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

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
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    
    if (!token) return null
    return verifyToken(token)
  } catch (error) {
    console.error('Error getting admin from cookie:', error)
    return null
  }
}

export function requireAuth() {
  return async function middleware(request: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return NextResponse.next()
  }
}