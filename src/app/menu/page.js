import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import MenuList from '@/components/MenuList/MenuList';
import Contacts from '@/components/Contacts/Contacts';
import QRBlock from '@/components/QRBlock/QRBlock';
import './menu.css';

export const metadata = {
    title: 'Menyu | Gʻijduvon Premium Restorani',
    description:
        'Coffee Fresh restoranining menyusi: qahva, shirinliklar va mazali taomlar. Menyuni koʻring va Telegram orqali buyurtma bering.',
    alternates: {
        canonical: 'https://coffeefresh.uz/menu',
    },
    openGraph: {
        title: 'Coffee Fresh — Restoran menyusi',
        description:
            'Gʻijduvonda qahva, shirinliklar va mazali taomlarni tanlang. Coffee Fresh menyusi bilan tanishing.',
        url: 'https://coffeefresh.uz/menu',
        siteName: 'Coffee Fresh',
        locale: 'uz_UZ',
        type: 'website',
    },
};

export default function MenuPage() {
    return (
        <>
            <Navbar />

            <main className="container menu-page">
                <header className="menu-page__head">
                    <span className="eyebrow">COFFEE FRESH · MENYU</span>

                    <h1 className="menu-page__title">
                        Bizning <em>menyu</em>
                    </h1>

                    <p className="menu-page__subtitle">
                        Oʻzingizga yoqqan taomni tanlang, savatga qoʻshing
                        va Telegram orqali buyurtma bering.
                    </p>

                    <span className="menu-page__decoration" aria-hidden="true">
                        GOOD FOOD. GOOD MOOD.
                    </span>
                </header>

                <MenuList />
            </main>

            <Contacts />
            <QRBlock />
            <Footer />
        </>
    );
}