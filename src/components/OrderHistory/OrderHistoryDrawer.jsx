"use client";
import { useEffect } from 'react';
import { FiX, FiClock, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { useOrderHistory } from '@/context/OrderHistoryContext';
import { PLACEHOLDER_IMAGE } from '@/data/menu';
import './OrderHistoryDrawer.css';

export default function OrderHistoryDrawer({ isOpen, onClose }) {
    const { orders, clearHistory } = useOrderHistory();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        const onEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onEsc);
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', onEsc);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`ordhis ${isOpen ? 'ordhis--open' : ''}`}>
            <div className="ordhis__overlay" onClick={onClose} />
            <aside className="ordhis__panel">
                <div className="ordhis__header">
                    <h2>
                        <FiClock size={22} /> История заказов
                    </h2>
                    <button onClick={onClose} aria-label="Закрыть">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="ordhis__body">
                    {orders.length === 0 && (
                        <div className="ordhis__empty">
                            <p>📭 Пока нет заказов</p>
                            <span>Оформленные заказы хранятся здесь 14 дней</span>
                        </div>
                    )}

                    {orders.map((o) => (
                        <div key={o.id} className="ordhis__item">
                            <div className="ordhis__item-head">
                                <code>{o.id}</code>
                                <span className={`ordhis__status ordhis__status--${o.status === 'ok' ? 'ok' : 'err'}`}>
                                    {o.status === 'ok' ? (
                                        <><FiCheckCircle size={14} /> Отправлен</>
                                    ) : (
                                        <><FiAlertCircle size={14} /> Ошибка</>
                                    )}
                                </span>
                            </div>
                            <p className="ordhis__date">
                                {new Date(o.createdAt).toLocaleString('ru-RU', {
                                    timeZone: 'Asia/Tashkent',
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            <div className="ordhis__items">
                                {o.items?.slice(0, 3).map((it, idx) => (
                                    <img
                                        key={idx}
                                        src={it.image || PLACEHOLDER_IMAGE}
                                        alt={it.name}
                                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                                    />
                                ))}
                                {o.items?.length > 3 && (
                                    <span className="ordhis__more">+{o.items.length - 3}</span>
                                )}
                            </div>
                            <div className="ordhis__total">
                                <span>{o.items?.length} поз.</span>
                                <strong>{o.total.toLocaleString()} сум</strong>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length > 0 && (
                    <div className="ordhis__footer">
                        <button onClick={clearHistory} className="ordhis__clear">
                            <FiTrash2 size={16} /> Очистить историю
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}