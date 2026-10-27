import Reveal from '@/components/Reveal/Reveal';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero__glow" aria-hidden="true" />
            <div className="container hero__inner">
                <div className="hero__left">
                    <Reveal as="span" className="hero__tag">Gʻijduvon · Oʻzbekiston</Reveal>
                    <Reveal as="h1" className="hero__title" delay={1}>
                        Esda qoladigan <em>taʼm</em>
                    </Reveal>
                    <Reveal as="p" className="hero__subtitle" delay={2}>
                        Coffee Fresh premium restorani — yangi qahva, mualliflik taomlari va
                        qolishni xohlaydigan muhit.
                    </Reveal>
                    <Reveal className="hero__actions" delay={3}>
                        <a href="/menu" className="btn btn--primary">
                            Menyuni koʻrish
                        </a>
                        <a href="tel:+998918859999" className="btn btn--ghost">
                            +998 91 885 99 99
                        </a>
                    </Reveal>
                    <Reveal className="hero__meta" delay={4}>
                        <div>
                            <strong>09:00 – 23:00</strong>
                            <span>Har kuni</span>
                        </div>
                        <div>
                            <strong>4.9 ★</strong>
                            <span>Google sharhlar</span>
                        </div>
                        <div>
                            <strong>100%</strong>
                            <span>Yangi qahva</span>
                        </div>
                    </Reveal>
                </div>

                <Reveal className="hero__media" delay={2}>
                    <div className="hero__media-inner">
                        <img
                            src="/images/hero.png"
                            alt="Уютный интерьер кофейни Coffee Fresh"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>
                    <div className="hero__badge">
                        <span className="hero__badge-line" />
                        <em>Since 2020</em>
                        <strong>Premium Coffee</strong>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}