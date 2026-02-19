'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  const [supportEmail, setSupportEmail] = useState('soporte@kaostore.com');

  useEffect(() => {
    // TODO: Fetch from admin settings
    setSupportEmail('soporte@kaostore.com');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Política de Devoluciones</h1>

        <div className="prose max-w-none space-y-6">
          {/* Overview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">Garantía de Satisfacción del 100%</h2>
            <p className="text-gray-700">
              Queremos que estés completamente satisfecho con tu compra. Si por cualquier razón no lo estás,
              aceptamos devoluciones dentro de los 30 días posteriores a la recepción.
            </p>
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Condiciones de Devolución</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">30 Días para Devoluciones</h3>
                  <p className="text-gray-600">
                    Tienes 30 días desde la fecha de recepción para iniciar una devolución.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Condición Original</h3>
                  <p className="text-gray-600">
                    Los productos deben estar sin usar, con etiquetas originales y en su empaque original.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Reembolso Completo</h3>
                  <p className="text-gray-600">
                    Recibirás un reembolso completo del precio de compra (excluyendo gastos de envío).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Proceso Simple</h3>
                  <p className="text-gray-600">
                    Solo necesitas contactarnos y te guiaremos en cada paso del proceso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Cómo Hacer una Devolución</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Contáctanos</h3>
                  <p className="text-gray-600">
                    Envía un email a{' '}
                    <a href={`mailto:${supportEmail}`} className="text-red-600 font-semibold hover:underline">
                      {supportEmail}
                    </a>{' '}
                    con tu número de pedido y el motivo de la devolución.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Recibe Autorización</h3>
                  <p className="text-gray-600">
                    Te enviaremos un número de autorización de devolución (RMA) e instrucciones de envío.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Empaca el Producto</h3>
                  <p className="text-gray-600">
                    Empaca el producto de forma segura con todos los accesorios y documentación original.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Envía el Paquete</h3>
                  <p className="text-gray-600">
                    Envía el paquete a la dirección proporcionada. Recomendamos usar un servicio con seguimiento.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Recibe tu Reembolso</h3>
                  <p className="text-gray-600">
                    Una vez recibido y verificado, procesaremos tu reembolso en 5-7 días hábiles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Cambios</h2>
            <p className="text-gray-700 mb-4">
              Si deseas cambiar un producto por otro tamaño, color o modelo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Contáctanos para iniciar el proceso de cambio</li>
              <li>No hay costo adicional si el valor es igual o menor</li>
              <li>Si el nuevo producto cuesta más, pagas la diferencia</li>
              <li>Procesamos cambios más rápido que devoluciones</li>
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Productos No Retornables</h2>
            <p className="text-gray-700 mb-4">
              Por razones de higiene y seguridad, los siguientes productos no pueden ser devueltos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Productos de higiene personal abiertos</li>
              <li>Ropa interior o de baño usada</li>
              <li>Artículos perecederos</li>
              <li>Productos digitales descargados</li>
              <li>Artículos personalizados o hechos a medida</li>
            </ul>
          </div>

          {/* Damaged or Defective */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold mb-2 text-yellow-900">¿Producto Dañado o Defectuoso?</h3>
            <p className="text-yellow-800 mb-4">
              Si recibiste un producto dañado o defectuoso, contáctanos inmediatamente.
              Te enviaremos un reemplazo sin costo o te reembolsaremos el importe completo,
              incluyendo gastos de envío.
            </p>
            <a
              href={`mailto:${supportEmail}?subject=Producto Dañado o Defectuoso`}
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Reportar Problema
            </a>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Necesitas Ayuda con una Devolución?</h2>
            <p className="mb-6">Nuestro equipo está listo para asistirte</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${supportEmail}`}
                className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Enviar Email
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition font-semibold"
              >
                Formulario de Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
