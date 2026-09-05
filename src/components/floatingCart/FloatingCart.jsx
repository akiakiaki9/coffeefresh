'use client';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import './floatingCart.css';

export default function FloatingCart() {
    const { getItemCount, isClient, cart } = useCart();

    if (!isClient || cart.length === 0) {
        return null;
    }

    return (
        <Link href="/cart" className="floating-cart">
            <FaShoppingCart className="floating-cart-icon" />
            <span className="floating-cart-count">{getItemCount()}</span>
            <div className="floating-cart-tooltip">
                Перейти в корзину
            </div>
        </Link>
    );
}