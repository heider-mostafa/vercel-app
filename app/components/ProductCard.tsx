'use client';

import Image from 'next/image';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number | null;
  image: string;
  rating: number;
  reviews: number;
  sold: number;
  soldOut: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isPearlKisses = product.name.includes('Pearl Kisses');
  const isCrimsonCrush = product.name.includes('Crimson Crush');
  const isSpicyInPink = product.name.includes('Spicy in Pink');

  // Load Shopify Buy Button for specific products
  useEffect(() => {
    if (isPearlKisses || isCrimsonCrush || isSpicyInPink) {
      const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      const loadScript = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = ShopifyBuyInit;
        document.head.appendChild(script);
      };

      const ShopifyBuyInit = () => {
        // Ensure ShopifyBuy is available
        if (window.ShopifyBuy) {
          const client = window.ShopifyBuy.buildClient({
            domain: 'ufdi5q-da.myshopify.com',
            storefrontAccessToken: '1c37d6db1c4dba12fc0398641141b594',
          });
          window.ShopifyBuy.UI.onReady(client).then(function (ui) {
            // Determine the correct product ID based on the product name
            const productId = isPearlKisses 
              ? '8110337097909' 
              : isCrimsonCrush 
                ? '8110341652661'
                : isSpicyInPink 
                  ? '8110338998453'
                  : null;

            if (productId) {
              ui.createComponent('product', {
                id: productId,
                node: document.getElementById(`product-component-${product.id}`),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                  product: {
                    styles: {
                      product: {
                        "@media (min-width: 601px)": {
                          "max-width": "calc(25% - 20px)",
                          "margin-left": "20px",
                          "margin-bottom": "50px"
                        }
                      },
                      button: {
                        ":hover": {
                          "background-color": "#000000"
                        },
                        "background-color": "#000000",
                        ":focus": {
                          "background-color": "#000000"
                        }
                      }
                    },
                    contents: { img: false, title: false, price: false },
                    text: { button: 'Add to cart' },
                  },
                  productSet: {
                    styles: {
                      products: {
                        "@media (min-width: 601px)": {
                          "margin-left": "-20px"
                        }
                      }
                    }
                  },
                  modalProduct: {
                    contents: {
                      img: false,
                      imgWithCarousel: true,
                      button: false,
                      buttonWithQuantity: true
                    },
                    styles: {
                      product: {
                        "@media (min-width: 601px)": {
                          "max-width": "100%",
                          "margin-left": "0px",
                          "margin-bottom": "0px"
                        }
                      },
                      button: {
                        ":hover": {
                          "background-color": "#000000"
                        },
                        "background-color": "#000000",
                        ":focus": {
                          "background-color": "#000000"
                        }
                      }
                    },
                    text: {
                      button: "Add to cart"
                    }
                  },
                  option: {},
                  cart: {
                    styles: {
                      button: {
                        ":hover": {
                          "background-color": "#000000"
                        },
                        "background-color": "#000000",
                        ":focus": {
                          "background-color": "#000000"
                        }
                      }
                    },
                    text: {
                      total: "Subtotal",
                      button: "Checkout"
                    }
                  },
                  toggle: {
                    styles: {
                      toggle: {
                        "background-color": "#000000",
                        ":hover": {
                          "background-color": "#000000"
                        },
                        ":focus": {
                          "background-color": "#000000"
                        }
                      }
                    }
                  }
                },
              });
            }
          });
        }
      };

      if (!window.ShopifyBuy) {
        loadScript();
      } else {
        ShopifyBuyInit();
      }
    }
  }, [isPearlKisses, isCrimsonCrush, isSpicyInPink, product.id]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: product.id * 0.1 }}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover"
          />
          {product.soldOut ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Sold Out</span>
            </div>
          ) : (
            <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700">Selling Out Quickly!</Badge>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name.split('(')[0].trim()}</h3>
        </Link>
        <div className="flex justify-between items-center mb-2">
          {product.price !== null ? (
            <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          ) : (
            <p className="text-xl font-semibold text-gray-500">Out of Stock</p>
          )}
          <div className="flex items-center">
            <Star className="text-yellow-400 w-4 h-4 mr-1" />
            <span>{product.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{product.reviews} reviews • {product.sold} sold</p>
        {(isPearlKisses || isCrimsonCrush || isSpicyInPink) && (
          <div id={`product-component-${product.id}`} className="w-full"></div>
        )}
      </div>
      {!product.soldOut && (
        <div className="bg-red-100 text-red-800 p-2 text-center text-sm font-semibold">
          <Clock className="inline-block w-4 h-4 mr-1" />
          Limited Time Offer
        </div>
      )}
    </motion.div>
  );
}