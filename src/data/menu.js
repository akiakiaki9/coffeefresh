export const CATEGORIES = [
    { id: 'coffee', name: 'Qahva' },
    { id: 'desserts', name: 'Shirinliklar' },
    { id: 'main', name: 'Asosiy taomlar' },
    { id: 'drinks', name: 'Ichimliklar' },
];

export const MENU = [
    {
        id: 'c1', category: 'coffee', name: 'Kapuchino', price: 25000,
        desc: 'Klassik kapuchino — qalin sut koʻpigi va yengil achchiq taʼm.',
        image: '/images/cappuccino.jpg',
    },
    {
        id: 'c2', category: 'coffee', name: 'Latte', price: 28000,
        desc: 'Espresso va issiq sut asosidagi mayin latte.',
        image: '/images/latte.jpg',
    },
    {
        id: 'd1', category: 'desserts', name: 'Chizkeyk Nyu-York', price: 45000,
        desc: 'Klassik chizkeyk, rezavor sous va qaymoqli krem bilan.',
        image: '/images/cheesecake.jpg',
    },
    {
        id: 'd2', category: 'desserts', name: 'Kruassan', price: 22000,
        desc: 'Yangi pishirilgan, qarsildoq poʻstloqli kruassan.',
        image: '',
    },
    {
        id: 'm1', category: 'main', name: 'Mol goʻshtidan steyk', price: 180000,
        desc: 'Grilda pishirilgan sabzavotlar, barbekyu sous va rozmarin bilan.',
        image: '/images/steak.jpg',
    },
    {
        id: 'm2', category: 'main', name: 'Karbonara pasta', price: 85000,
        desc: 'Bekon, parmezan va tuxum bilan klassik karbonara.',
        image: '/images/pasta.jpg',
    },
    {
        id: 'dr1', category: 'drinks', name: 'Yangi siqilgan apelsin sharbati', price: 30000,
        desc: '100% yangi apelsin sharbati, shakarsiz.',
        image: '/images/orange-juice.jpg',
    },
];

export const PLACEHOLDER_IMAGE = '/images/placeholder.png';