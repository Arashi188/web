// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const adminPaths = ['/admin/dashboard', '/api/products', '/api/orders']
  const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (isAdminPath && request.nextUrl.pathname !== '/admin/login') {
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
  matcher: ['/admin/:path*', '/api/products/:path*', '/api/orders/:path*'],
}