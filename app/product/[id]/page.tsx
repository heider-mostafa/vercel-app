'use client'

import { useState, useRef, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart, ArrowLeft, Clock, Share2, Heart, Zap, Shield, Award, Droplet, Feather, Play, Pause } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useCart } from '../../contexts/CartContext'
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

const products = [
  { 
    id: 1, 
    name: "Pink Whisper (Soft Pink)", 
    price: null, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4_4d8d7a74-079b-44ab-85e3-7fae3eca13a9.jpg-0oCxi5xZrOnn20515AEZh79PJxtwnj.png",
    rating: 4.8,
    reviews: 1234,
    sold: 5000,
    soldOut: true,
    description: "Feeling bold? This soft pink gloss is your go-to for instant confidence. It's vibrant, smooth, and leaves your lips feeling luscious and plumped. Moisturizing? Always. Unforgettable? Absolutely. Swipe it on and own your moment. 💋✨"
  },
  { 
    id: 2, 
    name: "Pearl Kisses (Pearl Effect - Light Pink)", 
    price: 9.99, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5_acacebab-b4fe-48a6-9ce0-de562f014aa4.jpg-NyGnYl8caKPmoNZ1aNuIhRrvOHAR3B.png",
    rating: 4.7,
    reviews: 987,
    sold: 3000,
    soldOut: false,
    description: "Add a touch of ethereal glamour with our pearl effect gloss. This lightweight formula creates a stunning dimensional shine while plumping your lips to perfection. Perfect for adding that extra sparkle to your smile! ✨💖"
  },
  { 
    id: 3, 
    name: "Spicy in Pink (Hot Fuchsia)", 
    price: 9.99, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6_24de94cb-2894-482f-a749-d46e48d4d0b7.jpg-PxF94KWVRmwYsr8H8TvloNQWOuoPQW.png",
    rating: 4.9,
    reviews: 2345,
    sold: 8000,
    soldOut: false,
    description: "Make a statement with this bold fuchsia shade. The perfect balance of color and comfort, this plumping formula gives you that extra oomph while keeping your lips hydrated and happy. Get ready to turn heads! 💄💗"
  },
  { 
    id: 4, 
    name: "Crimson Crush (Fiery Red)", 
    price: 9.99, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7_1e057545-39d0-4f63-9e80-5be39aa2a75a.jpg-DsNVPWddVszFdcdhfqfuzXDN9Aaii1.png",
    rating: 4.6,
    reviews: 765,
    sold: 4000,
    soldOut: false,
    description: "Every girl needs that perfect red gloss. Silky-smooth and rich, 'Crimson Crush' is your secret to bold, moisturized lips with a mirror-like shine. Plus, it gives a subtle plump for that extra 'oomph.' Date night, girls' night, any night—this is your ultimate weapon. 💄❤️"
  },
  { 
    id: 5, 
    name: "Rosy Rendezvous (Vibrant Rose)", 
    price: null, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8_6ae52ca0-d3d2-4baa-92ca-6d21514c1295.jpg-mSRkLl3BPPtyhOe2l2OoTiywdUrrmt.png",
    rating: 4.5,
    reviews: 567,
    sold: 2500,
    soldOut: true,
    description: "This rosy pink gloss is like the perfect crush—sweet, flirty, and a little irresistible. Lightweight and ultra-moisturizing, it smooths your lips while adding a plump, juicy finish. Wear it when you're feeling cute and ready to turn heads. 🌷✨"
  },
  { 
    id: 6, 
    name: "Sunkissed Spice (Spicy Coral)", 
    price: null, 
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9_d4e306de-fd0d-4466-923f-d85c3fa7f206.jpg-8bNOh16X6HaL18cJ8I2070gwBFFmIT.png",
    rating: 4.8,
    reviews: 3456,
    sold: 10000,
    soldOut: true,
    description: "Bring the heat with this spicy coral shade. It glides on smooth, keeps your lips feeling soft and moisturized, and gives a subtle plump for that perfect pout. Summer vibes? Always. Swipe it on and get ready to glow, wherever you are. ☀️🔥"
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id))
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stock, setStock] = useState(Math.floor(Math.random() * 100) + 1)
  const stockPercentage = (stock / 100) * 100

  const isPearlKisses = product?.name.includes("Pearl Kisses")
  const isCrimsonCrush = product?.name.includes("Crimson Crush")
  const isSpicyInPink = product?.name.includes("Spicy in Pink")

  useEffect(() => {
    let components: any[] = [];
    let isInitialized = false;

    const cleanup = () => {
      components.forEach(component => {
        if (component && typeof component.destroy === 'function') {
          component.destroy();
        }
      });
      components = [];
      
      // Also clean up any existing buttons in the DOM
      ['product-component-main', 'product-component-bundle1', 'product-component-bundle2'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = '';
        }
      });
    };

    const initializeShopify = () => {
      if (isInitialized) return;
      
      const client = window.ShopifyBuy.buildClient({
        domain: 'ufdi5q-da.myshopify.com',
        storefrontAccessToken: '1c37d6db1c4dba12fc0398641141b594',
      });

      window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        const productId = isPearlKisses 
          ? '8110337097909' 
          : isCrimsonCrush 
            ? '8110341652661'
            : isSpicyInPink 
              ? '8110338998453'
              : null;

        if (productId) {
          cleanup();
          isInitialized = true;

          // Initialize main buy button
          const mainComponent = ui.createComponent('product', {
            id: productId,
            node: document.getElementById('product-component-main'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  button: {
                    ":hover": { "background-color": "#000000" },
                    "background-color": "#000000",
                    ":focus": { "background-color": "#000000" },
                    "padding": "16px 32px",
                    "font-size": "18px",
                    "width": "100%"
                  }
                },
                contents: { img: false, title: false, price: false },
                text: { button: 'Add to cart' },
              }
            }
          });
          components.push(mainComponent);

          // Initialize buy button for bundle 1
          const bundle1Component = ui.createComponent('product', {
            id: productId,
            node: document.getElementById('product-component-bundle1'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  button: {
                    ":hover": { "background-color": "#000000" },
                    "background-color": "#000000",
                    ":focus": { "background-color": "#000000" }
                  }
                },
                contents: { img: false, title: false, price: false },
                text: { button: 'Add to cart' },
              }
            }
          });
          components.push(bundle1Component);

          const bundle2Component = ui.createComponent('product', {
            id: productId,
            node: document.getElementById('product-component-bundle2'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px"
                    }
                  },
                  button: {
                    ":hover": { "background-color": "#000000" },
                    "background-color": "#000000",
                    ":focus": { "background-color": "#000000" }
                  }
                },
                contents: { img: false, title: false, price: false },
                text: { button: 'Add to cart' },
              }
            }
          });
          components.push(bundle2Component);
        }
      });
    };

    if (!window.ShopifyBuy) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      script.onload = initializeShopify;
      document.body.appendChild(script);
    } else {
      initializeShopify();
    }

    return () => {
      cleanup();
    };
  }, [isPearlKisses, isCrimsonCrush, isSpicyInPink]);

  if (!product) {
    notFound()
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-black hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg mb-8"
          />
        </div>
        <div>
          <div className="bg-pink-50 rounded-lg p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-pink-600">Why You'll Love It</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 text-pink-500 mb-4" />
                <span className="font-medium text-gray-800">Long-lasting color</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Droplet className="w-12 h-12 text-pink-500 mb-4" />
                <span className="font-medium text-gray-800">Moisturizing formula</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Feather className="w-12 h-12 text-pink-500 mb-4" />
                <span className="font-medium text-gray-800">Instant effect</span>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold">
                {product.name}
              </h1>
              <Button variant="outline" size="sm" className="w-10 h-10">
                <Heart className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-lg text-gray-600">({product.reviews} reviews)</span>
            </div>
            <p className="text-4xl font-bold text-primary">${product.price?.toFixed(2) || 'Price not available'}</p>
            <p className="text-gray-700 text-lg mb-8">
              {product.description}
            </p>
          </div>
          <section className="mt-24 mb-16" aria-labelledby="upsell-heading">
            <h3 id="upsell-heading" className="text-2xl font-semibold mb-6">"Buy More, Get More" Bundle</h3>
            <div className="grid grid-cols-1 gap-4">
              <article className="flex items-center justify-between bg-white rounded-lg overflow-hidden shadow-lg p-4 relative">
                <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold uppercase rounded-br">
                  Most Popular
                </div>
                <div className="flex items-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">Buy 2, Get 1 Free</h4>
                    <p className="text-xl font-bold text-primary">$19.99</p>
                  </div>
                </div>
                <div id="product-component-bundle1" className="w-48"></div>
              </article>
              <article className="flex items-center justify-between bg-white rounded-lg overflow-hidden shadow-lg p-4 relative">
                <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold uppercase rounded-br">
                  Best Value
                </div>
                <div className="flex items-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">Buy 3, Get 2 Free</h4>
                    <p className="text-xl font-bold text-primary">$29.99</p>
                  </div>
                </div>
                <div id="product-component-bundle2" className="w-48"></div>
              </article>
            </div>
          </section>
          <div className="border-b border-gray-200 my-16"></div>
          <section className="mb-16" aria-labelledby="inventory-heading">
            <h3 id="inventory-heading" className="text-2xl font-semibold mb-6">Product Availability</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">Current Stock Level</span>
                <span className="text-lg font-bold text-primary">{stock} units</span>
              </div>
              <Progress value={stockPercentage} className="w-full h-2 mb-4" />
              <p className="text-sm text-gray-600 mb-6">
                {stock > 50 ? "Ample stock available." : stock > 20 ? "Limited stock remaining." : "Low stock. Order soon!"}
              </p>
            </div>
          </section>
          <div className="container mx-auto px-4 mb-16">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
              <div id="product-component-main"></div>
            </div>
          </div>
          <section aria-labelledby="testimonials-heading">
            <h3 id="testimonials-heading" className="text-2xl font-semibold mb-6">Customer Testimonials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-4">"I absolutely love this lip gloss! It's so moisturizing and the color is gorgeous. Definitely my new go-to!"</p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm font-medium">- Sarah J.</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-4">"The plumping effect is amazing! My lips look fuller and the shine lasts for hours. Will definitely repurchase!"</p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm font-medium">- Ashley R.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          <div className="border-b border-gray-200 my-16"></div>
          <section>
            <h3 id="results-heading" className="text-2xl font-semibold mb-6">Real Results</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
              <div className="w-full h-[300px] overflow-hidden rounded-lg shadow-lg relative mb-6">
                <video 
                  ref={videoRef}
                  className="w-full h-[600px] object-cover object-top transform -translate-y-[150px]"
                  onClick={togglePlay}
                >
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1%20(6)-SHlRImonOIB3YdC3GZatVxia85lwyt.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <Play className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="w-full max-w-2xl mx-auto mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-28%20at%2011.46.35%E2%80%AFAM%20(1)-ApTc4FkUWFrVNuX66NfdxcgIWkUMYa.png"
                  alt="Before and after comparison showing lip plumping results"
                  width={600}
                  height={300}
                  className="w-full rounded-lg shadow-lg object-cover object-[center_20%]"
                />
              </div>
              <p className="text-center text-gray-800 mt-4 font-semibold text-lg">
                Actual results after exactly 5 minutes of using it.<br />
                Notice the enhanced volume and glossy finish.
              </p>
            </div>
          </section>
          <div className="border-b border-gray-200 my-16"></div>
          <section>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="about" className="border rounded-lg mb-2 shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-lg font-medium">
                  🛍️ About Our Products
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50">
                  <p className="text-gray-700">Our lip gloss collection is designed to bring out your inner glow! Lightweight, silky, and ultra-pigmented, each gloss glides on smoothly for a mirror-like shine and all-day comfort. Infused with moisturizing ingredients, it keeps your lips soft, plump, and irresistible. With 6 stunning shades to match any mood or occasion, our glosses are your go-to for effortless glam, anytime, anywhere. ✨💋</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border rounded-lg mb-2 shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-lg font-medium">
                  🚚 Shipping Information
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50">
                  <p className="text-gray-700">We offer 3-7 day shipping across the USA! Your order will be on its way quickly, so you can start shining sooner. 💨✨ Track your package every step of the way for peace of mind.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns" className="border rounded-lg mb-2 shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 text-lg font-medium">
                  💁‍♀️ Returns & Warranty
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50">
                  <p className="text-gray-700">Due to high demand and our products selling out quickly, all sales are final. We're committed to delivering top-quality products, so if there's an issue with your order, please contact us immediately—we'll make it right! 💖✨</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
          <section>
            <h3 className="text-2xl font-semibold mb-6">Featured Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12_043205af-0287-44b9-aede-c5d291f0b8ae.jpg-H9KPMPl3bh8kfMf2S3H3pcuVXRybdG.png"
                  alt="Plump Lip Plumping Products Duo"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_f548b662-61d8-41d3-b869-514abf12b69a.jpg-Av8GTBfOJANRyKdyI5uk68kHhGDtGF.png"
                  alt="Plump Lip Collection Color Range"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2_9270b15f-ad60-4e06-83cf-acb0f3f80791.jpg-fsE8gdBQgmkcSbkB2fmsWhKVoEw5Uf.png"
                  alt="Lip Plumping Booster Results"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>
          <div className="border-b border-gray-200 my-16"></div>
        </div>
      </div>
    </div>
  )
}

