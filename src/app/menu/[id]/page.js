// app/menu/[id]/page.js
import { menuData } from '@/data/menuData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { 
    FaCoffee, 
    FaUtensils, 
    FaIceCream, 
    FaArrowRight, 
    FaStar, 
    FaClock, 
    FaShoppingCart,
    FaMugHot,
    FaPizzaSlice,
    FaLeaf,
    FaHeart
} from 'react-icons/fa';
import AddToCartButton from '@/components/addToCart/AddToCartButton';
import './page.css';

// Генерация статических путей
export async function generateStaticParams() {
    return menuData.map((item) => ({
        id: String(item.id),
    }));
}

// Метаданные для SEO
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const item = menuData.find(i => i.id === parseInt(resolvedParams.id));
    
    if (!item) {
        return {
            title: 'Товар не найден | Coffee Fresh',
            description: 'Извините, данный товар временно недоступен.',
        };
    }

    const categoryNames = {
        choy: 'чай',
        coffee: 'кофе',
        блюда: 'блюда',
        fastfood: 'фастфуд',
        pizza: 'пицца',
        salat: 'салаты',
        dessert: 'десерты',
        vafli: 'вафли',
        bubble_tea: 'бабл ти',
        moxito: 'мохито',
        combo: 'комбо набор'
    };

    const categoryName = categoryNames[item.category] || item.category;
    const siteName = 'Coffee Fresh - Первая кофейня в Гиждуване';

    return {
        title: `${item.name} — ${categoryName} в Coffee Fresh | Гиждуван`,
        description: `${item.description} Закажите ${item.name.toLowerCase()} в Coffee Fresh с доставкой по Гиждувану. ${item.ingredients ? `Состав: ${item.ingredients}.` : ''}`,
        keywords: `${item.name}, ${categoryName}, кофейня Гиждуван, Coffee Fresh, доставка еды, ${item.category}`,
        openGraph: {
            title: `${item.name} — ${categoryName} в Coffee Fresh`,
            description: item.description,
            images: [item.image || '/images/hero.png'],
            type: 'website',
            siteName: siteName,
            url: `https://coffeefresh.uz/menu/${item.id}`,
            locale: 'ru_RU',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${item.name} — ${categoryName} в Coffee Fresh`,
            description: item.description,
            images: [item.image || '/images/hero.png'],
        },
        alternates: {
            canonical: `https://coffeefresh.uz/menu/${item.id}`,
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
        },
        applicationName: 'Coffee Fresh',
        authors: [{ name: 'Coffee Fresh' }],
        category: categoryName,
    };
}

export default async function MenuItemPage({ params }) {
    const resolvedParams = await params;
    const item = menuData.find(i => i.id === parseInt(resolvedParams.id));
    
    if (!item) {
        return notFound();
    }

    const recommended = menuData
        .filter(i => i.id !== item.id && (i.category === item.category || i.isRecommended))
        .slice(0, 4);

    const categoryLabels = {
        choy: { label: 'Чай', icon: <FaMugHot />, color: '#2D5016' },
        coffee: { label: 'Кофе', icon: <FaCoffee />, color: '#6F4E37' },
        блюда: { label: 'Блюда', icon: <FaUtensils />, color: '#8B4513' },
        fastfood: { label: 'Fast-food', icon: <FaUtensils />, color: '#E76F51' },
        pizza: { label: 'Пицца', icon: <FaPizzaSlice />, color: '#C0392B' },
        salat: { label: 'Салаты', icon: <FaLeaf />, color: '#27AE60' },
        dessert: { label: 'Десерты', icon: <FaHeart />, color: '#E91E63' },
        vafli: { label: 'Вафли', icon: <FaIceCream />, color: '#D4A373' },
        bubble_tea: { label: 'Bubble Tea', icon: <FaMugHot />, color: '#9B59B6' },
        moxito: { label: 'Мохито', icon: <FaMugHot />, color: '#1ABC9C' },
        combo: { label: 'Combo Set', icon: <FaShoppingCart />, color: '#F39C12' }
    };

    const categoryInfo = categoryLabels[item.category] || { 
        label: item.category, 
        icon: null, 
        color: '#666' 
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: item.name,
        description: item.description,
        image: item.image || '/images/hero.png',
        category: categoryInfo.label,
        offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'UZS',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Coffee Fresh'
            }
        },
        brand: {
            '@type': 'Brand',
            name: 'Coffee Fresh'
        }
    };

    const imageSrc = item.image || '/images/hero.png';

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="detail-page">
                <div className="container">
                    <nav className="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
                        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <Link href="/" itemProp="item">
                                <span itemProp="name">Главная</span>
                            </Link>
                            <meta itemProp="position" content="1" />
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <Link href="/menu" itemProp="item">
                                <span itemProp="name">Меню</span>
                            </Link>
                            <meta itemProp="position" content="2" />
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span itemProp="name" className="breadcrumb-current">{item.name}</span>
                            <meta itemProp="position" content="3" />
                        </span>
                    </nav>

                    <div className="detail-grid">
                        <div className="detail-image-wrapper">
                            <img 
                                src={imageSrc}
                                alt={item.name} 
                                className="detail-image"
                                loading="eager"
                                width="600"
                                height="450"
                            />
                            {item.isRecommended && (
                                <div className="detail-badge">
                                    <FaStar />
                                    <span>Хит</span>
                                </div>
                            )}
                            <div className="detail-category-badge" style={{ background: categoryInfo.color }}>
                                {categoryInfo.icon}
                                <span>{categoryInfo.label}</span>
                            </div>
                        </div>

                        <div className="detail-info">
                            <div className="detail-header">
                                <h1 className="detail-name">{item.name}</h1>
                                <div className="detail-rating">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <span className="rating-value">4.8</span>
                                </div>
                            </div>

                            <p className="detail-desc">{item.description}</p>

                            {item.ingredients && (
                                <div className="detail-ingredients">
                                    <h4>📋 Ингредиенты</h4>
                                    <p>{item.ingredients}</p>
                                </div>
                            )}

                            <div className="detail-meta">
                                <div className="detail-meta-item">
                                    <span className="meta-icon">⏱️</span>
                                    <span className="meta-text">Готовка: 10-15 мин</span>
                                </div>
                                <div className="detail-meta-item">
                                    <span className="meta-icon">🔥</span>
                                    <span className="meta-text">Калории: ~250 ккал</span>
                                </div>
                            </div>

                            <div className="detail-tags">
                                <span className="detail-tag" style={{ background: categoryInfo.color + '20', color: categoryInfo.color }}>
                                    {categoryInfo.icon} {categoryInfo.label}
                                </span>
                                {item.isRecommended && (
                                    <span className="detail-tag" style={{ background: 'rgba(247, 5, 37, 0.1)', color: '#F70525' }}>
                                        <FaStar /> Рекомендуем
                                    </span>
                                )}
                                <span className="detail-tag" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                                    🌿 Натуральное
                                </span>
                            </div>

                            <div className="detail-price-wrapper">
                                <span className="detail-price">{item.price} <span className="currency">сум</span></span>
                                <AddToCartButton item={item} />
                            </div>
                        </div>
                    </div>

                    {recommended.length > 0 && (
                        <section className="recommended-section">
                            <div className="recommended-header">
                                <h2 className="section-title">Похожие блюда</h2>
                                <Link href="/menu" className="recommended-view-all">
                                    Все меню
                                    <FaArrowRight />
                                </Link>
                            </div>
                            <div className="recommended-grid">
                                {recommended.map(rec => {
                                    const recImageSrc = rec.image || '/images/hero.png';
                                    return (
                                        <Link 
                                            href={`/menu/${rec.id}`} 
                                            key={rec.id} 
                                            className="recommended-card"
                                            aria-label={`Перейти к ${rec.name}`}
                                        >
                                            <div className="recommended-card-image-wrapper">
                                                <img 
                                                    src={recImageSrc}
                                                    alt={rec.name} 
                                                    className="recommended-card-image"
                                                    loading="lazy"
                                                />
                                                {rec.isRecommended && (
                                                    <span className="recommended-card-badge">🔥</span>
                                                )}
                                            </div>
                                            <div className="recommended-card-body">
                                                <h4>{rec.name}</h4>
                                                <p>{rec.price} сум</p>
                                                <span className="recommended-card-link">
                                                    Подробнее
                                                    <FaArrowRight />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}