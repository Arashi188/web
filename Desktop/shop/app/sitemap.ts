// app/sitemap.ts (updated)
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shophub.com'
  
  const routes = [
    '',
    '/products',
    '/categories',
    '/promotions',
    '/wishlist',
    '/cart',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/returns',
    '/orders/track',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
  
  return routes
}