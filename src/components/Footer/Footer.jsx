import {
    FaInstagram,
    FaTelegramPlane,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaArrowUp,
    FaClock,
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
    // Фиксированный год исключает ошибку prerendering в Next.js.
    const currentYear = 2026;

    const mapUrl =
        'https://yandex.uz/maps/?ll=64.676131%2C40.088606&z=16&pt=64.676131%2C40.088606';

    return (
        <footer className="footer">
            <div className="footer__glow" aria-hidden="true" />

            <div className="container footer__inner">
                {/* Brand */}
                <div className="footer__brand">
                    <a
                        className="footer__logo"
                        href="/"
                        aria-label="Coffee Fresh — bosh sahifa"
                    >
                        Coffee<span> Fresh</span>
                        <span className="footer__logo-dot">.</span>
                    </a>

                    <span className="footer__brand-label">
                        RESTAURANT · COFFEE · MOMENTS
                    </span>

                    <p className="footer__description">
                        Gʻijduvondagi sevimli maskaningiz.
                        Yangi qahva, mualliflik taomlari va
                        unutilmas lahzalar.
                    </p>

                    <div className="footer__socials">
                        <a
                            href="https://www.instagram.com/coffee_fresh_restaurant/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Coffee Fresh Instagram"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="https://t.me/coffeefreshbot"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Coffee Fresh Telegram"
                        >
                            <FaTelegramPlane />
                        </a>
                    </div>
                </div>

                {/* Contacts */}
                <div className="footer__col">
                    <h2 className="footer__heading">
                        Biz bilan bogʻlaning
                    </h2>

                    <a
                        className="footer__contact"
                        href="tel:+998918859999"
                    >
                        <span className="footer__icon">
                            <FaPhoneAlt />
                        </span>

                        <span className="footer__contact-text">
                            <small>Telefon raqam</small>
                            <strong>+998 91 885 99 99</strong>
                        </span>

                        <FiArrowUpRight className="footer__arrow" />
                    </a>

                    <a
                        className="footer__contact"
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="footer__icon">
                            <FaMapMarkerAlt />
                        </span>

                        <span className="footer__contact-text">
                            <small>Bizning manzil</small>
                            <strong>Gʻijduvon, Oʻzbekiston</strong>
                        </span>

                        <FiArrowUpRight className="footer__arrow" />
                    </a>

                    <div className="footer__contact">
                        <span className="footer__icon">
                            <FaClock />
                        </span>

                        <span className="footer__contact-text">
                            <small>Ish vaqti</small>
                            <strong>Har kuni, 09:00–23:00</strong>
                        </span>
                    </div>
                </div>

                {/* Call to action */}
                <div className="footer__col footer__col--cta">
                    <span className="footer__eyebrow">
                        COFFEE FRESH
                    </span>

                    <h2 className="footer__invitation">
                        Sizni kutib qolamiz!
                    </h2>

                    <p className="footer__cta-text">
                        Mazali taomlar va yoqimli muhit uchun
                        bizga tashrif buyuring.
                    </p>

                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__map-link"
                    >
                        Bizni toping
                        <FiArrowUpRight />
                    </a>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer__bottom">
                <div className="container footer__bottom-inner">
                    <p className="footer__copyright">
                        <span>© {currentYear} Coffee Fresh.</span>
                        <span>Barcha huquqlar himoyalangan.</span>
                    </p>

                    <a className="footer__back-top" href="#top">
                        Yuqoriga
                        <FaArrowUp />
                    </a>

                    <p className="footer__credit">
                        Developed by{' '}
                        <a
                            href="https://www.akbarsoft.uz"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Akbar Soft — veb-sayt ishlab chiqish"
                        >
                            Akbar Soft
                            <FiArrowUpRight />
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}