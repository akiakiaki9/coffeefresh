"use client";
import { FiPlus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './MenuCard.css';

export default function MenuCard({ item, onOpenModal }) {
    const { addItem } = useCart();

    const handleAdd = (e) => {
        e.stopPropagation(); // чтобы не открылась модалка
        addItem({ id: item.id, name: item.name, price: item.price });
    };

    return (
        <article className="menu-card">
            <div
                className="menu-card__image-wrap"
                onClick={() => onOpenModal(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenModal(item)}
            >
                <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="menu-card__image"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                    loading="lazy"
                />
            </div>
            <div className="menu-card__body">
                <h3 className="menu-card__name">{item.name}</h3>
                <p className="menu-card__desc">{item.desc}</p>
                <div className="menu-card__footer">
                    <span className="menu-card__price">
                        {item.price.toLocaleString()} сум
                    </span>
                    <button
                        className="menu-card__add"
                        onClick={handleAdd}
                        aria-label={`Добавить ${item.name} в корзину`}
                    >
                        <FiPlus size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}