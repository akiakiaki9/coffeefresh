import './Hero.css';

export default function Hero() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__text">
                    <span className="hero__tag">Гиждуван · Узбекистан</span>
                    <h1 className="hero__title">
                        Вкус, который <br /> вы запомните
                    </h1>
                    <p className="hero__subtitle">
                        Премиальный ресторан Coffee Fresh — свежий кофе, авторские блюда
                        и атмосфера, в которой хочется остаться.
                    </p>
                    <div className="hero__actions">
                        <a href="/menu" className="hero__btn hero__btn--primary">
                            Смотреть меню
                        </a>
                        <a href="tel:+998918859999" className="hero__btn hero__btn--ghost">
                            +998 91 885 99 99
                        </a>
                    </div>
                </div>
                <div className="hero__image">
                    <img
                        src="/images/hero.png"
                        alt="Интерьер Coffee Fresh"
                    />
                </div>
            </div>
        </section>
    );
}