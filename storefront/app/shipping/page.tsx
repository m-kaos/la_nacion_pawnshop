'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShippingPage() {
  const [supportEmail, setSupportEmail] = useState('soporte@kaostore.com');

  useEffect(() => {
    // TODO: Fetch from admin settings
    setSupportEmail('soporte@kaostore.com');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Política de Envíos</h1>

        <div className="prose max-w-none space-y-6">
          {/* Overview */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Envío Rápido y Seguro</h2>
            <p className="text-gray-700">
              En KaoStore nos comprometemos a procesar y enviar tu pedido lo más rápido posible.
              Todos los pedidos se procesan en 24-48 horas hábiles.
            </p>
          </div>

          {/* Shipping Times */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Tiempos de Entrega</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Envío Estándar (Gratis en pedidos +$50)</h3>
                <p className="text-gray-600">5-7 días hábiles</p>
              </div>

              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Envío Express</h3>
                <p className="text-gray-600">2-3 días hábiles - $9.99</p>
              </div>

              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Envío Prioritario</h3>
                <p className="text-gray-600">1-2 días hábiles - $19.99</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded p-4 text-sm text-gray-600">
              <strong>Nota:</strong> Los tiempos de entrega son estimados y pueden variar dependiendo
              de tu ubicación y condiciones del servicio postal.
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Procesamiento de Pedidos</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Los pedidos se procesan de lunes a viernes (días hábiles)</li>
              <li>Pedidos realizados antes de las 2:00 PM se procesan el mismo día</li>
              <li>Pedidos realizados después de las 2:00 PM se procesan al día siguiente</li>
              <li>No se procesan pedidos en fines de semana ni días festivos</li>
            </ul>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Rastreo de Pedido</h2>
            <p className="text-gray-700 mb-4">
              Una vez que tu pedido sea enviado, recibirás un email con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Número de seguimiento</li>
              <li>Enlace de rastreo directo</li>
              <li>Fecha estimada de entrega</li>
            </ul>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                También puedes rastrear tu pedido en cualquier momento desde tu{' '}
                <Link href="/account/orders" className="font-semibold underline">
                  cuenta
                </Link>
                .
              </p>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Envíos Internacionales</h2>
            <p className="text-gray-700 mb-4">
              Actualmente enviamos a los siguientes países:
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-gray-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Estados Unidos</li>
                <li>México</li>
                <li>España</li>
                <li>Argentina</li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>Colombia</li>
                <li>Chile</li>
                <li>Perú</li>
                <li>Más países próximamente</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Importante:</strong> Los pedidos internacionales pueden estar sujetos a
              impuestos de aduana y aranceles, que son responsabilidad del destinatario.
            </p>
          </div>

          {/* Issues */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Problemas con el Envío</h2>
            <p className="text-gray-700 mb-4">
              Si tienes algún problema con tu envío:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Paquete dañado o faltante</li>
              <li>Retraso significativo en la entrega</li>
              <li>Dirección incorrecta</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Por favor contáctanos de inmediato a{' '}
              <a href={`mailto:${supportEmail}`} className="text-red-600 font-semibold hover:underline">
                {supportEmail}
              </a>{' '}
              y resolveremos el problema lo antes posible.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Más Preguntas sobre Envíos?</h2>
            <p className="mb-6">Estamos aquí para ayudarte</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Contáctanos
              </Link>
              <Link
                href="/faq"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition font-semibold"
              >
                Ver FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
