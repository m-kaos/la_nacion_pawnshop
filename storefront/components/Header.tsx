'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b-4 border-primary-500">
      {/* Top Info Bar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block bg-primary-500 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📍 Valle de San Blas | García, N.L.</span>
            <span>📞 (81) 1159-4806</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬 WhatsApp: (81) 8474-3633</span>
          </div>
        </div>
      </div>

      {/* Compact mobile info bar */}
      <div className="md:hidden bg-primary-500 text-white py-2 px-4 text-xs text-center">
        <span>📞 (81) 1159-4806 | 💬 (81) 8474-3633</span>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col text-primary-600 hover:text-primary-700 transition">
            <span className="text-xl md:text-2xl font-bold">Casa de Empeño</span>
            <span className="text-lg md:text-xl font-semibold">La Nación</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Productos
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {customer ? (
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-primary-600 transition font-medium"
                  >
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 transition font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition relative font-medium"
            >
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="bg-accent-500 hover:bg-accent-600 text-white px-3 py-2 rounded-lg transition relative font-medium text-sm"
            >
              <span className="hidden xs:inline">Carrito</span>
              <span className="xs:hidden">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition p-2"
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
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 transition font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>

              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-600 transition font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>

              {!loading && (
                <>
                  {customer ? (
                    <Link
                      href="/account"
                      className="text-gray-700 hover:text-primary-600 transition font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-primary-600 transition font-medium py-2"
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
