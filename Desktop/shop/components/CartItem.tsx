// components/CartItem.tsx
'use client'

import Image from 'next/image'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

interface CartItemProps {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string
  onUpdate: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export default function CartItem({ id, name, price, quantity, image_url, onUpdate, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={image_url}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-semibold text-dark">{name}</h3>
        <p className="text-primary font-bold">₦{price.toLocaleString()}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(id, quantity - 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <FiMinus />
        </button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => onUpdate(id, quantity + 1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <FiPlus />
        </button>
      </div>
      
      <button
        onClick={() => onRemove(id)}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <FiTrash2 />
      </button>
    </div>
  )
}