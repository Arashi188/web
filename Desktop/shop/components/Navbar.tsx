// components/Navbar.tsx (updated)
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiShoppingCart, FiMenu, FiX, FiChevronDown, FiHeart, FiTag } from 'react-icons/fi'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const updateCounts = () => {
      // Update cart count
      const cart = localStorage.getItem('cart')
      if (cart) {
        const items = JSON.parse(cart)
        setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0))
      } else {
        setCartCount(0)
      }
      
      // Update wishlist count
      const wishlist = localStorage.getItem('wishlist')
      if (wishlist) {
        const items = JSON.parse(wishlist)
        setWishlistCount(items.length)
      } else {
        setWishlistCount(0)
      }
    }
    
    updateCounts()
    window.addEventListener('storage', updateCounts)
    
    return () => window.removeEventListener('storage', updateCounts)
  }, [])
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/promotions', label: 'Promotions', icon: FiTag },
  ]
  
  const dropdownLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/orders/track', label: 'Track Order' },
  ]
  
  return (
    <nav className="bg-dark shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            Shop<span className="text-primary">Hub</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-200 ${
                  pathname === link.href ? 'text-primary' : ''
                }`}
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </Link>
            ))}
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-200"
              >
                More
                <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fade-in">
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              href="/wishlist"
              className="relative text-gray-300 hover:text-white transition-colors duration-200"
            >
              <FiHeart className="text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-white transition-colors duration-200"
            >
              <FiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </Link>
            ))}
            {dropdownLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="flex items-center justify-between py-2 text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <FiHeart />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="bg-accent text-white text-xs rounded-full px-2 py-1">
                  {wishlistCount} items
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between py-2 text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <FiShoppingCart />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-accent text-white text-xs rounded-full px-2 py-1">
                  {cartCount} items
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}