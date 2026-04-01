# ShopHub - WhatsApp E-commerce Platform

A production-ready e-commerce platform built with Next.js 14, Supabase, and Cloudinary, designed for WhatsApp-based ordering.

## Features

- 🛍️ Product catalog with search and pagination
- 🛒 Shopping cart with localStorage persistence
- 💬 WhatsApp order integration
- 👑 Admin dashboard with product & order management
- 📱 Fully responsive design
- 🔒 Secure admin authentication (JWT)
- 🖼️ Cloudinary image upload
- 📊 PostgreSQL database with Supabase
- 🚀 Optimized for Vercel deployment

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **Image Storage:** Cloudinary
- **Authentication:** JWT
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Cloudinary account

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret