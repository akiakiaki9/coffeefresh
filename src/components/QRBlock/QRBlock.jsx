import Reveal from '@/components/Reveal/Reveal';
import './QRBlock.css';

const QR_MENU = '/images/qr-menu.png';
const QR_REVIEW = '/images/qr-review.png';

export default function QRBlock() {
    return (
        <section id="qr" className="section qr">
            <div className="container">
                <Reveal className="qr__head">
                    <span className="eyebrow">QR kodlar</span>
                    <h2 className="qr__title">
                        Skanerlab <em>oching</em>
                    </h2>
                    <p className="qr__subtitle">
                        Telefoningizni qarating — menyu yoki sharh qoldirish bir zumda.
                    </p>
                </Reveal>

                <div className="qr__grid">
                    <Reveal className="qr__card" delay={1}>
                        <div className="qr__image">
                            <img src={QR_MENU} alt="Menyu QR kodi" loading="lazy" decoding="async" />
                        </div>
                        <div className="qr__meta">
                            <span className="qr__num">01</span>
                            <h3>Menyu</h3>
                            <p>Toʻliq menyuni telefoningizda koʻring</p>
                        </div>
                    </Reveal>

                    <Reveal className="qr__card" delay={2}>
                        <div className="qr__image">
                            <img src={QR_REVIEW} alt="Google sharh QR kodi" loading="lazy" decoding="async" />
                        </div>
                        <div className="qr__meta">
                            <span className="qr__num">02</span>
                            <h3>Sharh qoldiring</h3>
                            <p>Google Maps da sharh — biz uchun muhim</p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}