import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

export default function LandingPage3() {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Elegant & Luxury */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 text-sm font-serif text-red-600 border border-red-200 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Colección Exclusiva
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif mb-8 text-gray-900 leading-tight">
                Elegancia
                <br />
                <span className="italic text-red-700">atemporal</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl font-light">
                Cada pieza cuenta una historia de sofisticación y calidad excepcional.
                Descubre el lujo en su forma más pura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium hover:bg-red-700 transition-all duration-300"
                >
                  Explorar Colección
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium hover:border-red-700 hover:text-red-700 transition-all duration-300"
                >
                  Nuestra Filosofía
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-100/50 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-red-50 rounded-xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-red-700/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Gallery Style */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block mb-4 text-sm font-serif tracking-widest text-red-600 uppercase">
            Selección Curada
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
            Piezas Destacadas
          </h2>
          <div className="w-24 h-px bg-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Cada producto ha sido cuidadosamente seleccionado por nuestros expertos
            para ofrecerte solo lo mejor
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <ProductCard product={product} />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-white font-medium flex items-center gap-2"
                  >
                    Ver Detalles
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-6 text-gray-300">✨</div>
            <p className="text-2xl font-serif text-gray-700 mb-2">
              Próximamente
            </p>
            <p className="text-gray-500 font-light">
              Estamos preparando algo especial para ti
            </p>
          </div>
        )}
      </section>

      {/* Features - Elegant Cards */}
      <section className="bg-gray-900 text-white py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              La Experiencia KaoStore
            </h2>
            <p className="text-gray-400 font-light text-lg">
              Comprometidos con la excelencia en cada detalle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="mb-8 inline-block">
                <div className="w-24 h-24 rounded-full bg-red-700/20 flex items-center justify-center group-hover:bg-red-700/30 transition-colors">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-4">Calidad Premium</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Productos seleccionados con los más altos estándares de calidad y durabilidad
              </p>
            </div>

            <div className="text-center group">
              <div className="mb-8 inline-block">
                <div className="w-24 h-24 rounded-full bg-red-700/20 flex items-center justify-center group-hover:bg-red-700/30 transition-colors">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-4">Envío Prioritario</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Entrega rápida y cuidadosa. Tu pedido es nuestra prioridad
              </p>
            </div>

            <div className="text-center group">
              <div className="mb-8 inline-block">
                <div className="w-24 h-24 rounded-full bg-red-700/20 flex items-center justify-center group-hover:bg-red-700/30 transition-colors">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-4">Garantía Total</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                30 días para devoluciones. Tu satisfacción es nuestra garantía
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Únete a nuestra comunidad
              </h2>
              <p className="text-xl text-red-100 mb-10 font-light">
                Recibe ofertas exclusivas y conoce las novedades antes que nadie
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 backdrop-blur"
                />
                <button className="px-8 py-4 bg-white text-red-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
