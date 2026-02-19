'use client';

import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function AboutPage() {
  const { content, loading } = useContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Acerca de KaoStore</h1>

        <div className="prose max-w-none space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
            <p className="text-lg text-gray-700">
              KaoStore nació con la visión de ofrecer productos de calidad excepcional con un servicio al cliente
              incomparable. Nos apasiona lo que hacemos y estamos comprometidos con la satisfacción de nuestros clientes.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 mb-4">
              En KaoStore, nuestra misión es proporcionar una experiencia de compra excepcional que combine:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Productos de la más alta calidad</li>
              <li>Precios competitivos y justos</li>
              <li>Servicio al cliente personalizado</li>
              <li>Envíos rápidos y seguros</li>
              <li>Garantía de satisfacción del 100%</li>
            </ul>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Calidad</h3>
              <p className="text-gray-600">
                Solo ofrecemos productos que nosotros mismos usaríamos y recomendaríamos.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">💙</div>
              <h3 className="text-xl font-bold mb-2">Confianza</h3>
              <p className="text-gray-600">
                Construimos relaciones duraderas basadas en la honestidad y transparencia.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Rapidez</h3>
              <p className="text-gray-600">
                Procesamos y enviamos tus pedidos lo más rápido posible.
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">¿Por Qué Elegir KaoStore?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Garantía de Satisfacción</h3>
                  <p className="text-gray-600">
                    Si no estás completamente satisfecho, te devolvemos tu dinero sin preguntas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Envío Rápido</h3>
                  <p className="text-gray-600">
                    Procesamos y enviamos todos los pedidos en 24-48 horas hábiles.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Atención Personalizada</h3>
                  <p className="text-gray-600">
                    Nuestro equipo está siempre disponible para ayudarte con cualquier consulta.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Pagos Seguros</h3>
                  <p className="text-gray-600">
                    Todas las transacciones están protegidas con encriptación de nivel bancario.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Tienes Preguntas?</h2>
            <p className="mb-6">
              Nuestro equipo está aquí para ayudarte. No dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Contáctanos
              </Link>
              <a
                href={`mailto:${content.supportEmail}`}
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition font-semibold"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
