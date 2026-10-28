"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiArrowUpRight,
} from "react-icons/fi";
import {
  FaInstagram,
  FaTelegramPlane,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { useCart } from "@/context/CartContext";
import "./Navbar.css";

export default function Navbar({
  onCartOpen = () => { },
  onHistoryOpen = () => { },
}) {
  const { items } = useCart();

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${menuOpen ? "navbar--menu-open" : ""}`}>
      <div className="container navbar__inner">
        <Link
          href="/"
          className="navbar__logo"
          onClick={closeMenu}
          aria-label="Coffee Fresh — bosh sahifa"
        >
          <span className="navbar__logo-icon" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M11 15h17v9a8.5 8.5 0 0 1-17 0v-9Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M28 18h2.5a3.5 3.5 0 0 1 0 7H28"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M15 11c-1.5-2 1.5-3 0-5m6 5c-1.5-2 1.5-3 0-5m5 5c-1.5-2 1.5-3 0-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="navbar__logo-copy">
            <span className="navbar__logo-main">
              Coffee<span className="navbar__logo-accent">Fresh</span>
            </span>
            <span className="navbar__logo-caption">
              COFFEE · FOOD · MOMENTS
            </span>
          </span>
        </Link>

        <nav
          className="navbar__links"
          aria-label="Asosiy navigatsiya"
        >
          <Link href="/" className="navbar__link">
            Bosh sahifa
          </Link>
          <Link href="/menu" className="navbar__link">
            Menyu
          </Link>
          <Link href="/#contacts" className="navbar__link">
            Kontaktlar
          </Link>
          <Link href="/#qr" className="navbar__link navbar__link--qr">
            QR menyu
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__icon navbar__history"
            onClick={onHistoryOpen}
            aria-label="Buyurtmalar tarixi"
            title="Buyurtmalar tarixi"
          >
            <MdOutlineReceiptLong size={21} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="navbar__icon navbar__icon--primary"
            onClick={onCartOpen}
            aria-label={`Savatni ochish. ${count} ta mahsulot`}
            title="Savat"
          >
            <FiShoppingBag size={19} aria-hidden="true" />

            {count > 0 && (
              <span className="navbar__badge">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>

          <button
            type="button"
            className="navbar__icon navbar__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Menyuni ochish"
            aria-expanded={menuOpen}
            aria-controls="navbar-mobile-drawer"
          >
            <FiMenu size={23} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`navbar__overlay ${menuOpen ? "is-open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        id="navbar-mobile-drawer"
        className={`navbar__drawer ${menuOpen ? "is-open" : ""}`}
        aria-label="Mobil navigatsiya"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="navbar__drawer-head">
          <Link
            href="/"
            className="navbar__logo"
            onClick={closeMenu}
          >
            <span className="navbar__logo-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M11 15h17v9a8.5 8.5 0 0 1-17 0v-9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M28 18h2.5a3.5 3.5 0 0 1 0 7H28"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 11c-1.5-2 1.5-3 0-5m6 5c-1.5-2 1.5-3 0-5m5 5c-1.5-2 1.5-3 0-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="navbar__logo-copy">
              <span className="navbar__logo-main">
                Coffee<span className="navbar__logo-accent">Fresh</span>
              </span>
              <span className="navbar__logo-caption">
                COFFEE · FOOD · MOMENTS
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="navbar__icon navbar__close"
            onClick={closeMenu}
            aria-label="Menyuni yopish"
          >
            <FiX size={23} aria-hidden="true" />
          </button>
        </div>

        <div className="navbar__drawer-content">
          <span className="navbar__drawer-eyebrow">
            COFFEE FRESH / NAVIGATION
          </span>

          <nav
            className="navbar__drawer-links"
            aria-label="Mobil menyu"
          >
            <Link href="/" onClick={closeMenu}>
              <span className="navbar__drawer-number">01</span>
              <span>Bosh sahifa</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>

            <Link href="/menu" onClick={closeMenu}>
              <span className="navbar__drawer-number">02</span>
              <span>Menyu</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>

            <Link href="/#contacts" onClick={closeMenu}>
              <span className="navbar__drawer-number">03</span>
              <span>Kontaktlar</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>

            <Link href="/#qr" onClick={closeMenu}>
              <span className="navbar__drawer-number">04</span>
              <span>QR menyu</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </nav>

          <div className="navbar__drawer-quote">
            <span className="navbar__drawer-quote-mark">“</span>
            <p>
              Good coffee.
              <br />
              Good food.
              <br />
              Good moments.
            </p>
          </div>
        </div>

        <div className="navbar__drawer-foot">
          <span className="navbar__drawer-eyebrow">
            BIZ BILAN BOG&apos;LANING
          </span>

          <a href="tel:+998918859999">
            <span className="navbar__social-icon">
              <FaPhoneAlt aria-hidden="true" />
            </span>
            <span>+998 91 885 99 99</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>

          <a
            href="https://t.me/coffeefreshbot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="navbar__social-icon">
              <FaTelegramPlane aria-hidden="true" />
            </span>
            <span>Telegram</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>

          <a
            href="https://www.instagram.com/coffee_fresh_restaurant/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="navbar__social-icon">
              <FaInstagram aria-hidden="true" />
            </span>
            <span>Instagram</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </aside>
    </header>
  );
}