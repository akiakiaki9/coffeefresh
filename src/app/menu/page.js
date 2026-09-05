'use client';
import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { menuData } from '@/data/menuData';
import { FaPlus, FaCheck, FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import ProductModal from '@/components/ProductModal/ProductModal';
import './page.css';

// Создаем отдельный компонент с useSearchParams
function MenuContent() {
    const searchParams = useSearchParams();
    const [category, setCategory] = useState('all');
    const [added, setAdded] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart, isClient } = useCart();
    const categoryScrollRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Читаем категорию из URL при загрузке
    useEffect(() => {
        if (!isInitialized) {
            const categoryParam = searchParams.get('category');
            if (categoryParam) {
                const categories = ['all', ...new Set(menuData.map(item => item.category))];
                if (categories.includes(categoryParam)) {
                    setCategory(categoryParam);
                }
            }
            setIsInitialized(true);
        }
    }, [searchParams, isInitialized]);

    // Обновляем URL при изменении категории
    useEffect(() => {
        if (isInitialized) {
            const url = new URL(window.location.href);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.replaceState({}, '', url.toString());
        }
    }, [category, isInitialized]);

    const categories = ['all', ...new Set(menuData.map(item => item.category))];

    const categoryData = {
        all: {
            label: 'Все',
            icon: '🍽️',
            image: '/images/categories/all.jpg',
            color: 'linear-gradient(135deg, #F59C10, #F70525)'
        },
        choy: {
            label: 'Чай',
            icon: '🍵',
            image: '/images/categories/tea.png',
            color: 'linear-gradient(135deg, #2D5016, #5B8C3E)'
        },
        coffee: {
            label: 'Кофе',
            icon: '☕',
            image: '/images/categories/coffee.png',
            color: 'linear-gradient(135deg, #6F4E37, #A67B5B)'
        },
        блюда: {
            label: 'Блюда',
            icon: '🍽️',
            image: '/images/categories/meats.png',
            color: 'linear-gradient(135deg, #8B4513, #CD853F)'
        },
        fastfood: {
            label: 'Fast-food',
            icon: '🍔',
            image: '/images/categories/fast-food.png',
            color: 'linear-gradient(135deg, #E76F51, #F4A261)'
        },
        pizza: {
            label: 'Пицца',
            icon: '🍕',
            image: '/images/categories/pizza.png',
            color: 'linear-gradient(135deg, #C0392B, #E74C3C)'
        },
        salat: {
            label: 'Салаты',
            icon: '🥗',
            image: '/images/categories/salad.png',
            color: 'linear-gradient(135deg, #27AE60, #2ECC71)'
        },
        dessert: {
            label: 'Десерты',
            icon: '🍰',
            image: '/images/categories/desserts.png',
            color: 'linear-gradient(135deg, #E91E63, #F06292)'
        },
        vafli: {
            label: 'Вафли',
            icon: '🧇',
            image: '/images/categories/vafli.png',
            color: 'linear-gradient(135deg, #D4A373, #E9C46A)'
        },
        bubble_tea: {
            label: 'Bubble Tea',
            icon: '🧋',
            image: '/images/categories/bubble.png',
            color: 'linear-gradient(135deg, #9B59B6, #AF7AC5)'
        },
        moxito: {
            label: 'Мохито',
            icon: '🍹',
            image: '/images/categories/moxito.png',
            color: 'linear-gradient(135deg, #1ABC9C, #48C9B0)'
        },
        combo: {
            label: 'Combo Set',
            icon: '📦',
            image: '/images/categories/combo.png',
            color: 'linear-gradient(135deg, #F39C12, #F1C40F)'
        }
    };

    const filtered = useMemo(() => {
        let result = category === 'all' ? menuData : menuData.filter(item => item.category === category);
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }
        return result;
    }, [category, searchQuery]);

    const handleAddToCart = (item, e) => {
        e.stopPropagation();
        addToCart(item);
        setAdded(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1000);
    };

    const handleImageClick = (item) => {
        setSelectedProduct(item);
    };

    const scrollCategories = (direction) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 300;
            const currentScroll = categoryScrollRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            categoryScrollRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (!isClient) {
        return (
            <div className="menu-page">
                <div className="menu-loading">
                    <div className="menu-loading-spinner"></div>
                    <p>Загрузка меню...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="menu-page">
            {/* ===== HERO С ФОНОМ ===== */}
            <section className="menu-hero">
                <div className="menu-hero-bg"></div>
                <div className="container menu-hero-content">
                    <div className="menu-hero-badge">
                        <span className="badge-dot"></span>
                        Наше меню
                    </div>
                    <h1 className="menu-hero-title">
                        Выберите свой <span>идеальный</span> вкус
                    </h1>
                    <p className="menu-hero-subtitle">
                        Свежая обжарка, натуральные ингредиенты и авторские рецепты —
                        всё для вашего идеального дня
                    </p>
                </div>
            </section>

            {/* ===== ПОИСК ===== */}
            <div className="menu-controls">
                <div className="container">
                    <div className="menu-controls-wrapper">
                        <div className="menu-search-wrapper">
                            <div className="menu-search">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Поиск по меню..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button
                                        className="search-clear"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== КАТЕГОРИИ КАРУСЕЛЬ ===== */}
            <div className="categories-section">
                <div className="container">
                    <div className="categories-header">
                        <h2 className="categories-title">Категории</h2>
                        <div className="categories-nav desktop-only">
                            <button
                                className="categories-nav-btn"
                                onClick={() => scrollCategories('left')}
                                aria-label="Предыдущие категории"
                            >
                                <FaArrowLeft />
                            </button>
                            <button
                                className="categories-nav-btn"
                                onClick={() => scrollCategories('right')}
                                aria-label="Следующие категории"
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="categories-wrapper">
                        <div className="categories-scroll" ref={categoryScrollRef}>
                            {categories.map((cat) => {
                                const data = categoryData[cat];
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`category-card ${category === cat ? 'active' : ''}`}
                                    >
                                        <div
                                            className="category-image-wrapper"
                                            style={{ background: data?.color || '#666' }}
                                        >
                                            <img
                                                src={data?.image || '/images/placeholder.png'}
                                                alt={data?.label || cat}
                                                className="category-image"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.png';
                                                }}
                                            />
                                            {category === cat && (
                                                <div className="category-active-overlay">
                                                    <span>✓</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="category-label">{data?.label || cat}</span>
                                        {category === cat && (
                                            <span className="category-count">{filtered.length}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== КОНТЕНТ ===== */}
            <div className="menu-content">
                <div className="container">
                    {filtered.length === 0 ? (
                        <div className="menu-empty">
                            <span className="menu-empty-icon">🔍</span>
                            <h3>Ничего не найдено</h3>
                            <p>Попробуйте изменить поисковый запрос или выберите другую категорию</p>
                            <button
                                className="menu-empty-btn"
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategory('all');
                                }}
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="menu-results-count">
                                Найдено <span>{filtered.length}</span> {filtered.length === 1 ? 'блюдо' : 'блюд'}
                            </div>
                            <div className="menu-grid">
                                {filtered.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="menu-item"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div
                                            className="menu-item-image-wrapper"
                                            onClick={() => handleImageClick(item)}
                                        >
                                            <img
                                                src={item.image || '/images/placeholder.png'}
                                                alt={item.name}
                                                className="menu-item-image"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.png';
                                                }}
                                            />
                                            <div className="menu-item-overlay">
                                                <div className="menu-item-overlay-content">
                                                    <FaSearch className="overlay-icon" />
                                                    <span>Быстрый просмотр</span>
                                                </div>
                                            </div>
                                            {item.isRecommended && (
                                                <span className="menu-item-badge">🔥 Хит</span>
                                            )}
                                        </div>
                                        <div className="menu-item-body">
                                            <div className="menu-item-top">
                                                <Link href={`/menu/${item.id}`} className="menu-item-title">
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <p className="menu-item-desc">{item.description}</p>
                                            <div className="menu-item-footer">
                                                <span className="menu-item-price">{item.price} <span className="currency">сум</span></span>
                                                <button
                                                    onClick={(e) => handleAddToCart(item, e)}
                                                    className={`menu-item-add ${added[item.id] ? 'added' : ''}`}
                                                    aria-label="Добавить в корзину"
                                                >
                                                    {added[item.id] ? <FaCheck /> : <FaPlus />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <ProductModal
                    item={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

// Главный компонент с Suspense
export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="menu-page">
                <div className="menu-loading">
                    <div className="menu-loading-spinner"></div>
                    <p>Загрузка меню...</p>
                </div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}