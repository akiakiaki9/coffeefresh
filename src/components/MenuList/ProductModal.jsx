"use client";
import { useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './ProductModal.css';

export default function ProductModal({ item, onClose }) {
    const { addItem } = useCart();

    // Блокируем скролл и закрываем по Esc
    useEffect(() => {
        document.body.classList.add('no-scroll');
        const onEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onEsc);
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onEsc);
        };
    }, [onClose]);

    if (!item) return null;

    const handleAdd = () => {
        addItem({ id: item.id, name: item.name, price: item.price });
        onClose();
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose} aria-label="Закрыть">
                    <FiX size={22} />
                </button>

                <div className="modal__image-wrap">
                    <img
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        className="modal__image"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                    />
                </div>

                <div className="modal__body">
                    <h2 className="modal__title">{item.name}</h2>
                    <p className="modal__desc">{item.desc}</p>
                    <div className="modal__footer">
                        <span className="modal__price">
                            {item.price.toLocaleString()} сум
                        </span>
                        <button className="modal__add" onClick={handleAdd}>
                            <FiPlus size={18} /> В корзину
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}