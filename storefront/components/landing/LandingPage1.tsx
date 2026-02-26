import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

const brandValues = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Seriedad',
    description: 'Operamos con transparencia y honestidad desde 2016. Tu confianza es nuestra prioridad.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Tranquilidad',
    description: 'Tu artículo está seguro con nosotros. Empeña sin preocupaciones y recupéralo cuando quieras.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Servicio al Cliente',
    description: 'Te atendemos con calidez y eficiencia. Somos vecinos de García, N.L., y eso se nota.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Experiencia',
    description: 'Más de 9 años valuando y comercializando artículos en el municipio de García.',
  },
];

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
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Decorative blob */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        {/* Orange accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500" />

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* ── Columna izquierda: texto ── */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-primary-400 rounded-full text-primary-600 text-sm font-semibold bg-white shadow-sm">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse flex-shrink-0" />
                Establecidos en 2016 · García, Nuevo León
              </div>

              {/* Tagline */}
              <h1
                className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
              >
                ¡Te damos{' '}
                <span className="text-primary-500">más</span>{' '}
                por tu prenda!
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Casa de empeño de confianza en Nuevo León. Préstamos inmediatos en efectivo y bazar con artículos de calidad con garantía de 30 días.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
                >
                  Ver Artículos en Venta
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/528184743633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Solicitar Préstamo
                </a>
              </div>
            </div>

            {/* ── Columna derecha: panel naranja con datos ── */}
            <div className="hidden md:block">
              <div className="bg-primary-500 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/30 relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

                <div className="relative">
                  <p className="text-orange-100 font-semibold uppercase tracking-widest text-xs mb-6">
                    ¿Por qué elegirnos?
                  </p>

                  <div className="space-y-5">
                    {[
                      { num: '+9', label: 'Años de experiencia' },
                      { num: '30', label: 'Días de garantía en cada artículo' },
                      { num: '10%', label: 'Descuento pagando de contado' },
                      { num: '2', label: 'Sucursales para atenderte' },
                    ].map((stat) => (
                      <div key={stat.num} className="flex items-center gap-4 border-b border-white/20 pb-5 last:border-0 last:pb-0">
                        <div
                          className="text-4xl font-black text-white w-20 flex-shrink-0 leading-none"
                          style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
                        >
                          {stat.num}
                        </div>
                        <p className="text-orange-100 text-sm leading-snug">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/20 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-orange-100 text-sm">Valle de San Blas, García, Nuevo León</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── BRAND VALUES ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-black text-black mb-3"
              style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
            >
              Nuestros Valores
            </h2>
            <p className="text-gray-500 text-lg">Lo que nos hace diferentes en García, N.L.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandValues.map((value, i) => (
              <div
                key={i}
                className="group bg-white rounded-xl p-6 border-l-4 border-primary-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3
                  className="font-bold text-xl text-black mb-2"
                  style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS EN VENTA ───────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-2">Bazar</p>
            <h2
              className="text-3xl md:text-4xl font-black text-black"
              style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
            >
              Artículos en Venta
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm">
            Electrónica, electrodomésticos y herramientas usados con <strong className="text-black">garantía de 30 días</strong>. ¡10% de descuento pagando de contado!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-black font-bold text-xl mb-1">Próximamente nuevos productos</p>
            <p className="text-gray-500">Estamos preparando artículos para ti</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-bold text-lg group"
          >
            Ver Todos los Artículos
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────── */}
      <section className="bg-primary-500 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
            >
              ¿Necesitas dinero rápido?
            </h2>
            <p className="text-orange-100 text-lg">Así de sencillo es empeñar con nosotros</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              {
                step: '01',
                title: 'Trae tu artículo',
                desc: 'Visítanos en Valle de San Blas, García, N.L. con el objeto que deseas empeñar.',
                icon: '🏪',
              },
              {
                step: '02',
                title: 'Valuación gratuita',
                desc: 'Nuestros expertos evalúan tu artículo en minutos y te hacemos una oferta justa.',
                icon: '🔍',
              },
              {
                step: '03',
                title: 'Recibe tu dinero',
                desc: 'Efectivo al instante. Sin filas, sin papeleo complicado, sin esperas.',
                icon: '💵',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-black/20 rounded-full text-4xl mb-4">
                  {item.icon}
                </div>
                <div className="text-orange-200 font-bold text-sm tracking-widest uppercase mb-2">
                  Paso {item.step}
                </div>
                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-rubik), system-ui, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-orange-100 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Ver Artículos
            </Link>
            <a
              href="https://wa.me/528184743633"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-all hover:scale-105 shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
