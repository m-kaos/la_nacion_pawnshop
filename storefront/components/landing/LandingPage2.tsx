import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

export default function LandingPage2() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await graphqlClient.query<ProductListResponse>(
          GET_PRODUCTS,
          { options: { take: 6 } }
        );
        const allProducts = result.data?.products.items || [];

        // Filter out products where ALL variants have no stock
        const inStockProducts = allProducts.filter(product => {
          return product.variants.some(variant => variant.stockLevel !== 'OUT_OF_STOCK');
        });

        setProducts(inStockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Bold & Vibrant */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900 via-black to-orange-900"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block px-6 py-2 bg-red-600 text-white font-bold uppercase tracking-wider text-sm rounded-full animate-pulse">
                Tendencias 2025
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-8 leading-none">
              <span className="block text-white">VIVE</span>
              <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                EL MOMENTO
              </span>
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
              La moda no espera. Descubre las últimas tendencias y marca la diferencia
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/products"
                className="group relative px-12 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xl rounded-full overflow-hidden transform hover:scale-110 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  COMPRAR AHORA
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>
              <Link
                href="/about"
                className="px-12 py-5 border-2 border-white text-white font-bold text-xl rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                CONOCER MÁS
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products - Bold Grid */}
      <section className="container mx-auto px-4 py-32">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-black text-4xl md:text-6xl lg:text-8xl tracking-tighter">
              LO MÁS HOT
            </span>
          </div>
          <p className="text-lg md:text-2xl text-white font-light">
            Los productos que todo el mundo quiere
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/10 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative transform hover:-translate-y-4 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-3xl text-white border-2 border-white/20">
            <div className="text-8xl mb-6">🔥</div>
            <p className="text-3xl font-bold mb-4">
              PRÓXIMAMENTE
            </p>
            <p className="text-xl text-white/60">
              Preparando algo ÉPICO
            </p>
          </div>
        )}
      </section>

      {/* Features - Diagonal Split */}
      <section className="bg-gradient-to-br from-black via-red-950 to-black py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-red-600 to-red-800 p-10 rounded-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl font-black text-white/5">01</div>
              <div className="relative">
                <div className="text-6xl mb-6">⚡</div>
                <h3 className="font-black text-3xl mb-4">ENVÍO FLASH</h3>
                <p className="text-red-100 text-lg">
                  Recíbelo mañana. Porque esperar no es una opción.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-600 to-orange-800 p-10 rounded-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl font-black text-white/5">02</div>
              <div className="relative">
                <div className="text-6xl mb-6">🛡️</div>
                <h3 className="font-black text-3xl mb-4">SUPER SEGURO</h3>
                <p className="text-orange-100 text-lg">
                  Tus datos protegidos con la mejor tecnología.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-yellow-600 to-yellow-800 p-10 rounded-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl font-black text-white/5">03</div>
              <div className="relative">
                <div className="text-6xl mb-6">🎁</div>
                <h3 className="font-black text-3xl mb-4">SATISFACCIÓN TOTAL</h3>
                <p className="text-yellow-100 text-lg">
                  30 días para cambios. Sin preguntas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full Width */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 leading-tight">
            NO TE LO
            <br />
            <span className="text-yellow-300">PIERDAS</span>
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-3xl mx-auto">
            Únete a la revolución del shopping online
          </p>
          <Link
            href="/products"
            className="inline-block px-16 py-6 bg-black text-white font-black text-2xl rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110"
          >
            EMPEZAR YA →
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
