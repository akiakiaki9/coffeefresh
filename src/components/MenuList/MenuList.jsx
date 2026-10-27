"use client";
import { useRef, useState } from 'react';
import { CATEGORIES, MENU } from '@/data/menu';
import MenuCard from './MenuCard';
import Reveal from '@/components/Reveal/Reveal';
import './MenuList.css';
import ProductModal from './ProductModal';

export default function MenuList() {
    const [activeCat, setActiveCat] = useState('all');
    const [activeItem, setActiveItem] = useState(null);
    const carouselRef = useRef(null);
    const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0 });

    const filtered = activeCat === 'all' ? MENU : MENU.filter((m) => m.category === activeCat);
    const tabs = [{ id: 'all', name: 'Hammasi' }, ...CATEGORIES];

    const onMouseDown = (e) => {
        dragRef.current = {
            down: true,
            startX: e.pageX - carouselRef.current.offsetLeft,
            scrollLeft: carouselRef.current.scrollLeft,
        };
    };
    const onMouseLeave = () => (dragRef.current.down = false);
    const onMouseUp = () => (dragRef.current.down = false);
    const onMouseMove = (e) => {
        if (!dragRef.current.down) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - dragRef.current.startX) * 1.4;
        carouselRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
    };

    return (
        <>
            <div className="menu-tabs-wrap">
                <div
                    className="menu-tabs"
                    ref={carouselRef}
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    role="tablist"
                >
                    {tabs.map((cat) => (
                        <button
                            key={cat.id}
                            role="tab"
                            aria-selected={activeCat === cat.id}
                            className={`menu-tabs__btn ${activeCat === cat.id ? 'is-active' : ''}`}
                            onClick={() => setActiveCat(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="menu-list">
                {filtered.map((item, i) => (
                    <Reveal key={item.id} delay={(i % 4) + 1}>
                        <MenuCard item={item} onOpenModal={setActiveItem} />
                    </Reveal>
                ))}
            </div>

            {activeItem && <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />}
        </>
    );
}