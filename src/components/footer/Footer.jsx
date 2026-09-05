import { FaCoffee, FaClock, FaPhone, FaInstagram, FaTelegramPlane, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-title">
                            <FaCoffee />
                            <span>Coffee Fresh</span>
                        </div>
                        <p className="footer-subtitle">Первая официальная кофейня в Гиждуване</p>
                        <p className="footer-subtitle" style={{ marginTop: '8px' }}>
                            <FaMapMarkerAlt style={{ display: 'inline', marginRight: '8px' }} />
                            Гиждуван, Узбекистан
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-heading">Контакты</h4>
                        <a href="tel:+998905003500" className="footer-contact">
                            <FaPhone />
                            <span>+998 90 500 35 00</span>
                        </a>
                        <div className="footer-contact">
                            <FaClock />
                            <span>Работаем 24/7</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Мы в соцсетях</h4>
                        <div className="footer-social">
                            <a href="https://www.instagram.com/coffee_fresh___/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="https://t.me/coffeefresh_bot" target="_blank" rel="noopener noreferrer">
                                <FaTelegramPlane />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Coffee Fresh. Все права защищены.</p>
                    <p style={{ marginTop: '8px' }}>
                        Разработано в
                        <a href="https://akbarsoft.uz" target="_blank" rel="noopener noreferrer" className="footer-dev">
                            Akbar Soft
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}