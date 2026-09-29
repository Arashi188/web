// components/Footer.tsx (updated)
'use client'

import Link from 'next/link'
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiHeart, FiTag, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400 mb-4">
              Your premier WhatsApp e-commerce destination. Shop quality products and order directly via WhatsApp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-gray-400 hover:text-primary transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-400 hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/orders/track" className="text-gray-400 hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FiPhone />
                <a href="tel:+2347088028747" className="hover:text-primary transition-colors">
                  +234 708 802 8747
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMail />
                <a href="mailto:support@shophub.com" className="hover:text-primary transition-colors">
                  support@shophub.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMapPin />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="https://wa.me/2347088028747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiMail />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} ShopHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-primary text-sm transition-colors">
                Returns Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}