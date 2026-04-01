// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { uploadImage } from '@/lib/cloudinary'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const product = await db.products.getById(parseInt(id))
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    }
    
    const products = await db.products.getAll()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const image = formData.get('image') as File
    
    if (!name || !description || !price || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const imageUrl = await uploadImage(imageBuffer, 'products')
    
    const product = await db.products.create({
      name,
      description,
      price,
      image_url: imageUrl,
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    const formData = await request.formData()
    const updates: any = {}
    
    const name = formData.get('name')
    if (name) updates.name = name
    
    const description = formData.get('description')
    if (description) updates.description = description
    
    const price = formData.get('price')
    if (price) updates.price = parseFloat(price as string)
    
    const image = formData.get('image')
    if (image && image instanceof File) {
      const imageBuffer = Buffer.from(await image.arrayBuffer())
      const imageUrl = await uploadImage(imageBuffer, 'products')
      updates.image_url = imageUrl
    }
    
    const product = await db.products.update(parseInt(id), updates)
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    await db.products.delete(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}