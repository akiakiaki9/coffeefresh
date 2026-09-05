'use client';
import { useState, useEffect } from 'react';
import {
    FaTrash,
    FaPlus,
    FaMinus,
    FaMapMarkerAlt,
    FaTelegramPlane,
    FaShoppingCart,
    FaArrowLeft,
    FaPhone,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import './page.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotal, isClient, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [isLocationSet, setIsLocationSet] = useState(false);

    // Toast
    const [toast, setToast] = useState(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Авто-скрытие тоста через 3 секунды
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const getLocation = () => {
        setGeoLoading(true);
        setOrderError(null);

        if (!navigator.geolocation) {
            setOrderError('Геолокация не поддерживается');
            setGeoLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                setIsLocationSet(true);
                setGeoLoading(false);
                setOrderError(null);
            },
            (error) => {
                let errorMsg = 'Не удалось определить местоположение. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += 'Разрешите доступ к геолокации.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += 'Информация недоступна.';
                        break;
                    case error.TIMEOUT:
                        errorMsg += 'Превышено время ожидания.';
                        break;
                    default:
                        errorMsg += 'Попробуйте снова.';
                }
                setOrderError(errorMsg);
                setGeoLoading(false);
                setIsLocationSet(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const isFormValid = () => {
        return phone.trim() !== '' && address.trim() !== '' && location !== null;
    };

    const handleOrder = async () => {
        setOrderError(null);

        if (!phone.trim()) {
            setOrderError('Введите номер телефона');
            return;
        }
        if (!address.trim()) {
            setOrderError('Введите адрес доставки');
            return;
        }
        if (!location) {
            setOrderError('Нажмите "Определить местоположение"');
            return;
        }

        setLoading(true);

        const orderData = {
            items: cart,
            total: getTotal(),
            address: address.trim(),
            phone: phone.trim(),
            location: location,
            date: new Date().toLocaleString('ru-RU'),
        };

        try {
            const response = await fetch('/api/send-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error('Сервер вернул некорректный ответ');
            }

            if (response.ok && result.success) {
                // ✅ УСПЕХ
                clearCart();
                setToast({ type: 'success', message: '✅ Заказ успешно отправлен! Наш менеджер свяжется с вами.' });
                setOrderError(null);
            } else {
                const errorMsg = result.error || 'Не удалось отправить заказ';
                setOrderError(errorMsg);
                setToast({ type: 'error', message: `❌ ${errorMsg}` });
            }
        } catch (error) {
            console.error('Ошибка:', error);
            const errorMsg = 'Ошибка соединения. Проверьте интернет.';
            setOrderError(errorMsg);
            setToast({ type: 'error', message: `❌ ${errorMsg}` });
        } finally {
            setLoading(false);
        }
    };

    if (!isClient || !isMounted) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-loading">
                        <div className="cart-loading-spinner"></div>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-empty">
                        <div className="cart-empty-icon-wrapper">
                            <FaShoppingCart className="cart-empty-icon" />
                        </div>
                        <h2>Корзина пуста</h2>
                        <p>Вы еще не выбрали ни одного блюда</p>
                        <Link href="/menu" className="cart-empty-btn">
                            <FaShoppingCart />
                            Перейти в меню
                        </Link>
                    </div>
                    {/* Тосты для пустой корзины тоже показываем если есть */}
                    {toast && (
                        <div className={`toast-custom ${toast.type}`}>
                            <span className="toast-icon">
                                {toast.type === 'success' ? '✅' : '❌'}
                            </span>
                            <span className="toast-text">{toast.message}</span>
                            <button className="toast-close-btn" onClick={() => setToast(null)}>
                                <FaTimes />
                            </button>
                            <div className="toast-progress-bar"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                {/* Header */}
                <div className="cart-header">
                    <Link href="/menu" className="cart-back-btn">
                        <FaArrowLeft />
                        <span>Назад</span>
                    </Link>
                    <div className="cart-header-center">
                        <h1 className="cart-title">Корзина</h1>
                        <span className="cart-count">{cart.length} {cart.length === 1 ? 'блюдо' : 'блюд'}</span>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm('Очистить корзину?')) clearCart();
                        }}
                        className="cart-clear-btn"
                    >
                        <FaTrash />
                        <span>Очистить</span>
                    </button>
                </div>

                <div className="cart-grid">
                    {/* Список товаров */}
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.06}s` }}>
                                <div className="cart-item-image-wrapper">
                                    <img src={item.image || '/images/placeholder.png'} alt={item.name} className="cart-item-image" loading="lazy" />
                                    {item.isRecommended && <span className="cart-item-badge">Хит</span>}
                                </div>
                                <div className="cart-item-info">
                                    <div className="cart-item-top">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <span className="cart-item-category">
                                            {item.category === 'coffee' && '☕'}
                                            {item.category === 'waffles' && '🧇'}
                                            {item.category === 'fastfood' && '🍔'}
                                        </span>
                                    </div>
                                    <div className="cart-item-price-wrap">
                                        <span className="cart-item-price-single">{item.price} сум</span>
                                        <span className="cart-item-price-total">
                                            {item.quantity} × {item.price} = {item.price * item.quantity} сум
                                        </span>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="cart-item-qty">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn" disabled={item.quantity <= 1}>
                                                <FaMinus />
                                            </button>
                                            <span className="qty-number">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Сводка */}
                    <div className="cart-summary">
                        <div className="cart-summary-header">
                            <h2>Оформление</h2>
                            <div className="cart-summary-total">{getTotal()} сум</div>
                        </div>

                        <div className="cart-summary-items">
                            {cart.map(item => (
                                <div key={item.id} className="cart-summary-item">
                                    <span className="summary-name">{item.name}</span>
                                    <span className="summary-qty">×{item.quantity}</span>
                                    <span className="summary-price">{item.price * item.quantity} сум</span>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-divider"></div>

                        <div className="cart-summary-total-wrap">
                            <span className="total-label">Итого</span>
                            <span className="total-value">{getTotal()} сум</span>
                        </div>

                        <div className="cart-form">
                            <div className="cart-form-group">
                                <label className="cart-label">
                                    <FaPhone className="label-icon" />
                                    Номер телефона <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+998 90 500 35 00"
                                    className="cart-input"
                                />
                            </div>

                            <div className="cart-form-group">
                                <label className="cart-label">
                                    <FaMapMarkerAlt className="label-icon" />
                                    Адрес доставки <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Введите адрес доставки"
                                    className="cart-input"
                                />
                            </div>

                            <button
                                onClick={getLocation}
                                className={`cart-location-btn ${isLocationSet ? 'active' : ''}`}
                                disabled={geoLoading}
                            >
                                {geoLoading ? (
                                    <>
                                        <FaSpinner className="spinner-icon" />
                                        Определяем...
                                    </>
                                ) : isLocationSet ? (
                                    <>
                                        <FaCheckCircle />
                                        Координаты определены ✅
                                    </>
                                ) : (
                                    <>
                                        <FaMapMarkerAlt />
                                        Определить местоположение <span className="required">*</span>
                                    </>
                                )}
                            </button>

                            {isLocationSet && location && (
                                <div className="cart-location-info">
                                    <span>📍</span>
                                    <span>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                                </div>
                            )}

                            <div className="cart-form-hint">
                                <FaExclamationTriangle className="hint-icon" />
                                <span>Адрес и координаты обязательны</span>
                            </div>
                        </div>

                        {orderError && (
                            <div className="cart-order-error">
                                <span>⚠️</span>
                                <span>{orderError}</span>
                            </div>
                        )}

                        <button
                            onClick={handleOrder}
                            disabled={loading || !isFormValid()}
                            className={`cart-order-btn ${!isFormValid() ? 'disabled' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="order-spinner"></span>
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <FaTelegramPlane />
                                    Оформить заказ
                                </>
                            )}
                        </button>

                        {!isFormValid() && (
                            <div className="cart-required-hint">
                                <span>⚠️</span>
                                <span>
                                    {!phone.trim() && 'Телефон'}
                                    {!phone.trim() && !address.trim() && ' + '}
                                    {!address.trim() && 'Адрес'}
                                    {(!phone.trim() || !address.trim()) && ' + '}
                                    {!location && 'Геолокация'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ TOAST УВЕДОМЛЕНИЕ */}
            {toast && (
                <div className={`toast-custom ${toast.type}`}>
                    <span className="toast-icon">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </span>
                    <span className="toast-text">{toast.message}</span>
                    <button className="toast-close-btn" onClick={() => setToast(null)}>
                        <FaTimes />
                    </button>
                    <div className="toast-progress-bar"></div>
                </div>
            )}
        </div>
    );
}