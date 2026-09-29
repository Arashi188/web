// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const adminPaths = ['/admin/dashboard', '/admin/products', '/admin/orders']
  const apiAdminPaths = ['/api/products', '/api/orders']
  
  const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isApiAdminPath = apiAdminPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (isAdminPath || (isApiAdminPath && request.method !== 'GET')) {
    const token = request.cookies.get('admin_token')?.value
    
    if (!token || !verifyToken(token)) {
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products/:path*',
    '/api/orders/:path*',
  ],
}