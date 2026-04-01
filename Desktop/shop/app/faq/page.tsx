// app/faq/page.tsx
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'FAQ - ShopHub',
  description: 'Frequently asked questions about ShopHub',
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. Enter your name and phone number, then click "Checkout on WhatsApp". You\'ll be redirected to WhatsApp with your order details pre-filled. Send the message to complete your order.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfer, mobile money, and cash on delivery. Payment details will be shared with you on WhatsApp after placing your order.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 2-5 business days depending on your location. We\'ll provide tracking information once your order is confirmed and shipped.',
    },
    {
      question: 'Do you offer returns and refunds?',
      answer: 'Yes, we offer a 7-day return policy for unused items in original packaging. Contact our support team on WhatsApp to initiate a return. Refunds are processed within 5-7 business days.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is confirmed and shipped, you\'ll receive a tracking number via WhatsApp. You can use this to track your package\'s delivery status.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we take security seriously. Your personal information is encrypted and protected. We never share your data with third parties without your consent.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within Nigeria. We\'re working on expanding our delivery network to serve international customers in the future.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team via WhatsApp at +234 708 802 8747, email at support@shophub.com, or through our contact form. We typically respond within 24 hours.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-dark text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-left text-dark">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <FiChevronUp className="text-primary" />
                  ) : (
                    <FiChevronDown className="text-gray-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}