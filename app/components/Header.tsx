'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CartIcon from './CartIcon'

export function Header() {
  const router = useRouter()

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (window.location.pathname !== '/') {
      router.push('/')
      setTimeout(() => {
        const aboutSection = document.getElementById('about-us')
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const aboutSection = document.getElementById('about-us')
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-black uppercase text-pink-600 tracking-widest hover:text-pink-700 transition-colors duration-300 transform hover:scale-105">Rovi</Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/products" className="hover:underline">Products</Link></li>
            <li><a href="#about-us" className="hover:underline" onClick={handleAboutClick}>About</a></li>
          </ul>
          <CartIcon />
        </nav>
      </div>
    </header>
  )
} 