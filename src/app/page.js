'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
    FaCoffee,
    FaMugHot,
    FaUtensils,
    FaArrowRight,
    FaArrowLeft,
    FaStar,
    FaPhone
} from 'react-icons/fa';
import { menuData } from '@/data/menuData';
import './page.css';
import Footer from '@/components/footer/Footer';

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const carouselRef = useRef(null);

    // Хиты для карусели (рекомендуемые блюда)
    const featuredItems = menuData.filter(item => item.isRecommended).slice(0, 8);

    // Автопрокрутка
    useEffect(() => {
        if (!isAutoPlay || featuredItems.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlay, featuredItems.length]);

    const nextSlide = () => {
        if (featuredItems.length === 0) return;
        setIsAutoPlay(false);
        setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    const prevSlide = () => {
        if (featuredItems.length === 0) return;
        setIsAutoPlay(false);
        setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    const goToSlide = (index) => {
        setIsAutoPlay(false);
        setCurrentSlide(index);
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    // Популярные категории
    const popularCategories = [
        { name: 'Кофе', icon: '', image: '/images/categories/coffee.png', link: '/menu?category=coffee' },
        { name: 'Пицца', icon: '', image: '/images/categories/pizza.png', link: '/menu?category=pizza' },
        { name: 'Вафли', icon: '', image: '/images/categories/vafli.png', link: '/menu?category=vafli' },
        { name: 'Десерты', icon: '', image: '/images/categories/desserts.png', link: '/menu?category=dessert' },
        { name: 'Fast-food', icon: '', image: '/images/categories/fast-food.png', link: '/menu?category=fastfood' },
        { name: 'Блюда', icon: '', image: '/images/categories/meats.png', link: '/menu?category=блюда' },
    ];

    return (
        <main>
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-bg-image"></div>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <div className="hero-badge">
                        <FaCoffee />
                        <span>Свежая обжарка 2026</span>
                    </div>
                    <h1 className="hero-title">
                        Кофе, который<br />
                        <span>вдохновляет</span>
                    </h1>
                    <p className="hero-subtitle">
                        Авторский кофе, свежие вафли и вкусный фастфуд — всё для твоего идеального дня
                    </p>
                    <div className="hero-buttons">
                        <Link href="/menu" className="hero-btn primary">
                            <FaMugHot />
                            Меню
                        </Link>
                        <Link href="/contacts" className="hero-btn secondary">
                            <FaPhone />
                            Контакты
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="stat-number">15+</span>
                            <span className="stat-label">Видов кофе</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="stat-number">5</span>
                            <span className="stat-label">★ Рейтинг</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Довольных клиентов</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== КАТЕГОРИИ ===== */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">🍽️ Меню</span>
                        <h2 className="section-title">Популярные категории</h2>
                        <p className="section-subtitle">Выберите свою любимую категорию и наслаждайтесь вкусом</p>
                    </div>
                    <div className="categories-grid">
                        {popularCategories.map((cat, index) => (
                            <Link href={cat.link} key={index} className="category-card-home">
                                <div className="category-card-home-image">
                                    <img
                                        src={cat.image || '/images/placeholder.png'}
                                        alt={cat.name}
                                        loading="lazy"
                                    />
                                    <div className="category-card-home-overlay">
                                        <span className="category-icon-big">{cat.icon}</span>
                                    </div>
                                </div>
                                <h3>{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== КАРУСЕЛЬ ХИТОВ ===== */}
            {featuredItems.length > 0 && (
                <section className="carousel-section">
                    <div className="container">
                        <div className="carousel-header">
                            <div>
                                <span className="carousel-badge">🔥 Хиты</span>
                                <h2 className="section-title">Наши лучшие блюда</h2>
                            </div>
                            <div className="carousel-controls">
                                <button onClick={prevSlide} className="carousel-btn" aria-label="Previous">
                                    <FaArrowLeft />
                                </button>
                                <button onClick={nextSlide} className="carousel-btn" aria-label="Next">
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>

                        <div className="carousel-wrapper" ref={carouselRef}>
                            <div
                                className="carousel-track"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {featuredItems.map((item) => (
                                    <div key={item.id} className="carousel-slide">
                                        <div className="carousel-card">
                                            <div className="carousel-image-wrapper">
                                                <img
                                                    src={item.image || '/images/placeholder.png'}
                                                    alt={item.name}
                                                    className="carousel-image"
                                                />
                                                <div className="carousel-rating">
                                                    <FaStar />
                                                    <span>4.8</span>
                                                </div>
                                                <div className="carousel-category-badge">
                                                    {item.category === 'coffee' && '☕ Кофе'}
                                                    {item.category === 'choy' && '🍵 Чай'}
                                                    {item.category === 'vafli' && '🧇 Вафли'}
                                                    {item.category === 'fastfood' && '🍔 Fast-food'}
                                                    {item.category === 'pizza' && '🍕 Пицца'}
                                                    {item.category === 'dessert' && '🍰 Десерт'}
                                                    {item.category === 'salat' && '🥗 Салат'}
                                                    {item.category === 'блюда' && '🍽️ Блюдо'}
                                                    {item.category === 'bubble_tea' && '🧋 Bubble Tea'}
                                                    {item.category === 'moxito' && '🍹 Мохито'}
                                                    {item.category === 'combo' && '📦 Combo'}
                                                </div>
                                            </div>
                                            <div className="carousel-card-body">
                                                <h3 className="carousel-card-title">{item.name}</h3>
                                                <p className="carousel-card-desc">{item.description}</p>
                                                <div className="carousel-card-footer">
                                                    <span className="carousel-card-price">{item.price} сум</span>
                                                    <Link href={`/menu/${item.id}`} className="carousel-card-link">
                                                        Подробнее
                                                        <FaArrowRight />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="carousel-dots">
                            {featuredItems.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== ПРЕИМУЩЕСТВА ===== */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">💫 Почему мы</span>
                        <h2 className="section-title">Наши преимущества</h2>
                        <p className="section-subtitle">Мы заботимся о каждом клиенте и каждом блюде</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">☕</div>
                            <h3>Свежая обжарка</h3>
                            <p>Зерна обжариваются в день приготовления для максимального аромата</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌱</div>
                            <h3>Натуральные ингредиенты</h3>
                            <p>Только качественные продукты без химии и искусственных добавок</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Быстрая подача</h3>
                            <p>Готовим за 5-10 минут, чтобы вы не тратили время на ожидание</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">❤️</div>
                            <h3>Любовь к делу</h3>
                            <p>Каждое блюдо готовим с душой и вниманием к деталям</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Доставка 24/7</h3>
                            <p>Мы работаем круглосуточно, чтобы вы могли наслаждаться вкусом в любое время</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Лучшая кофейня</h3>
                            <p>Первая кофейня в Гиждуване с профессиональным подходом</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA БЛОК ===== */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-text">
                            <span className="cta-badge">🛵 Доставка</span>
                            <h2>Закажите доставку прямо сейчас</h2>
                            <p>Мы привезем ваш заказ в течение 30-40 минут. Свежие блюда и горячий кофе — у вас дома!</p>
                        </div>
                        <div className="cta-buttons">
                            <Link href="/menu" className="cta-btn primary">
                                <FaUtensils />
                                Сделать заказ
                            </Link>
                            <a href="tel:+998905003500" className="cta-btn secondary">
                                <FaPhone />
                                +998 90 500 35 00
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}