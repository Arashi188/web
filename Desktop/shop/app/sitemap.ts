// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shophub.com'
  
  const routes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/returns',
    '/cart',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
  
  return routes
}