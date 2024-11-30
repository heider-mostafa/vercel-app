'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function CartIcon() {
  const { cart, removeFromCart, getCartTotal } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            You have {totalItems} item(s) in your cart
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <strong>Total: ${getCartTotal().toFixed(2)}</strong>
        </div>
        <Button className="w-full mt-4" onClick={handleCheckout}>
          Checkout
        </Button>
      </SheetContent>
    </Sheet>
  )
}

