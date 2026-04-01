// app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FiTruck, FiShield, FiHeadphones, FiThumbsUp } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'About Us - ShopHub',
  description: 'Learn about ShopHub - your trusted WhatsApp e-commerce platform',
}

export default function AboutPage() {
  const features = [
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep',
    },
    {
      icon: FiShield,
      title: 'Secure Shopping',
      description: 'Your transactions are safe and protected',
    },
    {
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
    },
    {
      icon: FiThumbsUp,
      title: 'Quality Guaranteed',
      description: '100% authentic products guaranteed',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-dark text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
            alt="About Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            About <span className="text-primary">ShopHub</span>
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Revolutionizing the way you shop through WhatsApp
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At ShopHub, we're on a mission to make shopping simple, convenient, and 
              accessible for everyone. By leveraging WhatsApp's popularity, we provide 
              a seamless shopping experience that fits right into your daily life.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We believe that shopping should be easy and enjoyable. That's why we've 
              created a platform where you can discover amazing products and order them 
              directly through WhatsApp - no complicated apps or processes required.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Shop Now
            </Link>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            <Image
              src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
              alt="Our Mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-primary">ShopHub</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="text-3xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">Products Sold</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-gray-600">Product Categories</p>
          </div>
        </div>
      </div>
    </div>
  )
}