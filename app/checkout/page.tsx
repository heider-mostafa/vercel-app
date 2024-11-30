'use client'

import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, removeFromCart, getCartTotal } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link href="/">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
              </div>
            ))}
            <div className="text-xl font-bold mt-4">
              Total: ${getCartTotal().toFixed(2)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" name="city" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" id="country" name="country" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" id="postal_code" name="postal_code" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
              <Button type="submit" className="w-full">Place Order</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

