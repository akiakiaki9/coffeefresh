"use client";
import { FiPlus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './MenuCard.css';

export default function MenuCard({ item, onOpenModal }) {
    const { addItem } = useCart();

    const handleAdd = (e) => {
        e.stopPropagation();
        addItem({ id: item.id, name: item.name, price: item.price, image: item.image || null });
    };

    return (
        <article className="menu-card">
            <button
                className="menu-card__image-wrap"
                onClick={() => onOpenModal(item)}
                aria-label={`${item.name} — batafsil`}
            >
                <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="menu-card__image"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                    loading="lazy"
                    decoding="async"
                />
            </button>
            <div className="menu-card__body">
                <h3 className="menu-card__name">{item.name}</h3>
                <p className="menu-card__desc">{item.desc}</p>
                <div className="menu-card__footer">
                    <span className="menu-card__price">{item.price.toLocaleString()} <em>soʻm</em></span>
                    <button
                        type="button"
                        className="menu-card__add"
                        onClick={handleAdd}
                        aria-label={`${item.name} savatga`}
                    >
                        <FiPlus size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}