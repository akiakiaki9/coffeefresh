"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '@/data/menu';
import MenuCard from './MenuCard';
import ProductModal from './ProductModal';
import './MenuList.css';

export default function MenuList() {
    const [activeCat, setActiveCat] = useState('all');
    const [activeTabCat, setActiveTabCat] = useState('all');
    const [activeItem, setActiveItem] = useState(null);
    const [scrollRequest, setScrollRequest] = useState(0);
    const carouselRef = useRef(null);
    const tabRefs = useRef(new Map());
    const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0 });

    // Плоский список для «Hammasi» + пометка категории у каждого блюда
    const items = useMemo(() => {
        if (activeCat === 'all') {
            return CATEGORIES.flatMap((c) =>
                c.items.map((it) => ({
                    ...it,
                    categoryId: c.id,
                    categoryName: c.name,
                }))
            );
        }
        const cat = CATEGORIES.find((c) => c.id === activeCat);
        return cat
            ? cat.items.map((it) => ({
                ...it,
                categoryId: cat.id,
                categoryName: cat.name,
            }))
            : [];
    }, [activeCat]);

    const tabs = useMemo(
        () => [
            { id: 'all', name: 'Hammasi' },
            ...CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
        ],
        []
    );

    const scrollActiveTabIntoView = useCallback((categoryId) => {
        const carousel = carouselRef.current;
        const tab = tabRefs.current.get(categoryId);
        if (!carousel || !tab) return;

        const carouselBounds = carousel.getBoundingClientRect();
        const tabBounds = tab.getBoundingClientRect();
        const inset = 18;

        if (tabBounds.left < carouselBounds.left + inset) {
            carousel.scrollBy({
                left: tabBounds.left - carouselBounds.left - inset,
                behavior: 'smooth',
            });
        } else if (tabBounds.right > carouselBounds.right - inset) {
            carousel.scrollBy({
                left: tabBounds.right - carouselBounds.right + inset,
                behavior: 'smooth',
            });
        }
    }, []);

    useEffect(() => {
        scrollActiveTabIntoView(activeTabCat);
    }, [activeTabCat, scrollActiveTabIntoView]);

    useEffect(() => {
        if (scrollRequest === 0) return;

        const frame = window.requestAnimationFrame(() => {
            const firstCard = document.querySelector('.menu-list .menu-card');
            if (!firstCard) return;

            const top = window.scrollY + firstCard.getBoundingClientRect().top - 88;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [activeCat, items, scrollRequest]);

    useEffect(() => {
        if (activeCat !== 'all') return undefined;

        let frame = 0;
        const updateVisibleCategory = () => {
            if (frame) return;

            frame = window.requestAnimationFrame(() => {
                frame = 0;
                const tabsBottom = carouselRef.current?.getBoundingClientRect().bottom ?? 0;
                const cards = Array.from(document.querySelectorAll('.menu-list .menu-card'));
                const currentRow = cards
                    .map((card) => ({
                        card,
                        bounds: card.getBoundingClientRect(),
                    }))
                    .filter(({ bounds }) => bounds.bottom > tabsBottom + 8)
                    .sort((a, b) => a.bounds.top - b.bounds.top || a.bounds.left - b.bounds.left)[0];
                const categoryId = currentRow?.card.dataset.categoryId;

                if (categoryId) setActiveTabCat(categoryId);
            });
        };

        updateVisibleCategory();
        window.addEventListener('scroll', updateVisibleCategory, { passive: true });
        window.addEventListener('resize', updateVisibleCategory);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', updateVisibleCategory);
            window.removeEventListener('resize', updateVisibleCategory);
        };
    }, [activeCat, items]);

    const selectCategory = (categoryId) => {
        setActiveCat(categoryId);
        setActiveTabCat(categoryId);
        setScrollRequest((request) => request + 1);
    };

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
                            ref={(element) => {
                                if (element) tabRefs.current.set(cat.id, element);
                                else tabRefs.current.delete(cat.id);
                            }}
                            data-category-id={cat.id}
                            role="tab"
                            aria-selected={activeTabCat === cat.id}
                            className={`menu-tabs__btn ${activeTabCat === cat.id ? 'is-active' : ''}`}
                            onClick={() => selectCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="menu-list">
                {items.map((item) => (
                    <MenuCard key={item.id} item={item} onOpenModal={setActiveItem} />
                ))}
            </div>

            {activeItem && (
                <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />
            )}
        </>
    );
}