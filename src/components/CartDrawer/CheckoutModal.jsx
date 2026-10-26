"use client";
import { useEffect, useState } from 'react';
import { FiX, FiMapPin, FiUser, FiPhone, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useOrderHistory } from '@/context/OrderHistoryContext';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, onResult }) {
    const { items, total, clearCart } = useCart();
    const { addOrder } = useOrderHistory();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const [coords, setCoords] = useState(null);
    const [locLoading, setLocLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        const onEsc = (e) => e.key === 'Escape' && !loading && onClose();
        window.addEventListener('keydown', onEsc);
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onEsc);
        };
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    const handleGeolocate = () => {
        if (!navigator.geolocation) {
            setError('Геолокация не поддерживается');
            return;
        }
        setLocLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocLoading(false);
            },
            () => {
                setError('Не удалось определить локацию. Разрешите доступ.');
                setLocLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) return setError('Введите имя');
        if (phone.replace(/\D/g, '').length < 9) return setError('Введите корректный телефон');
        if (!address.trim() && !coords) return setError('Укажите адрес или локацию');

        setLoading(true);
        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((i) => ({
                        name: i.name,
                        price: i.price,
                        qty: i.quantity,
                        image: i.image || null,
                    })),
                    total,
                    customer: {
                        name: name.trim(),
                        phone: phone.trim(),
                        address: address.trim(),
                        comment: comment.trim(),
                    },
                    coords,
                }),
            });

            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Ошибка отправки');

            const saved = addOrder({
                status: 'ok',
                items: items.map((i) => ({
                    name: i.name,
                    price: i.price,
                    qty: i.quantity,
                    image: i.image || null,
                })),
                total,
                customer: { name: name.trim(), phone: phone.trim() },
            });

            clearCart();
            onResult?.({ success: true, order: saved });
            onClose();
        } catch (err) {
            addOrder({
                status: 'err',
                items: items.map((i) => ({
                    name: i.name,
                    price: i.price,
                    qty: i.quantity,
                    image: i.image || null,
                })),
                total,
                customer: { name: name.trim(), phone: phone.trim() },
            });
            onResult?.({
                success: false,
                error: err.message || 'Ошибка сети',
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout" onClick={() => !loading && onClose()}>
            <div className="checkout__content" onClick={(e) => e.stopPropagation()}>
                <div className="checkout__header">
                    <h2>Оформление заказа</h2>
                    <button onClick={onClose} disabled={loading} aria-label="Закрыть">
                        <FiX size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="checkout__form">
                    <label className="checkout__field">
                        <FiUser />
                        <input
                            type="text"
                            placeholder="Ваше имя *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label className="checkout__field">
                        <FiPhone />
                        <input
                            type="tel"
                            placeholder="Телефон *"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label className="checkout__field">
                        <FiMapPin />
                        <input
                            type="text"
                            placeholder="Адрес доставки"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <button
                        type="button"
                        className="checkout__geo"
                        onClick={handleGeolocate}
                        disabled={loading || locLoading}
                    >
                        {locLoading ? <FiLoader className="spin" /> : <FiMapPin />}
                        {coords
                            ? `📍 Локация: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                            : 'Определить мою локацию'}
                    </button>

                    <label className="checkout__field checkout__field--textarea">
                        <FiMessageSquare />
                        <textarea
                            placeholder="Комментарий (опционально)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                            rows={2}
                        />
                    </label>

                    {error && <p className="checkout__error">{error}</p>}

                    <div className="checkout__summary">
                        <span>Итого:</span>
                        <strong>{total.toLocaleString()} сум</strong>
                    </div>

                    <button type="submit" className="checkout__submit" disabled={loading}>
                        {loading ? <><FiLoader className="spin" /> Отправка...</> : 'Отправить заказ'}
                    </button>
                </form>
            </div>
        </div>
    );
}