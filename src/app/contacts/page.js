// app/contacts/page.js
'use client';
import { useState } from 'react';
import {
    FaMapMarkerAlt,
    FaPhone,
    FaClock,
    FaInstagram,
    FaTelegramPlane,
    FaPaperPlane,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaRegStar,
    FaSmile,
    FaMeh,
    FaFrown,
    FaAngry,
    FaHeart
} from 'react-icons/fa';
import './page.css';
import Footer from '@/components/footer/Footer';

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        rating: 0,
        category: '',
        message: '',
        isAnonymous: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRatingClick = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormData({ ...formData, rating: 0 });

        try {
            // Отправка в Telegram
            const response = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    date: new Date().toLocaleString('ru-RU')
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    rating: 0,
                    category: '',
                    message: '',
                    isAnonymous: false
                });
                setTimeout(() => setIsSubmitted(false), 4000);
            } else {
                alert('❌ Ошибка при отправке. Попробуйте снова.');
            }
        } catch (error) {
            alert('❌ Ошибка соединения. Проверьте интернет.');
        } finally {
            setIsLoading(false);
        }
    };

    const ratingLabels = [
        { value: 1, label: 'Ужасно', icon: <FaAngry /> },
        { value: 2, label: 'Плохо', icon: <FaFrown /> },
        { value: 3, label: 'Нормально', icon: <FaMeh /> },
        { value: 4, label: 'Хорошо', icon: <FaSmile /> },
        { value: 5, label: 'Отлично!', icon: <FaHeart /> }
    ];

    const categories = [
        { value: 'quality', label: 'Качество еды' },
        { value: 'service', label: 'Обслуживание' },
        { value: 'delivery', label: 'Доставка' },
        { value: 'price', label: 'Цены' },
        { value: 'atmosphere', label: 'Атмосфера' },
        { value: 'other', label: 'Другое' }
    ];

    const contactInfo = [
        {
            icon: <FaMapMarkerAlt />,
            title: 'Адрес',
            details: ['Гиждуван, махаллинский сход граждан Дегрезон, просп. XXI АСР, 122'],
            link: 'https://maps.google.com/?q=Ташкент+ул.Амира+Темура+15',
            linkText: 'Открыть в картах →'
        },
        {
            icon: <FaPhone />,
            title: 'Телефон',
            details: ['+998 90 500 35 00'],
            link: 'tel:+998905003500',
            linkText: 'Позвонить →'
        },
        {
            icon: <FaClock />,
            title: 'Режим работы',
            details: ['Пн-Вс | Круглосуточно'],
            link: '#',
            linkText: 'Без выходных'
        }
    ];

    const socialLinks = [
        { icon: <FaInstagram />, url: 'https://www.instagram.com/coffee_fresh___/', label: 'Instagram' },
        { icon: <FaTelegramPlane />, url: 'https://t.me/coffeefresh_bot', label: 'Telegram' },
    ];

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isActive = i <= (hoverRating || formData.rating);
            stars.push(
                <button
                    key={i}
                    type="button"
                    className={`star-btn ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingClick(i)}
                    aria-label={`Оценка ${i} из 5`}
                >
                    {isActive ? <FaStar /> : <FaRegStar />}
                </button>
            );
        }
        return stars;
    };

    return (
        <>
            <div className="contacts-page">
                {/* ===== HERO ===== */}
                <section className="contacts-hero">
                    <div className="contacts-hero-bg"></div>
                    <div className="container contacts-hero-content">
                        <span className="contacts-hero-badge">📝 Книга жалоб и предложений</span>
                        <h1 className="contacts-hero-title">
                            Ваше мнение <span>важно для нас</span>
                        </h1>
                        <p className="contacts-hero-subtitle">
                            Оцените качество, оставьте отзыв или предложение — мы обязательно ответим
                        </p>
                    </div>
                </section>

                {/* ===== ИНФОРМАЦИЯ ===== */}
                <section className="contacts-info">
                    <div className="container">
                        <div className="contacts-grid">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="contact-card">
                                    <div className="contact-card-icon">{info.icon}</div>
                                    <h3 className="contact-card-title">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="contact-card-detail">{detail}</p>
                                    ))}
                                    {info.link && (
                                        <a href={info.link} target={info.link.startsWith('http') ? '_blank' : ''} rel="noopener noreferrer" className="contact-card-link">
                                            {info.linkText}
                                            <FaArrowRight />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== КАРТА + ФОРМА ===== */}
                <section className="contacts-map-form">
                    <div className="container">
                        <div className="contacts-map-form-grid">
                            {/* Карта */}
                            <div className="contacts-map-wrapper">
                                <div className="contacts-map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d226.8305335441808!2d64.6814977424918!3d40.100929645228376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f506900674a50bd%3A0xfd3f29e3fae5a10c!2sFreshFood!5e0!3m2!1sru!2s!4v1788181512765!5m2!1sru!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        title="FreshFood на карте"
                                    />
                                </div>
                                <div className="contacts-map-overlay">
                                    <div className="contacts-map-overlay-content">
                                        <FaMapMarkerAlt className="map-marker-icon" />
                                        <span>Coffee Fresh</span>
                                        <small>Гиждуван, махаллинский сход граждан Дегрезон</small>
                                    </div>
                                </div>
                            </div>

                            {/* Форма */}
                            <div className="contacts-form-wrapper">
                                <div className="contacts-form-header">
                                    <span className="form-badge">📝 Оставить отзыв</span>
                                    <h2 className="form-title">Книга жалоб и предложений</h2>
                                    <p className="form-subtitle">
                                        Ваше мнение помогает нам становиться лучше
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="contacts-form">
                                    {/* Имя */}
                                    <div className="form-group">
                                        <label htmlFor="name">Ваше имя</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Тимур Тимуров"
                                            required
                                        />
                                    </div>

                                    {/* Телефон */}
                                    <div className="form-group">
                                        <label htmlFor="phone">Номер телефона</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+998 90 500 35 00"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ivan@example.com"
                                        />
                                    </div>

                                    {/* Рейтинг */}
                                    <div className="form-group rating-group">
                                        <label>Оцените нас</label>
                                        <div className="rating-container">
                                            <div className="stars-wrapper">
                                                {renderStars()}
                                            </div>
                                            <span className="rating-label">
                                                {formData.rating > 0 && (
                                                    <span className="rating-text">
                                                        {ratingLabels.find(r => r.value === formData.rating)?.icon}
                                                        {ratingLabels.find(r => r.value === formData.rating)?.label}
                                                    </span>
                                                )}
                                                {formData.rating === 0 && hoverRating === 0 && (
                                                    <span className="rating-placeholder">Выберите оценку</span>
                                                )}
                                                {hoverRating > 0 && formData.rating === 0 && (
                                                    <span className="rating-hover">
                                                        {ratingLabels.find(r => r.value === hoverRating)?.icon}
                                                        {ratingLabels.find(r => r.value === hoverRating)?.label}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="rating-hint">
                                            <span>1</span>
                                            <span>5</span>
                                        </div>
                                    </div>

                                    {/* Категория */}
                                    <div className="form-group">
                                        <label htmlFor="category">Категория</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите категорию</option>
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Сообщение */}
                                    <div className="form-group">
                                        <label htmlFor="message">Ваше сообщение</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Расскажите подробнее..."
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    {/* Анонимно */}
                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isAnonymous"
                                                checked={formData.isAnonymous}
                                                onChange={handleChange}
                                            />
                                            <span>Отправить анонимно</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`form-submit-btn ${isLoading ? 'loading' : ''} ${isSubmitted ? 'submitted' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Отправка...
                                            </>
                                        ) : isSubmitted ? (
                                            <>
                                                <FaCheckCircle />
                                                Отправлено!
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Отправить отзыв
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== СОЦИАЛЬНЫЕ СЕТИ ===== */}
                <section className="contacts-social">
                    <div className="container">
                        <div className="contacts-social-content">
                            <div className="contacts-social-text">
                                <span className="social-badge">🌐 Мы в соцсетях</span>
                                <h2>Присоединяйтесь к нам</h2>
                                <p>Следите за новостями, акциями и свежими постами</p>
                            </div>
                            <div className="contacts-social-links">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                        <span>{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== CTA ===== */}
                <section className="contacts-cta">
                    <div className="container">
                        <div className="contacts-cta-content">
                            <div className="contacts-cta-text">
                                <h2>Готовы попробовать наш кофе?</h2>
                                <p>Сделайте заказ прямо сейчас или посетите нашу кофейню</p>
                            </div>
                            <div className="contacts-cta-buttons">
                                <a href="/menu" className="cta-btn primary">
                                    Смотреть меню
                                    <FaArrowRight />
                                </a>
                                <a href="tel:+998905003500" className="cta-btn secondary">
                                    <FaPhone />
                                    Позвонить
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}