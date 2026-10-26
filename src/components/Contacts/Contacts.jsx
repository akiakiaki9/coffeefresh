import { FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaTelegramPlane, FaClock } from 'react-icons/fa';
import './Contacts.css';

const COORDS = { lat: 40.088606, lng: 64.676131 };
const YANDEX_ROUTE = `https://yandex.uz/maps/?rtext=~${COORDS.lat},${COORDS.lng}&rtt=auto`;
const GOOGLE_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}&travelmode=driving`;
const MAP_EMBED = `https://yandex.uz/map-widget/v1/?ll=${COORDS.lng}%2C${COORDS.lat}&z=16&pt=${COORDS.lng}%2C${COORDS.lat}`;

export default function Contacts() {
    return (
        <section id="contacts" className="contacts">
            <div className="container">
                <div className="contacts__head">
                    <span className="contacts__tag">Контакты</span>
                    <h2 className="contacts__title">Как нас найти</h2>
                    <p className="contacts__subtitle">
                        Заходите на чашку кофе — мы в центре Гиждувана
                    </p>
                </div>

                <div className="contacts__grid">
                    <div className="contacts__info">
                        <a href="tel:+998918859999" className="contacts__row">
                            <span className="contacts__icon"><FaPhoneAlt /></span>
                            <div>
                                <strong>Телефон</strong>
                                <p>+998 91 885 99 99</p>
                            </div>
                        </a>

                        <div className="contacts__row">
                            <span className="contacts__icon"><FaMapMarkerAlt /></span>
                            <div>
                                <strong>Адрес</strong>
                                <p>Гиждуван, Узбекистан</p>
                                <p className="contacts__coords">{COORDS.lat}, {COORDS.lng}</p>
                            </div>
                        </div>

                        <div className="contacts__row">
                            <span className="contacts__icon"><FaClock /></span>
                            <div>
                                <strong>Режим работы</strong>
                                <p>Ежедневно 09:00 – 23:00</p>
                            </div>
                        </div>

                        <div className="contacts__socials">
                            <a href="https://www.instagram.com/coffee_fresh_restaurant/" target="_blank" rel="noreferrer">
                                <FaInstagram size={20} /> Instagram
                            </a>
                            <a href="https://t.me/coffeefreshbot" target="_blank" rel="noreferrer">
                                <FaTelegramPlane size={20} /> Telegram
                            </a>
                        </div>

                        <div className="contacts__buttons">
                            <a href={YANDEX_ROUTE} target="_blank" rel="noreferrer" className="contacts__btn contacts__btn--primary">
                                🚗 Яндекс.Карты
                            </a>
                            <a href={GOOGLE_ROUTE} target="_blank" rel="noreferrer" className="contacts__btn contacts__btn--ghost">
                                🗺 Google Maps
                            </a>
                        </div>
                    </div>

                    <div className="contacts__map">
                        <iframe
                            src={MAP_EMBED}
                            title="Coffee Fresh на карте"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}