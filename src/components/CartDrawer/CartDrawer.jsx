"use client";
import { useEffect, useState } from 'react';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './CartDrawer.css';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer({ isOpen, onClose, onResult }) {
    const { items, removeItem, updateQuantity, total } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        const onEsc = (e) => {
            if (e.key === 'Escape' && !checkoutOpen) onClose();
        };
        window.addEventListener('keydown', onEsc);
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onEsc);
        };
    }, [isOpen, checkoutOpen, onClose]);

    return (
        <>
            <div className={`cart ${isOpen ? 'cart--open' : ''}`}>
                <div className="cart__overlay" onClick={onClose} />
                <aside className="cart__panel">
                    <div className="cart__header">
                        <h2>
                            <FiShoppingBag size={22} /> Корзина
                        </h2>
                        <button onClick={onClose} aria-label="Закрыть">
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="cart__body">
                        {items.length === 0 && (
                            <div className="cart__empty">
                                <p>🛒 Корзина пуста</p>
                                <span>Добавьте блюда из меню</span>
                            </div>
                        )}

                        {items.map((item) => (
                            <div key={item.id} className="cart__item">
                                <img
                                    src={item.image || PLACEHOLDER_IMAGE}
                                    alt={item.name}
                                    className="cart__item-image"
                                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                                />
                                <div className="cart__item-info">
                                    <p className="cart__item-name">{item.name}</p>
                                    <p className="cart__item-price">
                                        {item.price.toLocaleString()} сум
                                    </p>
                                    <div className="cart__item-actions">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="cart__item-right">
                                    <p className="cart__item-sum">
                                        {(item.price * item.quantity).toLocaleString()} сум
                                    </p>
                                    <button
                                        className="cart__remove"
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Удалить"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {items.length > 0 && (
                        <div className="cart__footer">
                            <div className="cart__total">
                                <span>Итого:</span>
                                <span>{total.toLocaleString()} сум</span>
                            </div>
                            <button
                                className="cart__submit"
                                onClick={() => setCheckoutOpen(true)}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    )}
                </aside>
            </div>

            <CheckoutModal
                isOpen={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                onResult={(r) => {
                    setCheckoutOpen(false);
                    onClose();
                    onResult?.(r);
                }}
            />
        </>
    );
}