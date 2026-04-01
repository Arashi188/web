// lib/db.ts
import { supabase } from './supabase'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  total_price: number
  status: 'pending' | 'confirmed' | 'delivered'
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: string
  product_id: number
  quantity: number
  product_name?: string
  product_price?: number
}

export const db = {
  products: {
    async getAll(): Promise<Product[]> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    
    async getById(id: number): Promise<Product | null> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) return null
      return data
    },
    
    async create(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async update(id: number, product: Partial<Product>): Promise<Product> {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    async delete(id: number): Promise<void> {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
  },
  
  orders: {
    async getAll(): Promise<(Order & { items: OrderItem[] })[]> {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const ordersWithItems = await Promise.all(
        (orders || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select(`
              *,
              products (
                name,
                price
              )
            `)
            .eq('order_id', order.id)
          
          return {
            ...order,
            items: items?.map(item => ({
              ...item,
              product_name: item.products?.name,
              product_price: item.products?.price,
            })) || [],
          }
        })
      )
      
      return ordersWithItems
    },
    
    async create(order: Omit<Order, 'id' | 'created_at' | 'status'>, items: { product_id: number; quantity: number }[]): Promise<string> {
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase()
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          customer_name: order.customer_name,
          phone: order.phone,
          total_price: order.total_price,
          status: 'pending',
        }])
      
      if (orderError) throw orderError
      
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) throw itemsError
      
      return orderId
    },
    
    async updateStatus(id: string, status: Order['status']): Promise<void> {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
    },
  },
  
  admin: {
    async validateCredentials(email: string, password: string): Promise<boolean> {
      const { data, error } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('email', email)
        .single()
      
      if (error || !data) return false
      
      const bcrypt = require('bcryptjs')
      return bcrypt.compare(password, data.password_hash)
    },
  },
}