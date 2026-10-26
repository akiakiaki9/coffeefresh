import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import MenuList from '@/components/MenuList/MenuList';
import Contacts from '@/components/Contacts/Contacts';
import './menu.css';

export const metadata = {
    title: 'Меню | Coffee Fresh — премиальный ресторан в Гиждуване',
    description:
        'Полное меню Coffee Fresh: свежий кофе, десерты, авторские блюда. Закажите онлайн через Telegram.',
    alternates: { canonical: 'https://coffeefresh.uz/menu' },
    openGraph: {
        title: 'Меню Coffee Fresh',
        description: 'Свежий кофе и авторские блюда в Гиждуване',
        url: 'https://coffeefresh.uz/menu',
        type: 'website',
    },
};

export default function MenuPage() {
    return (
        <>
            <Navbar />
            <main className="container menu-page">
                <h1 className="menu-page__title">Наше Меню</h1>
                <p className="menu-page__subtitle">
                    Выберите блюдо — добавьте в корзину и оформите заказ через Telegram.
                </p>
                <MenuList />
            </main>
            <Contacts />
            <Footer />
        </>
    );
}