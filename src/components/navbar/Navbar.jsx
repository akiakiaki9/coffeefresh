'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaInstagram, FaTelegramPlane, FaPhone } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import './navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { getItemCount, isClient } = useCart();

    return (
        <nav className="navbar">
            <div className="navbar-bg">
                <div className="container navbar-container">
                    <Link href="/" className="navbar-logo">
                        <Image
                            src="/images/hero.png"
                            alt="Coffee Fresh"
                            width={40}
                            height={40}
                            className="logo-image"
                            priority
                        />
                        <span className="logo-text">Coffee Fresh</span>
                    </Link>

                    {/* Десктопное меню */}
                    <div className="navbar-links">
                        <Link href="/">Главная</Link>
                        <Link href="/menu">Меню</Link>
                        <Link href="/contacts">Контакты</Link>
                        <Link href="/cart" className="cart-link">
                            <FaShoppingCart />
                            {isClient && getItemCount() > 0 && (
                                <span className="cart-badge">{getItemCount()}</span>
                            )}
                        </Link>
                        <div className="social-icons">
                            <a href="https://www.instagram.com/coffee_fresh___/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="https://t.me/coffeefresh_bot" target="_blank" rel="noopener noreferrer">
                                <FaTelegramPlane />
                            </a>
                            <a href="tel:+998905003500" target="_blank" rel="noopener noreferrer">
                                <FaPhone />
                            </a>
                        </div>
                    </div>

                    {/* Мобильное меню */}
                    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                        <button className="mobile-close" onClick={() => setIsOpen(false)}>
                            <FaTimes />
                        </button>
                        <div className="mobile-links">
                            <Link href="/" onClick={() => setIsOpen(false)}>Главная</Link>
                            <Link href="/menu" onClick={() => setIsOpen(false)}>Меню</Link>
                            <Link href="/contacts" onClick={() => setIsOpen(false)}>Контакты</Link>
                            <Link href="/cart" className="mobile-cart" onClick={() => setIsOpen(false)}>
                                <FaShoppingCart />
                                Корзина
                                {isClient && getItemCount() > 0 && (
                                    <span className="cart-badge">{getItemCount()}</span>
                                )}
                            </Link>
                            <div className="mobile-social">
                                <a href="https://www.instagram.com/coffee_fresh___/" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram />
                                </a>
                                <a href="https://t.me/coffeefresh_bot" target="_blank" rel="noopener noreferrer">
                                    <FaTelegramPlane />
                                </a>
                                <a href="tel:+998905003500" target="_blank" rel="noopener noreferrer">
                                    <FaPhone />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка бургер */}
                    <button className="burger-btn" onClick={() => setIsOpen(true)}>
                        <FaBars />
                    </button>
                </div>
            </div>
        </nav>
    );
}