"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiMenu, FiX, FiClock } from 'react-icons/fi';
import { FaInstagram, FaTelegramPlane, FaPhoneAlt } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import './Navbar.css';

export default function Navbar({
  onCartOpen = () => { },
  onHistoryOpen = () => { },
}) {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    const onEsc = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link href="/" className="navbar__logo" onClick={closeMenu}>
          Coffee<span className="navbar__logo-accent"> Fresh</span>
        </Link>

        <nav className="navbar__links">
          <Link href="/">Главная</Link>
          <Link href="/menu">Меню</Link>
          <Link href="#contacts">Контакты</Link>
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__history"
            onClick={onHistoryOpen}
            aria-label="История заказов"
          >
            <FiClock size={20} />
          </button>

          <button
            className="navbar__cart"
            onClick={onCartOpen}
            aria-label="Открыть корзину"
          >
            <FiShoppingBag size={20} />
            {count > 0 && <span className="navbar__badge">{count}</span>}
          </button>

          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      <div
        className={`navbar__overlay ${menuOpen ? 'navbar__overlay--visible' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="navbar__mobile-header">
          <Link href="/" className="navbar__logo" onClick={closeMenu}>
            Coffee<span className="navbar__logo-accent"> Fresh</span>
          </Link>
          <button
            className="navbar__mobile-close"
            onClick={closeMenu}
            aria-label="Закрыть меню"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="navbar__mobile-links">
          <Link href="/" onClick={closeMenu}>
            <span>01</span> Главная
          </Link>
          <Link href="/menu" onClick={closeMenu}>
            <span>02</span> Меню
          </Link>
          <Link href="#contacts" onClick={closeMenu}>
            <span>03</span> Контакты
          </Link>
        </nav>

        <div className="navbar__mobile-divider" />

        <div className="navbar__mobile-contacts">
          <a href="tel:+998918859999">
            <FaPhoneAlt size={16} /> +998 91 885 99 99
          </a>
          <a href="https://t.me/coffeefreshbot" target="_blank" rel="noreferrer">
            <FaTelegramPlane size={16} /> Telegram
          </a>
          <a
            href="https://www.instagram.com/coffee_fresh_restaurant/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram size={16} /> Instagram
          </a>
        </div>

        <div className="navbar__mobile-footer">Гиждуван · Узбекистан</div>
      </aside>
    </header>
  );
}