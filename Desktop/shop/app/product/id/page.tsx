// app/product/[id]/page.tsx (updated with wishlist and reviews)
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiWhatsApp, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import ProductReviews from '@/components/ProductReviews'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const params = useParams()
  const router = useRouter()
  
  useEffect(() => {
    fetch(`/api/products?id=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
        
        // Check if in wishlist
        const wishlist = localStorage.getItem('wishlist')
        if (wishlist) {
          const items = JSON.parse(wishlist)
          setIsInWishlist(items.some((item: any) => item.id === data.id))
        }
      })
      .catch(() => setLoading(false))
  }, [params.id])
  
  const addToCart = () => {
    if (!product) return
    
    const cart = localStorage.getItem('cart')
    let cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.push({ ...product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems))
    window.dispatchEvent(new Event('storage'))
    toast.success(`${product.name} added to cart!`)
  }
  
  const toggleWishlist = () => {
    if (!product) return
    
    const wishlist = localStorage.getItem('wishlist')
    let wishlistItems = wishlist ? JSON.parse(wishlist) : []
    
    if (isInWishlist) {
      wishlistItems = wishlistItems.filter((item: any) => item.id !== product.id)
      toast.success('Removed from wishlist')
    } else {
      wishlistItems.push(product)
      toast.success('Added to wishlist')
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    setIsInWishlist(!isInWishlist)
    window.dispatchEvent(new Event('storage'))
  }
  
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }
  
  const orderOnWhatsApp = () => {
    if (!product) return
    
    const message = `Hello, I want to order:\n*${product.name}*\nQuantity: ${quantity}\nPrice: ₦${(product.price * quantity).toLocaleString()}\n\nTotal: ₦${(product.price * quantity).toLocaleString()}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/2347088028747?text=${encodedMessage}`, '_blank')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
          <button onClick={() => router.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark">
            {product.name}
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>
          
          <div className="text-4xl font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-primary transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-primary transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={addToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FiShoppingCart />
              Add to Cart
            </button>
            <button
              onClick={orderOnWhatsApp}
              className="flex-1 btn-accent flex items-center justify-center gap-2"
            >
              <FiWhatsApp />
              Order on WhatsApp
            </button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiHeart className={isInWishlist ? 'fill-current' : ''} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button
              onClick={shareProduct}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <FiShare2 />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <ProductReviews productId={product.id} />
    </div>
  )
}