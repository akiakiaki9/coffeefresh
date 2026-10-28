"use client";
import { useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './ProductModal.css';

export default function ProductModal({ item, onClose }) {
  const { addItem } = useCart();

  useBodyScrollLock(Boolean(item));

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  if (!item) return null;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || null,
    });
    onClose();
  };

  const subtitle = item.desc || item.categoryName || '';

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Yopish">
          <FiX size={22} />
        </button>
        <div className="modal__image-wrap">
          <img
            src={item.image || PLACEHOLDER_IMAGE}
            alt={item.name}
            className="modal__image"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
            decoding="async"
          />
        </div>
        <div className="modal__body">
          {item.categoryName && (
            <span className="modal__cat">{item.categoryName}</span>
          )}
          <h2 className="modal__title">{item.name}</h2>
          {subtitle && <p className="modal__desc">{subtitle}</p>}
          <div className="modal__footer">
            <span className="modal__price">
              {item.price.toLocaleString('ru-RU')} soʻm
            </span>
            <button className="modal__add" onClick={handleAdd}>
              <FiPlus size={18} /> Savatga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}