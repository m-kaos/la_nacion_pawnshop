'use client';

import { useState } from 'react';

interface LandingPageSelectorProps {
  currentPage: 1 | 2 | 3;
  onSelectPage: (page: 1 | 2 | 3) => void;
}

export default function LandingPageSelector({
  currentPage,
  onSelectPage,
}: LandingPageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    {
      id: 1 as const,
      name: 'Moderno',
      description: 'Minimalista & Elegante',
      color: 'from-slate-500 to-red-500',
      icon: '✨',
    },
    {
      id: 2 as const,
      name: 'Vibrante',
      description: 'Audaz & Dinámico',
      color: 'from-red-600 to-orange-600',
      icon: '🔥',
    },
    {
      id: 3 as const,
      name: 'Luxury',
      description: 'Sofisticado & Premium',
      color: 'from-gray-800 to-red-800',
      icon: '💎',
    },
  ];

  const handlePageSelect = (pageId: 1 | 2 | 3) => {
    onSelectPage(pageId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Options Menu */}
      <div
        className={`absolute bottom-20 right-0 mb-2 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-gray-100">
          <div className="mb-3 px-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Estilos de Página
            </h3>
            <p className="text-xs text-gray-500">
              Elige el diseño que más te guste
            </p>
          </div>

          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 group ${
                  currentPage === page.id
                    ? 'bg-gradient-to-r ' + page.color + ' text-white shadow-lg scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl transition-transform ${
                      currentPage === page.id ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  >
                    {page.icon}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm mb-0.5 ${
                        currentPage === page.id ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {page.name}
                    </div>
                    <div
                      className={`text-xs ${
                        currentPage === page.id
                          ? 'text-white/80'
                          : 'text-gray-500'
                      }`}
                    >
                      {page.description}
                    </div>
                  </div>
                  {currentPage === page.id && (
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Solo para demostración
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
        aria-label="Seleccionar estilo de página"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {isOpen ? (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
              />
            </svg>
          )}
        </div>

        {/* Pulse Animation */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"></div>
        )}

        {/* Badge showing current page */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-xs font-bold text-red-600">{currentPage}</span>
        </div>
      </button>
    </div>
  );
}
