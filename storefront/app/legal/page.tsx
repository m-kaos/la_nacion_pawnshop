'use client';

import { useState, useEffect } from 'react';

export default function LegalPage() {
  const [contactEmail, setContactEmail] = useState('contacto@kaostore.com');

  useEffect(() => {
    // TODO: Fetch from admin settings
    setContactEmail('contacto@kaostore.com');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>

        <div className="prose max-w-none space-y-8">
          {/* Last Updated */}
          <p className="text-sm text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          {/* Terms of Service */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">1. Términos de Servicio</h2>
            <p className="text-gray-700 mb-4">
              Bienvenido a KaoStore. Al acceder y usar este sitio web, aceptas cumplir con estos términos y
              condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro sitio.
            </p>
            <p className="text-gray-700">
              Nos reservamos el derecho de actualizar estos términos en cualquier momento sin previo aviso. Es tu
              responsabilidad revisar periódicamente estos términos.
            </p>
          </section>

          {/* Use of Site */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">2. Uso del Sitio</h2>
            <p className="text-gray-700 mb-4">Al usar nuestro sitio, garantizas que:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Tienes al menos 18 años de edad o cuentas con el consentimiento de un tutor legal</li>
              <li>Proporcionarás información precisa y actualizada</li>
              <li>No usarás el sitio para ningún propósito ilegal o no autorizado</li>
              <li>No violarás ninguna ley local, nacional o internacional</li>
              <li>No transmitirás virus o código malicioso</li>
            </ul>
          </section>

          {/* Purchases */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">3. Compras y Pagos</h2>
            <p className="text-gray-700 mb-4">
              Al realizar un pedido en KaoStore, aceptas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Proporcionar información de pago válida y actual</li>
              <li>Pagar todos los cargos incurridos por ti o cualquier usuario de tu cuenta</li>
              <li>Pagar todos los impuestos aplicables</li>
              <li>Que nos reservamos el derecho de rechazar o cancelar pedidos</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Los precios están sujetos a cambios sin previo aviso. Los precios mostrados al momento de la compra
              serán los que se aplicarán a tu pedido.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">4. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido del sitio, incluyendo pero no limitado a texto, gráficos, logos, imágenes,
              videos y software, es propiedad de KaoStore y está protegido por las leyes de propiedad
              intelectual.
            </p>
            <p className="text-gray-700">
              No puedes reproducir, distribuir, modificar o crear trabajos derivados sin nuestro permiso
              expreso por escrito.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              KaoStore no será responsable de ningún daño directo, indirecto, incidental, especial o
              consecuente que resulte de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>El uso o la imposibilidad de usar nuestros productos o servicios</li>
              <li>Acceso no autorizado a tus transmisiones o datos</li>
              <li>Errores u omisiones en el contenido</li>
              <li>Cualquier otra cuestión relacionada con el servicio</li>
            </ul>
          </section>

          {/* Privacy Policy */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">6. Política de Privacidad</h2>
            <p className="text-gray-700 mb-4">
              Nos comprometemos a proteger tu privacidad. Recopilamos y usamos tu información personal
              de acuerdo con nuestra Política de Privacidad.
            </p>

            <h3 className="text-xl font-bold mb-3 mt-6">Información que Recopilamos</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Nombre, dirección de email y número de teléfono</li>
              <li>Direcciones de facturación y envío</li>
              <li>Información de pago (procesada de forma segura por terceros)</li>
              <li>Historial de pedidos y preferencias</li>
              <li>Cookies y datos de navegación</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Cómo Usamos tu Información</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Procesar y cumplir con tus pedidos</li>
              <li>Comunicarnos contigo sobre tu pedido</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Enviarte ofertas y promociones (con tu consentimiento)</li>
              <li>Prevenir fraude y mejorar la seguridad</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6">Tus Derechos</h3>
            <p className="text-gray-700 mb-4">Tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información incorrecta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Optar por no recibir comunicaciones de marketing</li>
              <li>Presentar una queja ante una autoridad de protección de datos</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">7. Política de Cookies</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies para mejorar tu experiencia de navegación. Las cookies son pequeños
              archivos de texto que se almacenan en tu dispositivo.
            </p>
            <p className="text-gray-700 mb-4">
              Tipos de cookies que usamos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
              <li><strong>Funcionales:</strong> Recuerdan tus preferencias</li>
              <li><strong>Analíticas:</strong> Nos ayudan a entender cómo usas el sitio</li>
              <li><strong>Marketing:</strong> Personalizan la publicidad</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la
              funcionalidad del sitio.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">8. Ley Aplicable</h2>
            <p className="text-gray-700">
              Estos términos se rigen por las leyes aplicables en la jurisdicción donde KaoStore
              opera. Cualquier disputa se resolverá en los tribunales competentes de dicha jurisdicción.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Contacto Legal</h2>
            <p className="mb-4">
              Si tienes preguntas sobre estos términos y condiciones, contáctanos:
            </p>
            <p className="font-semibold">
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className="underline hover:text-gray-200">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
