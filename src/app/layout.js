import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';

import { CartProvider } from '@/context/CartContext';
import { OrderHistoryProvider } from '@/context/OrderHistoryContext';

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = 'https://www.coffeefresh.uz';

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Coffee Fresh — Premium Restoran | Gʻijduvon',
    template: '%s | Coffee Fresh',
  },

  description:
    'Coffee Fresh — Gʻijduvon Premium Restorani va qahvaxonasi. Mazali taomlar, yangi qahva, shirinliklar va shinam muhit. Menyuni koʻring va biz bilan bogʻlaning.',

  applicationName: 'Coffee Fresh',

  icons: {
    icon: '/images/icon.JPG',
    shortcut: '/images/icon.JPG',
    apple: '/images/icon.JPG',
  },

  keywords: [
    'Coffee Fresh',
    'restoran Gʻijduvon',
    'Gʻijduvon restoranlari',
    'qahvaxona Gʻijduvon',
    'Gʻijduvonda qahva',
    'Gʻijduvon menyu',
    'restoran menyusi',
    'kofe va shirinliklar',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: siteUrl,
    siteName: 'Coffee Fresh',
    title: 'Coffee Fresh — restoran va qahvaxona | Gʻijduvon',
    description:
      'Gʻijduvonda mazali taomlar, yangi qahva va shinam muhit. Coffee Fresh menyusini koʻring.',
  },

  twitter: {
    card: 'summary',
    title: 'Coffee Fresh — restoran | Gʻijduvon',
    description:
      'Gʻijduvonda mazali taomlar, yangi qahva va shirinliklar.',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'food',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${playfair.variable} ${manrope.variable} `}>
      <body>
        <CartProvider>
          <OrderHistoryProvider>
            {children}
          </OrderHistoryProvider>
        </CartProvider>
      </body>
    </html>
  );
}