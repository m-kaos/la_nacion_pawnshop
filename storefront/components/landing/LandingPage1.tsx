import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

export default function LandingPage1() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Hero Section - Modern & Minimal */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 py-16 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              💎 Garantía de 30 Días
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 bg-clip-text text-transparent leading-tight">
              Préstamos Rápidos
              <br />y Artículos de Calidad
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Tu casa de empeño de confianza en Nuevo León. Empeña tus objetos de valor o encuentra grandes ofertas en artículos usados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group relative px-8 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50"
              >
                <span className="relative z-10">Ver Artículos en Venta</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-accent-500 text-white rounded-full font-semibold text-lg border-2 border-accent-500 hover:bg-accent-600 hover:border-accent-600 transition-all"
              >
                Solicitar Préstamo
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Artículos en Venta
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Electrodomésticos, electrónica y más con garantía de 30 días. ¡Aprovecha nuestros descuentos pagando de contado!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-xl mb-2">
              Próximamente nuevos productos
            </p>
            <p className="text-sm text-gray-500">
              Estamos preparando algo increíble para ti
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
          >
            Ver Todos los Artículos
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Features - Modern Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Préstamos Rápidos</h3>
              <p className="text-gray-600">
                Obtén dinero en efectivo de forma rápida empeñando tus objetos de valor. Sin complicaciones.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">💚</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Garantía de 30 Días</h3>
              <p className="text-gray-600">
                Todos nuestros artículos usados cuentan con garantía de 30 días para tu tranquilidad.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">10% de Descuento</h3>
              <p className="text-gray-600">
                Paga de contado y obtén 10% de descuento en todos los artículos (no aplica en remates).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Necesitas dinero rápido?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-orange-50 max-w-2xl mx-auto">
              Visítanos en nuestras sucursales de Valle de San Blas o García. ¡Te atendemos con gusto!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block px-10 py-5 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
              >
                Ver Artículos
              </Link>
              <a
                href="https://wa.me/528184743633"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 bg-accent-500 text-white rounded-full font-bold text-lg hover:bg-accent-600 transition-all hover:scale-105 shadow-2xl border-2 border-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
