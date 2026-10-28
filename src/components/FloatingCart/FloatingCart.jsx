"use client";

import { FiArrowUpRight } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import './FloatingCart.css';

export default function FloatingCart({ isCartOpen, onCartOpen }) {
    const { items } = useCart();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    if (count === 0 || isCartOpen) return null;

    return (
        <button
            type="button"
            className="floating-cart"
            onClick={onCartOpen}
            aria-label={`Savatni ochish. ${count} ta mahsulot`}
        >
            <span className="floating-cart__icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="10" cy="20" r="1" fill="currentColor" />
                    <circle cx="18" cy="20" r="1" fill="currentColor" />
                </svg>
            </span>

            <span className="floating-cart__label">
                <span className="floating-cart__caption">Sizning buyurtmangiz</span>
                <span className="floating-cart__count">
                    Savat <span>({count})</span>
                </span>
            </span>

            <span className="floating-cart__arrow">
                <FiArrowUpRight aria-hidden="true" />
            </span>
        </button>
    );
}
