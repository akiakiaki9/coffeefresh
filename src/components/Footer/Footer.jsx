import { FaInstagram, FaTelegramPlane, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    return (
        <footer id="contacts" className="footer">
            <div className="container footer__inner">
                <div className="footer__col">
                    <h3 className="footer__logo">Coffee <span>Fresh</span></h3>
                    <p>Премиальный ресторан в Гиждуване. Свежий кофе, авторские блюда и уютная атмосфера.</p>
                </div>

                <div className="footer__col">
                    <h4>Контакты</h4>
                    <a href="tel:+998918859999"><FaPhoneAlt /> +998 91 885 99 99</a>
                    <p><FaMapMarkerAlt /> 40.088606, 64.676131</p>
                    <p>Гиждуван, Узбекистан</p>
                </div>

                <div className="footer__col">
                    <h4>Мы в сети</h4>
                    <a href="https://www.instagram.com/coffee_fresh_restaurant/" target="_blank" rel="noreferrer">
                        <FaInstagram /> Instagram
                    </a>
                    <a href="https://t.me/coffeefreshbot" target="_blank" rel="noreferrer">
                        <FaTelegramPlane /> Telegram
                    </a>
                </div>
            </div>
            <div className="footer__bottom">
                © 2026 Coffee Fresh. Все права защищены.
            </div>
        </footer>
    );
}