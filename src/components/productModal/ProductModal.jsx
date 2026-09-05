// components/ProductModal/ProductModal.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaTimes, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import './productModal.css';

export default function ProductModal({ item, onClose }) {
    const { addToCart, isClient } = useCart();
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const [isAdded, setIsAdded] = useState(false);

    // Закрытие по Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Блокировка скролла
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
        
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        };
    }, []);

    const handleAddToCart = () => {
        addToCart(item);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    const categoryLabels = {
        coffee: '☕ Кофе',
        waffles: '🧇 Вафли',
        fastfood: '🍔 Fast-food',
        choy: '🍵 Чай',
        блюда: '🍽️ Блюда',
        pizza: '🍕 Пицца',
        salat: '🥗 Салаты',
        dessert: '🍰 Десерты',
        vafli: '🧇 Вафли',
        bubble_tea: '🧋 Bubble Tea',
        moxito: '🍹 Мохито',
        combo: '📦 Combo Set'
    };

    if (!item) return null;

    return (
        <div 
            className="modal-overlay" 
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modal-container" ref={modalRef}>
                <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                    <FaTimes />
                </button>

                <div className="modal-grid">
                    <div className="modal-image-wrapper">
                        <img 
                            src={item.image || '/images/placeholder.png'} 
                            alt={item.name} 
                            className="modal-image"
                            onError={(e) => {
                                e.target.src = '/images/placeholder.png';
                            }}
                        />
                        {item.isRecommended && (
                            <span className="modal-badge">🔥 Хит</span>
                        )}
                    </div>

                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-category">
                                {categoryLabels[item.category] || item.category || 'Блюдо'}
                            </span>
                            <h2 id="modal-title" className="modal-title">{item.name}</h2>
                        </div>

                        <p className="modal-description">{item.description || 'Вкусное блюдо из натуральных ингредиентов.'}</p>

                        {item.ingredients && (
                            <div className="modal-ingredients">
                                <h4>📋 Ингредиенты</h4>
                                <p>{item.ingredients}</p>
                            </div>
                        )}

                        <div className="modal-price-wrapper">
                            <span className="modal-price">{item.price} <span className="currency">сум</span></span>
                            <button
                                onClick={handleAddToCart}
                                className={`modal-add-btn ${isAdded ? 'added' : ''}`}
                            >
                                {isAdded ? <FaCheck /> : <FaShoppingCart />}
                                {isAdded ? 'Добавлено!' : 'В корзину'}
                            </button>
                        </div>

                        <div className="modal-actions">
                            <Link href={`/menu/${item.id}`} className="modal-detail-link">
                                Подробнее о блюде →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}