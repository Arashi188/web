// components/ProductCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  image_url: string
}

export default function ProductCard({ id, name, description, price, image_url }: ProductCardProps) {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    const cart = localStorage.getItem('cart')
    let cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.id === id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({ id, name, price, quantity: 1, image_url })
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('storage'))
    toast.success(`${name} added to cart!`)
  }
  
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="card animate-fade-in">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-semibold text-dark mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₦{price.toLocaleString()}
            </span>
            <button
              onClick={addToCart}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
            >
              <FiShoppingCart className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}