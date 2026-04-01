// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiPackage, FiShoppingBag, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
}

interface Order {
  id: string
  customer_name: string
  phone: string
  total_price: number
  status: string
  created_at: string
  items: any[]
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,
  })
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ])
      
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      
      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin/login')
  }
  
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }
    
    try {
      const url = editingProduct
        ? `/api/products?id=${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })
      
      if (response.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!')
        setShowProductModal(false)
        setEditingProduct(null)
        setFormData({ name: '', description: '', price: '', image: null })
        fetchData()
      } else {
        toast.error('Failed to save product')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }
  
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Product deleted!')
        fetchData()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }
  
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      
      if (response.ok) {
        toast.success('Order status updated!')
        fetchData()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-dark shadow-lg">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-dark">{products.length}</p>
              </div>
              <FiPackage className="text-4xl text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-dark">{orders.length}</p>
              </div>
              <FiShoppingBag className="text-4xl text-primary" />
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'products' ? (
              <>
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      setFormData({ name: '', description: '', price: '', image: null })
                      setShowProductModal(true)
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiPlus />
                    Add Product
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="relative w-12 h-12">
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">₦{product.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product)
                                  setFormData({
                                    name: product.name,
                                    description: product.description,
                                    price: product.price.toString(),
                                    image: null,
                                  })
                                  setShowProductModal(true)
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 border rounded-lg text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">
                      Customer: {order.customer_name} ({order.phone})
                    </p>
                    
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {item.quantity}x {item.product_name} - ₦{item.product_price?.toLocaleString()}
                        </p>
                      ))}
                    </div>
                    
                    <p className="font-bold text-primary">
                      Total: ₦{order.total_price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price (₦)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="input-field"
                />
                {!formData.image && editingProduct && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingProduct ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 btn-primary bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}