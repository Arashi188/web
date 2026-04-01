// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Contact Us - ShopHub',
  description: 'Get in touch with ShopHub support team',
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Phone',
      details: '+234 708 802 8747',
      action: 'tel:+2347088028747',
    },
    {
      icon: FiMail,
      title: 'Email',
      details: 'support@shophub.com',
      action: 'mailto:support@shophub.com',
    },
    {
      icon: FiMapPin,
      title: 'Address',
      details: 'Lagos, Nigeria',
      action: '#',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.action}
                className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary transition-colors">
                  <info.icon className="text-2xl text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-1">{info.title}</h3>
                  <p className="text-gray-600">{info.details}</p>
                </div>
              </a>
            ))}

            {/* WhatsApp Button */}
            <div className="p-6 bg-green-50 rounded-xl shadow-md">
              <h3 className="font-semibold text-dark mb-2">Quick Support</h3>
              <p className="text-gray-600 mb-4">
                Get instant support on WhatsApp
              </p>
              <a
                href="https://wa.me/2347088028747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiSend />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}