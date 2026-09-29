// app/api/orders/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }
    
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId.toUpperCase())
      .single()
    
    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        quantity,
        products (
          id,
          name,
          price
        )
      `)
      .eq('order_id', orderId.toUpperCase())
    
    if (itemsError) throw itemsError
    
    // Calculate estimated delivery (7 days from order date)
    const orderDate = new Date(order.created_at)
    const estimatedDelivery = new Date(orderDate)
    estimatedDelivery.setDate(orderDate.getDate() + 7)
    
    const formattedOrder = {
      id: order.id,
      customer_name: order.customer_name,
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at,
      estimated_delivery: estimatedDelivery.toISOString(),
      items: items?.map(item => ({
        name: item.products.name,
        quantity: item.quantity,
        price: item.products.price,
      })) || [],
    }
    
    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}