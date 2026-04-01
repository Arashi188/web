// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      title: 'Welcome to ShopHub',
      subtitle: 'Your premier WhatsApp e-commerce destination',
    },
    {
      image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      title: 'Quality Products',
      subtitle: 'Shop the best items at competitive prices',
    },
  ]
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
  }, [])
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <div className="relative h-[60vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  {slide.subtitle}
                </p>
                <Link href="/products" className="btn-primary inline-block">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-primary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="container-custom py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured <span className="text-primary">Products</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}