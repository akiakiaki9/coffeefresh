"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import MenuList from "@/components/MenuList/MenuList";
import Contacts from "@/components/Contacts/Contacts";
import QRBlock from "@/components/QRBlock/QRBlock";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import OrderHistoryDrawer from "@/components/OrderHistory/OrderHistoryDrawer";
import OrderResultModal from "@/components/OrderResultModal/OrderResultModal";
import Footer from "@/components/Footer/Footer";
import Reveal from "@/components/Reveal/Reveal";
import FloatingCart from "@/components/FloatingCart/FloatingCart";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import "./page.css";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <>
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onHistoryOpen={() => setIsHistoryOpen(true)}
      />

      <main className="home-page">
        <Hero />

        <section className="section home-menu" id="popular-menu">
          <div className="container">
            <Reveal className="home-menu__head">
              <div className="home-menu__heading">
                <span className="eyebrow">
                  Bizning menyu
                </span>

                <h2 className="home-menu__title">
                  Yaxshi kunlar
                  <br />
                  <em>yaxshi ta'mdan</em>
                  <span className="home-menu__period">.</span>
                </h2>
              </div>

              <div className="home-menu__intro">
                <span className="home-menu__intro-mark">
                  CF / 01
                </span>

                <p className="home-menu__subtitle">
                  Har bir piyolada iliqlik, har bir taomda
                  e'tibor. O'zingizga yoqqan ta'mni tanlang
                  va Coffee Fresh lahzalaridan zavqlaning.
                </p>

                <a
                  href="/menu"
                  className="home-menu__all"
                >
                  <span>To'liq menyu</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            <div className="home-menu__divider">
              <span>FRESHLY PREPARED</span>
              <span className="home-menu__divider-line" />
              <span>MADE WITH CARE</span>
            </div>

            <MenuList />

            <Reveal className="home-menu__bottom">
              <span className="home-menu__bottom-note">
                <span className="home-menu__status-dot" />
                Har kuni siz uchun yangi tayyorlanadi
              </span>

              <a
                href="/menu"
                className="home-menu__bottom-link"
              >
                Barcha taomlarni ko'rish
                <FiArrowDownRight aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </section>

        <Contacts />
        <QRBlock />
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

      <OrderResultModal
        result={result}
        onClose={() => setResult(null)}
      />

      <FloatingCart
        isCartOpen={isCartOpen}
        onCartOpen={() => setIsCartOpen(true)}
      />
    </>
  );
}