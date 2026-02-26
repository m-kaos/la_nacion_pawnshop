'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-500 shadow-md border-b-4 border-primary-700">
      {/* Top Info Bar */}
      <div className="hidden md:block bg-black text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Valle de San Blas | García, N.L.
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (81) 1159-4806
            </span>
          </div>
          <a
            href="https://wa.me/528184743633"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp: (81) 8474-3633
          </a>
        </div>
      </div>

      {/* Compact mobile info bar */}
      <div className="md:hidden bg-black text-white py-2 px-4 text-xs text-center">
        <span className="text-gray-300">📞 (81) 1159-4806</span>
        <span className="mx-2 text-primary-500">|</span>
        <a href="https://wa.me/528184743633" className="text-primary-400 font-medium">
          WhatsApp (81) 8474-3633
        </a>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
            <Image
              src="/logo_la_nacion.png"
              alt="Préstamos La Nación — Casa de Empeño"
              width={200}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-white hover:text-primary-100 transition font-medium"
            >
              Productos
            </Link>

            <Link
              href="/contact"
              className="text-white hover:text-primary-100 transition font-medium"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {customer ? (
                  <Link
                    href="/account"
                    className="text-white hover:text-primary-100 transition font-medium"
                  >
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-white hover:text-primary-100 transition font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="bg-white hover:bg-primary-50 text-primary-600 font-bold px-4 py-2 rounded-lg transition relative"
            >
              🛒 Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="bg-white hover:bg-primary-50 text-primary-600 font-bold px-3 py-2 rounded-lg transition relative text-sm"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-primary-100 transition p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-primary-400 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/products"
                className="text-white hover:text-primary-100 transition font-medium py-2 border-b border-primary-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>

              <Link
                href="/contact"
                className="text-white hover:text-primary-100 transition font-medium py-2 border-b border-primary-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>

              {!loading && (
                <>
                  {customer ? (
                    <Link
                      href="/account"
                      className="text-white hover:text-primary-100 transition font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-white hover:text-primary-100 transition font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
