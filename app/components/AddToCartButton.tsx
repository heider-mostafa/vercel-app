'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useCart } from '../contexts/CartContext'
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart } from 'lucide-react'

interface AddToCartButtonProps {
  productId: number
  productName: string
  productPrice: number
}

export function AddToCartButton({ productId, productName, productPrice }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    const item = {
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity
    }
    
    addToCart(item)
    toast({
      title: "Added to cart",
      description: `${quantity} ${productName} added to your cart.`,
    })
  }

  return (
    <Button 
      onClick={handleAddToCart}
      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  )
} 