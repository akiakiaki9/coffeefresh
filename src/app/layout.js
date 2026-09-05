// app/layout.js
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import FloatingCart from '@/components/floatingCart/FloatingCart';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  metadataBase: new URL('https://coffeefresh.uz'),
  title: {
    default: 'Coffee Fresh – Первая кофейня в Гиждуване',
    template: '%s | Coffee Fresh'
  },
  description: 'Профессиональный кофе, неповторимые вафли и вкусный fast-food в Гиждуване. Заказывайте онлайн с доставкой 24/7.',
  keywords: 'кофейня, кофе, вафли, фастфуд, Гиждуван, доставка еды, 24/7, FreshFood',
  openGraph: {
    title: 'Coffee Fresh – Первая кофейня в Гиждуване',
    description: 'Профессиональный кофе, неповторимые вафли и вкусный fast-food в Гиждуване. Заказывайте онлайн с доставкой 24/7.',
    url: 'https://coffeefresh.uz',
    siteName: 'Coffee Fresh',
    images: [
      {
        url: 'https://coffeefresh.uz/images/hero.png', // ← полный URL
        width: 1200,
        height: 630,
        alt: 'Coffee Fresh - Первая кофейня в Гиждуване',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Fresh – Первая кофейня в Гиждуване',
    description: 'Профессиональный кофе, неповторимые вафли и вкусный fast-food в Гиждуване.',
    images: ['https://coffeefresh.uz/images/hero.png'], // ← полный URL
  },
  alternates: {
    canonical: 'https://coffeefresh.uz',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
  verification: {
    google: 'ваш-google-verification',
    yandex: 'ваш-yandex-verification',
  },
  category: 'food',
  applicationName: 'Coffee Fresh',
  authors: [{ name: 'Coffee Fresh' }],
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Coffee Fresh',
    description: 'Первая кофейня в Гиждуване. Профессиональный кофе, вафли и fast-food.',
    url: 'https://coffeefresh.uz',
    image: 'https://coffeefresh.uz/images/hero.png', // ← полный URL
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Гиждуван',
      addressCountry: 'UZ'
    },
    telephone: '+998905003500',
    priceRange: '₿',
    openingHours: 'Mo-Su 08:00-23:00',
  };

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/images/hero.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/hero.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}