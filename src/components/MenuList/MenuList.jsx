"use client";
import { useState } from 'react';
import { CATEGORIES, MENU } from '@/data/menu';
import MenuCard from './MenuCard';
import ProductModal from './ProductModal';
import './MenuList.css';

export default function MenuList() {
    const [activeCat, setActiveCat] = useState('all');
    const [activeItem, setActiveItem] = useState(null);

    const filtered =
        activeCat === 'all' ? MENU : MENU.filter((m) => m.category === activeCat);

    return (
        <>
            <div className="menu-tabs">
                <button
                    className={`menu-tabs__btn ${activeCat === 'all' ? 'menu-tabs__btn--active' : ''}`}
                    onClick={() => setActiveCat('all')}
                >
                    Всё меню
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`menu-tabs__btn ${activeCat === cat.id ? 'menu-tabs__btn--active' : ''}`}
                        onClick={() => setActiveCat(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="menu-list">
                {filtered.map((item) => (
                    <MenuCard key={item.id} item={item} onOpenModal={setActiveItem} />
                ))}
            </div>

            {activeItem && (
                <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />
            )}
        </>
    );
}