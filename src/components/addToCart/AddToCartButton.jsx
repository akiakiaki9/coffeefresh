'use client';
import { useState } from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import './addToCartButton.css';

export default function AddToCartButton({ item }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <button onClick={handleAddToCart} className={`add-to-cart-btn ${added ? 'added' : ''}`}>
            {added ? <><FaCheck /> В корзине</> : <><FaPlus /> Добавить в корзину</>}
        </button>
    );
}