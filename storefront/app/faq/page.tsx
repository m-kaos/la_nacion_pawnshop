'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [supportEmail, setSupportEmail] = useState('soporte@kaostore.com');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch from admin settings
    setSupportEmail('soporte@kaostore.com');
  }, []);

  // TODO: This will come from admin settings
  const faqs: FAQItem[] = [
    {
      category: 'Pedidos',
      question: '¿Cómo puedo hacer un pedido?',
      answer: 'Simplemente navega por nuestros productos, agrega los artículos que desees a tu carrito y sigue el proceso de checkout. Aceptamos varias formas de pago para tu conveniencia.',
    },
    {
      category: 'Pedidos',
      question: '¿Puedo modificar mi pedido después de realizarlo?',
      answer: 'Si necesitas modificar tu pedido, contáctanos lo antes posible. Si aún no lo hemos enviado, podemos hacer cambios. Una vez enviado, deberás seguir nuestro proceso de devolución.',
    },
    {
      category: 'Pedidos',
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Una vez que tu pedido sea enviado, recibirás un email con un número de seguimiento. También puedes ver el estado de tu pedido en tu cuenta en la sección "Mis Pedidos".',
    },
    {
      category: 'Envíos',
      question: '¿Cuánto tiempo tarda el envío?',
      answer: 'El envío estándar toma 5-7 días hábiles. También ofrecemos envío express (2-3 días) y prioritario (1-2 días) por un costo adicional.',
    },
    {
      category: 'Envíos',
      question: '¿Hacen envíos internacionales?',
      answer: 'Sí, enviamos a varios países. Los tiempos de entrega y costos varían según el destino. Los impuestos de aduana son responsabilidad del destinatario.',
    },
    {
      category: 'Envíos',
      question: '¿Cuánto cuesta el envío?',
      answer: 'El envío estándar es gratis en pedidos superiores a $50. Para pedidos menores, el costo es de $5.99. El envío express cuesta $9.99 y el prioritario $19.99.',
    },
    {
      category: 'Pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos todas las tarjetas de crédito principales (Visa, MasterCard, American Express), PayPal y transferencias bancarias.',
    },
    {
      category: 'Pagos',
      question: '¿Es seguro comprar en su sitio?',
      answer: 'Absolutamente. Utilizamos encriptación SSL de nivel bancario para proteger toda tu información. Nunca almacenamos datos completos de tarjetas de crédito.',
    },
    {
      category: 'Pagos',
      question: '¿Cuándo se cargará mi tarjeta?',
      answer: 'Tu tarjeta se cargará inmediatamente después de que confirmes tu pedido. El cargo aparecerá como "KaoStore" en tu estado de cuenta.',
    },
    {
      category: 'Devoluciones',
      question: '¿Cuál es su política de devoluciones?',
      answer: 'Aceptamos devoluciones dentro de los 30 días posteriores a la recepción. Los productos deben estar sin usar y en su empaque original para un reembolso completo.',
    },
    {
      category: 'Devoluciones',
      question: '¿Cuánto tiempo tarda el reembolso?',
      answer: 'Una vez que recibamos y verifiquemos tu devolución, procesaremos el reembolso en 5-7 días hábiles. El tiempo que tarde en reflejarse en tu cuenta depende de tu banco.',
    },
    {
      category: 'Devoluciones',
      question: '¿Quién paga el envío de devolución?',
      answer: 'Para devoluciones estándar, el cliente es responsable del costo de envío. Si el producto llegó dañado o defectuoso, cubrimos todos los costos de devolución.',
    },
    {
      category: 'Cuenta',
      question: '¿Necesito crear una cuenta para comprar?',
      answer: 'No es obligatorio, pero recomendamos crear una cuenta para un checkout más rápido, rastrear tus pedidos y guardar tus direcciones.',
    },
    {
      category: 'Cuenta',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a "Mi Cuenta" → "Configuración" y podrás cambiar tu contraseña en la pestaña correspondiente.',
    },
    {
      category: 'Cuenta',
      question: '¿Olvidé mi contraseña, qué hago?',
      answer: 'Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y te enviaremos un enlace para restablecerla.',
    },
    {
      category: 'Productos',
      question: '¿Los productos tienen garantía?',
      answer: 'Todos nuestros productos tienen garantía del fabricante. La duración varía según el producto. Consulta la descripción del producto para más detalles.',
    },
    {
      category: 'Productos',
      question: '¿Tienen productos en stock?',
      answer: 'La disponibilidad se muestra en cada página de producto. Si un artículo está agotado, puedes suscribirte para recibir una notificación cuando vuelva a estar disponible.',
    },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
        <p className="text-gray-600 mb-8">
          Encuentra respuestas rápidas a las preguntas más comunes sobre KaoStore.
        </p>

        {/* Quick Links */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="font-bold mb-3">Ir a:</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase()}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition text-sm font-semibold"
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ by Category */}
        {categories.map((category) => (
          <div key={category} id={category.toLowerCase()} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-red-600 pb-2">{category}</h2>
            <div className="space-y-3">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={globalIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold pr-4">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">¿No Encontraste tu Respuesta?</h2>
          <p className="mb-6">Nuestro equipo de soporte está listo para ayudarte</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Contáctanos
            </Link>
            <a
              href={`mailto:${supportEmail}`}
              className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition font-semibold"
            >
              Enviar Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
