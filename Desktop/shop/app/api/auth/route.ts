// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    
    const isValid = await db.admin.validateCredentials(email, password)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = generateToken({ id: 1, email })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}