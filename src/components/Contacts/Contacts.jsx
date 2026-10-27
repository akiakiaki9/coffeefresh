import { FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaTelegramPlane, FaClock } from 'react-icons/fa';
import Reveal from '@/components/Reveal/Reveal';
import './Contacts.css';

const COORDS = { lat: 40.088606, lng: 64.676131 };
const YANDEX_ROUTE = `https://yandex.uz/maps/?rtext=~${COORDS.lat},${COORDS.lng}&rtt=auto`;
const GOOGLE_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}&travelmode=driving`;
const MAP_EMBED = `https://yandex.uz/map-widget/v1/?ll=${COORDS.lng}%2C${COORDS.lat}&z=16&pt=${COORDS.lng}%2C${COORDS.lat}`;

export default function Contacts() {
    return (
        <section id="contacts" className="section contacts">
            <div className="container">
                <Reveal className="contacts__head">
                    <span className="eyebrow">Kontaktlar</span>
                    <h2 className="contacts__title">
                        Bizni <em>qanday topish</em> mumkin
                    </h2>
                    <p className="contacts__subtitle">
                        Gʻijduvon markazidamiz — bir piyola qahvaga kiring.
                    </p>
                </Reveal>

                <div className="contacts__grid">
                    <Reveal className="contacts__info" delay={1}>
                        <a href="tel:+998918859999" className="contacts__row">
                            <span className="contacts__icon"><FaPhoneAlt /></span>
                            <div>
                                <strong>Telefon</strong>
                                <p>+998 91 885 99 99</p>
                            </div>
                        </a>

                        <div className="contacts__row">
                            <span className="contacts__icon"><FaMapMarkerAlt /></span>
                            <div>
                                <strong>Manzil</strong>
                                <p>Gʻijduvon, Oʻzbekiston</p>
                                <p className="contacts__coords">{COORDS.lat}, {COORDS.lng}</p>
                            </div>
                        </div>

                        <div className="contacts__row">
                            <span className="contacts__icon"><FaClock /></span>
                            <div>
                                <strong>Ish vaqti</strong>
                                <p>Har kuni 09:00 – 23:00</p>
                            </div>
                        </div>

                        <div className="contacts__socials">
                            <a href="https://www.instagram.com/coffee_fresh_restaurant/" target="_blank" rel="noreferrer">
                                <FaInstagram size={18} /> Instagram
                            </a>
                            <a href="https://t.me/coffeefreshbot" target="_blank" rel="noreferrer">
                                <FaTelegramPlane size={18} /> Telegram
                            </a>
                        </div>

                        <div className="contacts__buttons">
                            <a href={YANDEX_ROUTE} target="_blank" rel="noreferrer" className="btn btn--primary">
                                🚗 Yandex xarita
                            </a>
                            <a href={GOOGLE_ROUTE} target="_blank" rel="noreferrer" className="btn btn--ghost">
                                🗺 Google Maps
                            </a>
                        </div>
                    </Reveal>

                    <Reveal className="contacts__map-wrap" delay={2}>
                        <div className="contacts__map">
                            <iframe src={MAP_EMBED} title="Coffee Fresh xaritada" allowFullScreen loading="lazy" />
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}