'use client';

import Link from 'next/link';

export default function SitemapPage() {
  const sitemap = {
    'Tienda': [
      { name: 'Inicio', href: '/' },
      { name: 'Productos', href: '/products' },
      { name: 'Carrito', href: '/cart' },
    ],
    'Mi Cuenta': [
      { name: 'Iniciar Sesión', href: '/login' },
      { name: 'Registrarse', href: '/register' },
      { name: 'Mi Cuenta', href: '/account' },
      { name: 'Mis Pedidos', href: '/account/orders' },
      { name: 'Mis Direcciones', href: '/account/addresses' },
      { name: 'Configuración', href: '/account/settings' },
    ],
    'Información': [
      { name: 'Acerca de', href: '/about' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Envíos', href: '/shipping' },
      { name: 'Devoluciones', href: '/returns' },
      { name: 'Preguntas Frecuentes', href: '/faq' },
    ],
    'Legal': [
      { name: 'Términos y Condiciones', href: '/legal' },
      { name: 'Política de Privacidad', href: '/legal#privacidad' },
      { name: 'Política de Cookies', href: '/legal#cookies' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Mapa del Sitio</h1>
        <p className="text-gray-600 mb-8">
          Encuentra rápidamente cualquier página de KaoStore
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(sitemap).map(([category, links]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-red-600">{category}</h2>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-red-600 transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-8 border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Acceso Rápido</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/products"
              className="bg-white p-4 rounded-lg hover:shadow-md transition text-center font-semibold"
            >
              Ver Productos
            </Link>
            <Link
              href="/account/orders"
              className="bg-white p-4 rounded-lg hover:shadow-md transition text-center font-semibold"
            >
              Rastrear Pedido
            </Link>
            <Link
              href="/contact"
              className="bg-white p-4 rounded-lg hover:shadow-md transition text-center font-semibold"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
