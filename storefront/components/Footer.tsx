'use client';

import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function Footer() {
  const { content } = useContent();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-primary-500 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-bold text-xl mb-2 text-white">Casa de Empeño</h3>
            <h4 className="font-bold text-lg mb-4 text-primary-400">La Nación</h4>
            <p className="text-gray-400 text-sm mb-4">
              Préstamos rápidos y confiables. Venta de artículos con garantía de 30 días.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=100057435074043" className="text-gray-400 hover:text-primary-400 transition" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )
              <a href="https://wa.me/528184743633" className="text-gray-400 hover:text-accent-400 transition" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-400 transition">
                  Artículos en Venta
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition">
                  Empeño Rápido
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Sucursales</h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-white mb-1">Valle de San Blas</p>
                <p className="text-gray-400">Av. del Hospital #325 L-3</p>
                <p className="text-gray-400">Valle de San Blas, N.L.</p>
                <p className="text-accent-400 mt-1">☎ (81) 1159-4806</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">García</p>
                <p className="text-gray-400">García, Nuevo León</p>
                <p className="text-accent-400 mt-1">📱 WhatsApp: (81) 8474-3633</p>
              </div>
            </div>
          </div>

          {/* Hours Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Horarios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lunes a Viernes: 9:00 AM - 7:00 PM</li>
              <li>Sábados: 9:00 AM - 3:00 PM</li>
              <li>Domingos: Cerrado</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-white text-sm">Información</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-primary-400 transition">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-primary-400 transition">
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Casa de Empeño La Nación. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
              <span className="text-gray-400">
                💚 Garantía de 30 días en todos los artículos
              </span>
              <span className="text-primary-400">
                🏆 Tu casa de empeño de confianza
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
