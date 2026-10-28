"use client";
import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import './OrderResultModal.css';

export default function OrderResultModal({ result, onClose }) {
    useBodyScrollLock(Boolean(result));

    useEffect(() => {
        if (!result) return;
        const onEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onEsc);
        return () => {
            window.removeEventListener('keydown', onEsc);
        };
    }, [result, onClose]);

    if (!result) return null;
    const { success, order, error, code } = result;

    return (
        <div className="ordres" onClick={onClose}>
            <div className="ordres__content" onClick={(e) => e.stopPropagation()}>
                <button className="ordres__close" onClick={onClose} aria-label="Yopish"><FiX size={22} /></button>
                <div className={`ordres__icon ordres__icon--${success ? 'ok' : 'err'}`}>
                    {success ? <FiCheckCircle size={48} /> : <FiAlertCircle size={48} />}
                </div>
                <h2 className="ordres__title">{success ? 'Buyurtma qabul qilindi!' : 'Yuborib boʻlmadi'}</h2>
                {success ? (
                    <>
                        <p className="ordres__text">Buyurtmangiz qabul qilindi. Tasdiqlash uchun bogʻlanamiz.</p>
                        <div className="ordres__card">
                            <div className="ordres__row"><span>Buyurtma kodi</span><strong className="ordres__code">{code}</strong></div>
                            <div className="ordres__row"><span>Jami</span><strong>{order.total.toLocaleString()} soʻm</strong></div>
                            <div className="ordres__row"><span>Vaqt</span>
                                <span>{new Date(order.createdAt).toLocaleString('uz-UZ', {
                                    timeZone: 'Asia/Tashkent',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}</span>
                            </div>
                            <div className="ordres__row"><span>Tarkib</span><span>{order.items.length} ta</span></div>
                        </div>
                        <p className="ordres__hint">Buyurtma 14 kun davomida «Tarix» boʻlimida saqlanadi.</p>
                        <a href="tel:+998918859999" className="ordres__phone">📞 +998 91 885 99 99</a>
                    </>
                ) : (
                    <>
                        <p className="ordres__text">{error || 'Qaytadan urinib koʻring yoki qoʻngʻiroq qiling.'}</p>
                        <a href="tel:+998918859999" className="ordres__phone">📞 +998 91 885 99 99</a>
                    </>
                )}
                <button className="ordres__btn" onClick={onClose}>{success ? 'Yaxshi' : 'Tushunarli'}</button>
            </div>
        </div>
    );
}