import type { Metadata } from 'next';
import { Work_Sans, Rubik } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Casa de Empeño La Nación - Préstamos Rápidos y Venta de Artículos',
  description: 'Casa de Empeño La Nación en Nuevo León. Préstamos rápidos empeñando objetos de valor. Venta de electrónica, electrodomésticos y más con garantía de 30 días. Sucursales en San Blas y García.',
  keywords: 'casa de empeño, préstamos rápidos, empeño México, venta electrodomésticos, San Blas, García, Nuevo León, empeño joyería, empeño electrónica',
  icons: {
    icon: '/logo_pestaña.png',
    apple: '/logo_pestaña.png',
  },
  openGraph: {
    title: 'Casa de Empeño La Nación',
    description: 'Préstamos rápidos y venta de artículos con garantía',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${workSans.variable} ${rubik.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
