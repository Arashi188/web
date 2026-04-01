// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CartItem from '@/components/CartItem'
import { FiWhatsApp, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface CartItemType {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    loadCart()
    
    const handleStorageChange = () => loadCart()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  const loadCart = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
    }
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }
  
  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    toast.success('Item removed from cart')
  }
  
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('storage'))
    toast.success('Cart cleared')
  }
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          totalPrice,
        }),
      })
      
      const { orderId } = await response.json()
      
      const productList = cartItems
        .map(item => `- ${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`)
        .join('\n')
      
      const message = `Hello, I want to order:\n\n${productList}\n\n*Total: ₦${totalPrice.toLocaleString()}*\n*Order ID: ${orderId}*\n\nCustomer: ${customerName}\nPhone: ${phone}`
      const encodedMessage = encodeURIComponent(message)
      
      localStorage.removeItem('cart')
      window.open(`https://wa.me/2347088028747?text=${encodedMessage}`, '_blank')
      
      toast.success('Order placed successfully!')
      router.push('/')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart to get started</p>
        <button onClick={() => router.push('/products')} className="btn-primary">
          Browse Products
        </button>
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 flex items-center gap-2 transition-colors"
        >
          <FiTrash2 />
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onUpdate={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
        
        {/* Checkout Form */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full btn-accent flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiWhatsApp />
              {isSubmitting ? 'Processing...' : 'Checkout on WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}