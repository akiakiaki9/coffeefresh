"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import MenuList from '@/components/MenuList/MenuList';
import Contacts from '@/components/Contacts/Contacts';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import OrderHistoryDrawer from '@/components/OrderHistory/OrderHistoryDrawer';
import OrderResultModal from '@/components/OrderResultModal/OrderResultModal';
import Footer from '@/components/Footer/Footer';
import { useCart } from '@/context/CartContext';
import './page.css';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [result, setResult] = useState(null);
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onHistoryOpen={() => setIsHistoryOpen(true)}
      />
      <main>
        <Hero />
        <section className="home-menu container">
          <h2 className="home-menu__title">Популярное в меню</h2>
          <p className="home-menu__subtitle">
            Попробуйте наши фирменные блюда и напитки
          </p>
          <MenuList />
        </section>
        <Contacts />
      </main>
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onResult={(r) => setResult(r)}
      />
      <OrderHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <OrderResultModal result={result} onClose={() => setResult(null)} />

      {count > 0 && !isCartOpen && (
        <button className="floating-cart" onClick={() => setIsCartOpen(true)}>
          🛒 Корзина ({count})
        </button>
      )}
    </>
  );
}