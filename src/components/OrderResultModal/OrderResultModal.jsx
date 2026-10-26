"use client";
import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import './OrderResultModal.css';

export default function OrderResultModal({ result, onClose }) {
    useEffect(() => {
        if (!result) return;
        document.body.classList.add('no-scroll');
        const onEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onEsc);
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onEsc);
        };
    }, [result, onClose]);

    if (!result) return null;

    const { success, order, error } = result;

    return (
        <div className="ordres" onClick={onClose}>
            <div className="ordres__content" onClick={(e) => e.stopPropagation()}>
                <button className="ordres__close" onClick={onClose} aria-label="Закрыть">
                    <FiX size={22} />
                </button>

                <div className={`ordres__icon ordres__icon--${success ? 'ok' : 'err'}`}>
                    {success ? <FiCheckCircle size={48} /> : <FiAlertCircle size={48} />}
                </div>

                <h2 className="ordres__title">
                    {success ? 'Заказ принят!' : 'Не удалось отправить'}
                </h2>

                {success ? (
                    <>
                        <p className="ordres__text">
                            Мы получили ваш заказ и свяжемся для подтверждения.
                        </p>
                        <div className="ordres__card">
                            <div className="ordres__row">
                                <span>Номер заказа</span>
                                <code>{order.id}</code>
                            </div>
                            <div className="ordres__row">
                                <span>Сумма</span>
                                <strong>{order.total.toLocaleString()} сум</strong>
                            </div>
                            <div className="ordres__row">
                                <span>Время</span>
                                <span>
                                    {new Date(order.createdAt).toLocaleString('ru-RU', {
                                        timeZone: 'Asia/Tashkent',
                                    })}
                                </span>
                            </div>
                            <div className="ordres__row">
                                <span>Состав</span>
                                <span>{order.items.length} поз.</span>
                            </div>
                        </div>
                        <p className="ordres__hint">
                            Заказ сохранён в истории на 14 дней — открыть можно в меню «История».
                        </p>
                        <a href="tel:+998918859999" className="ordres__phone">
                            📞 +998 91 885 99 99
                        </a>
                    </>
                ) : (
                    <>
                        <p className="ordres__text">
                            {error || 'Попробуйте ещё раз или позвоните нам.'}
                        </p>
                        <a href="tel:+998918859999" className="ordres__phone">
                            📞 +998 91 885 99 99
                        </a>
                    </>
                )}

                <button className="ordres__btn" onClick={onClose}>
                    {success ? 'Отлично' : 'Понятно'}
                </button>
            </div>
        </div>
    );
}