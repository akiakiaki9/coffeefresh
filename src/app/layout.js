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

export const metadata = {
  title: 'Coffee Fresh — премиальный ресторан в Гиждуване',
  description: 'Свежий кофе, авторские блюда и уютная атмосфера. Гиждуван, Узбекистан.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${manrope.variable}`}>
      <body>
        <CartProvider>
          <OrderHistoryProvider>{children}</OrderHistoryProvider>
        </CartProvider>
      </body>
    </html>
  );
}