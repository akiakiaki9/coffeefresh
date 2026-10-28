import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { CATEGORIES } from '@/data/menu';

const TOKEN = process.env.TG_TOKEN;
const ADMIN_CHAT_IDS = (process.env.TG_CHAT_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

const states = new Map();
const ORDER_STATE_TTL = 30 * 60 * 1000;
const SITE_URL = new URL(
    '/menu',
    process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefresh.uz'
).toString();
const PHONE = '+998 91 885 99 99';
const LOCATION = { lat: 40.088606, lng: 64.676131 };
const ADDRESS_STR = 'Gʻijduvon, Oʻzbekiston';

async function tg(method, body) {
    if (!TOKEN) throw new Error('TG_TOKEN is not configured');

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
    });
    const result = await res.json();

    if (!res.ok || !result.ok) {
        throw new Error(`Telegram ${method} failed: ${result.description || res.statusText}`);
    }

    return result;
}

const sendMessage = (chat_id, text, extra = {}) =>
    tg('sendMessage', { chat_id, text, parse_mode: 'HTML', ...extra });
const sendLocation = (chat_id, lat, lng) =>
    tg('sendLocation', { chat_id, latitude: lat, longitude: lng });
const answerCallback = (id) => tg('answerCallbackQuery', { callback_query_id: id });
const esc = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function getState(chatId) {
    const state = states.get(chatId);
    if (!state) return null;

    if (Date.now() - state.updatedAt > ORDER_STATE_TTL) {
        states.delete(chatId);
        return null;
    }

    return state;
}

function setState(chatId, state) {
    states.set(chatId, { ...state, updatedAt: Date.now() });
}

const mainKeyboard = {
    keyboard: [
        [{ text: '☕ Menyu' }, { text: '🛒 Buyurtma berish' }],
        [{ text: '📞 Qoʻngʻiroq' }, { text: '📍 Manzil' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
};

const cancelKeyboard = {
    keyboard: [
        [{ text: '❌ Bekor qilish' }],
        [{ text: '🏠 Bosh menyu' }],
    ],
    resize_keyboard: true,
};

const categoryKeyboard = {
    keyboard: [
        ...Array.from({ length: Math.ceil(CATEGORIES.length / 2) }, (_, row) =>
            CATEGORIES.slice(row * 2, row * 2 + 2).map((category) => ({
                text: category.name,
            }))
        ),
        [{ text: '❌ Bekor qilish' }, { text: '🏠 Bosh menyu' }],
    ],
    resize_keyboard: true,
};

const getItemButtonText = (item) =>
    `${item.name} · ${item.price.toLocaleString('ru-RU')} soʻm`;

const getItemKeyboard = (category) => {
    const itemButtons = category.items.map((item) => ({
        text: getItemButtonText(item),
    }));

    return {
        keyboard: [
            ...Array.from({ length: Math.ceil(itemButtons.length / 2) }, (_, row) =>
                itemButtons.slice(row * 2, row * 2 + 2)
            ),
            [{ text: '⬅️ Kategoriyalar' }, { text: '🛒 Savat' }],
            [{ text: '✅ Rasmiylashtirish' }],
            [{ text: '❌ Bekor qilish' }, { text: '🏠 Bosh menyu' }],
        ],
        resize_keyboard: true,
    };
};

const getCartKeyboard = {
    keyboard: [
        [{ text: '➕ Yana taom tanlash' }],
        [{ text: '✅ Rasmiylashtirish' }],
        [{ text: '❌ Bekor qilish' }, { text: '🏠 Bosh menyu' }],
    ],
    resize_keyboard: true,
};

const normalizeText = (text) =>
    String(text ?? '')
        .toLocaleLowerCase('uz-UZ')
        .normalize('NFKC')
        .replace(/[ʻʼ‘’`]/g, "'")
        .replace(/[.!?,:;]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const welcomeText = (name) =>
    `Salom, <b>${esc(name)}</b>! 👋\n\n` +
    `Bu <b>Coffee Fresh</b> boti ☕🍰\n\n` +
    `Gʻijduvondagi qahva, shirinliklar va mazali taomlar.\n\n` +
    `Menyu, buyurtma, ish vaqti yoki manzil haqida soʻrashingiz mumkin.\n` +
    `Kerakli boʻlimni tanlang 👇`;

const menuText = () =>
    `☕ <b>Bizning menyu</b>\n\n` +
    `Qahva, shirinliklar va issiq taomlar — har kuni yangi tayyorlaymiz.\n` +
    `Taom nomi yoki kategoriya nomini yozsangiz, narxini topib beraman 👇`;

const contactText = () =>
    `📞 <b>Biz bilan bogʻlanish</b>\n\n${PHONE}\n\n🕐 Har kuni 09:00 – 23:00`;

const addressText = () =>
    `📍 <b>Biz shu yerdamiz</b>\n\n${ADDRESS_STR}\n\nQuyidagi tugma orqali marshrut quring 👇`;

const helpText =
    `Quyidagilarda yordam beraman:\n` +
    `• menyu va taomlar narxi\n` +
    `• buyurtma va yetkazib berish\n` +
    `• ish vaqti, manzil va telefon\n\n` +
    `Savolingizni yozing yoki pastdagi tugmalardan foydalaning 👇`;

const faqKeyboard = {
    inline_keyboard: [
        [{ text: '☕ Menyuni ochish', url: SITE_URL }],
        [{ text: '🛒 Buyurtma berish', callback_data: 'start_order' }],
        [{ text: '📍 Manzil va ish vaqti', callback_data: 'show_address' }],
    ],
};

const menuCategoryAliases = {
    tea: ['tea', 'чай'],
    coffee: ['kofe', 'coffee', 'кофе'],
    salads: ['salad', 'salat', 'салат'],
    soups: ['soup', 'sup', 'birinchi taom', 'суп', 'первое блюдо'],
    main: ['ikkinchi taom', 'второе блюдо'],
    fastfood: ['fast food', 'fastfood', 'lavash', 'burger'],
    pizza: ['pizza', 'pitsa', 'пицца'],
    desserts: ['desert', 'dessert', 'shirinlik', 'tort', 'десерт', 'торт'],
    waffles: ['waffle', 'vafli', 'вафли'],
    mojito: ['mojito', 'moxito', 'мохито', 'коктейль'],
    juices: ['sharbat', 'juice', 'сок'],
    bubble: ['bubble tea'],
    shashlik: ['shashlik', 'шашлык'],
};

function getMenuAnswer(text) {
    const query = normalizeText(text);
    if (!query) return null;

    const matchingItems = CATEGORIES.flatMap((category) =>
        category.items
            .filter((item) => query.includes(normalizeText(item.name)))
            .map((item) => ({ ...item, categoryName: category.name }))
    );

    if (matchingItems.length > 0) {
        const distinctItems = matchingItems.filter(
            (item, index, list) =>
                list.findIndex((candidate) => candidate.id === item.id) === index
        );
        const lines = distinctItems.slice(0, 6).map(
            (item) =>
                `• <b>${esc(item.name)}</b> — ${item.price.toLocaleString('ru-RU')} soʻm` +
                (distinctItems.length > 1 ? ` <i>(${esc(item.categoryName)})</i>` : '')
        );
        const remaining = distinctItems.length - lines.length;

        return (
            `☕ <b>Menyudan topildi</b>\n\n${lines.join('\n')}` +
            (remaining > 0 ? `\nYana ${remaining} ta mos taom bor.` : '') +
            `\n\nNarxlar oʻzgarishi mumkin. Toʻliq menyu 👇`
        );
    }

    const categoryMatches = CATEGORIES.flatMap((category) => {
        const aliases = [
            category.name,
            ...(menuCategoryAliases[category.id] || []),
        ].map(normalizeText);
        return aliases
            .filter((alias) => alias && query.includes(alias))
            .map((alias) => ({ category, alias }));
    }).sort((a, b) => b.alias.length - a.alias.length);

    const category = categoryMatches[0]?.category;
    if (!category) return null;

    const shownItems = category.items.slice(0, 8);
    const lines = shownItems.map(
        (item) => `• ${esc(item.name)} — ${item.price.toLocaleString('ru-RU')} soʻm`
    );
    const remaining = category.items.length - shownItems.length;

    return (
        `☕ <b>${esc(category.name)}</b>\n\n${lines.join('\n')}` +
        (remaining > 0 ? `\n…yana ${remaining} ta taom bor.` : '') +
        `\n\nToʻliq menyu 👇`
    );
}

async function handleStart(chatId, firstName) {
    states.delete(chatId);
    await sendMessage(chatId, welcomeText(firstName), { reply_markup: mainKeyboard });
}

async function handleMenu(chatId) {
    await sendMessage(chatId, menuText(), {
        reply_markup: faqKeyboard,
    });
}

async function handleCall(chatId) {
    await sendMessage(chatId, contactText(), {
        reply_markup: {
            inline_keyboard: [[{ text: `📞 Qoʻngʻiroq ${PHONE}`, url: `tel:${PHONE.replace(/\s/g, '')}` }]],
        },
    });
}

async function handleAddress(chatId) {
    await sendLocation(chatId, LOCATION.lat, LOCATION.lng);
    await sendMessage(chatId, addressText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚗 Yandex marshrut', url: `https://yandex.uz/maps/?rtext=~${LOCATION.lat},${LOCATION.lng}&rtt=auto` }],
                [{ text: '🗺 Google Maps', url: `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}&travelmode=driving` }],
            ],
        },
    });
}

async function handleOrderStart(chatId) {
    setState(chatId, { step: 'category', data: { items: [] } });
    await sendMessage(
        chatId,
        `🛒 <b>Buyurtma berish</b>\n\n` +
        `Avval quyidagi tugmalar orqali kategoriya va taomlarni tanlang.\n` +
        `Taom qoʻshish uchun uning tugmasini bosing:`,
        { reply_markup: categoryKeyboard }
    );
}

function getOrderTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartSummary(items) {
    const total = getOrderTotal(items);
    const lines = items.map(
        (item) =>
            `• ${esc(item.name)} × ${item.quantity} — ` +
            `${(item.price * item.quantity).toLocaleString('ru-RU')} soʻm`
    );

    return (
        `🛒 <b>Savat</b>\n\n${lines.join('\n')}\n\n` +
        `💰 <b>Jami: ${total.toLocaleString('ru-RU')} soʻm</b>`
    );
}

async function beginCustomerDetails(chatId, state) {
    if (!state.data.items.length) {
        await sendMessage(
            chatId,
            `Savat hozircha boʻsh. Avval menyudan taom tanlang 👇`,
            { reply_markup: categoryKeyboard }
        );
        return;
    }

    await sendMessage(
        chatId,
        `${getCartSummary(state.data.items)}\n\n` +
        `Buyurtmani rasmiylashtirishni boshlaymiz.\n` +
        `1/4 qadam: ismingizni yozing:`,
        { reply_markup: cancelKeyboard }
    );
    setState(chatId, { step: 'name', data: state.data });
}

async function handleOrderStep(chatId, text, state, message) {
    const { step } = state;
    const data = { ...state.data };
    const normalized = normalizeText(text);

    if (text === '❌ Bekor qilish' || text === '🏠 Bosh menyu') {
        states.delete(chatId);
        await sendMessage(
            chatId,
            text === '🏠 Bosh menyu' ? 'Bosh menyu 👇' : 'Buyurtma bekor qilindi ❌',
            { reply_markup: mainKeyboard }
        );
        return;
    }

    if (step === 'category') {
        const category = CATEGORIES.find(
            (entry) => normalizeText(entry.name) === normalized
        );

        if (!category) {
            await sendMessage(
                chatId,
                `Iltimos, kategoriya tugmalaridan birini tanlang 👇`,
                { reply_markup: categoryKeyboard }
            );
            return;
        }

        await sendMessage(
            chatId,
            `☕ <b>${esc(category.name)}</b>\n\n` +
            `Qoʻshmoqchi boʻlgan taomingizni tanlang. ` +
            `Savat: ${data.items.length} xil taom.`,
            { reply_markup: getItemKeyboard(category) }
        );
        setState(chatId, { step: 'item', data: { ...data, categoryId: category.id } });
        return;
    }

    if (step === 'item') {
        if (text === '⬅️ Kategoriyalar' || text === '➕ Yana taom tanlash') {
            await sendMessage(chatId, `Kategoriyani tanlang 👇`, {
                reply_markup: categoryKeyboard,
            });
            setState(chatId, { step: 'category', data });
            return;
        }

        if (text === '🛒 Savat') {
            if (!data.items.length) {
                await sendMessage(chatId, `Savat hozircha boʻsh. Taom tanlang 👇`, {
                    reply_markup: getItemKeyboard(
                        CATEGORIES.find((entry) => entry.id === data.categoryId)
                    ),
                });
                return;
            }

            await sendMessage(chatId, getCartSummary(data.items), {
                reply_markup: getCartKeyboard,
            });
            setState(chatId, { step: 'cart', data });
            return;
        }

        if (text === '✅ Rasmiylashtirish') {
            await beginCustomerDetails(chatId, state);
            return;
        }

        const category = CATEGORIES.find((entry) => entry.id === data.categoryId);
        const item = category?.items.find(
            (entry) => getItemButtonText(entry) === text
        );

        if (!item) {
            await sendMessage(chatId, `Taomni quyidagi tugmalardan tanlang 👇`, {
                reply_markup: category ? getItemKeyboard(category) : categoryKeyboard,
            });
            return;
        }

        const selected = data.items.find((entry) => entry.id === item.id);
        const items = selected
            ? data.items.map((entry) =>
                entry.id === item.id
                    ? { ...entry, quantity: entry.quantity + 1 }
                    : entry
            )
            : [...data.items, {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
            }];

        await sendMessage(
            chatId,
            `✅ <b>${esc(item.name)}</b> savatga qoʻshildi.\n\n` +
            `${getCartSummary(items)}\n\n` +
            `Yana taom tanlang yoki rasmiylashtirishga oʻting 👇`,
            { reply_markup: getItemKeyboard(category) }
        );
        setState(chatId, { step: 'item', data: { ...data, items } });
        return;
    }

    if (step === 'cart') {
        if (text === '➕ Yana taom tanlash') {
            await sendMessage(chatId, `Kategoriyani tanlang 👇`, {
                reply_markup: categoryKeyboard,
            });
            setState(chatId, { step: 'category', data });
            return;
        }

        if (text === '✅ Rasmiylashtirish') {
            await beginCustomerDetails(chatId, state);
            return;
        }

        await sendMessage(chatId, `Savatdagi buyurtma 👇\n\n${getCartSummary(data.items)}`, {
            reply_markup: getCartKeyboard,
        });
        return;
    }

    if (step === 'name') {
        if (text.length < 2 || text.length > 80) {
            await sendMessage(chatId, 'Ismni 2–80 ta belgi bilan yozing, iltimos:', {
                reply_markup: cancelKeyboard,
            });
            return;
        }
        data.name = text;
        await sendMessage(
            chatId,
            `2/4 qadam: telefon raqamingizni yuboring.\n\nMasalan: +998 90 123 45 67`,
            {
                reply_markup: {
                    keyboard: [
                        [{ text: '📱 Telefon raqamni yuborish', request_contact: true }],
                        ...cancelKeyboard.keyboard,
                    ],
                    resize_keyboard: true,
                },
            }
        );
        setState(chatId, { step: 'phone', data });
        return;
    }
    if (step === 'phone') {
        const phone = message?.contact?.phone_number || text;
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 9 || digits.length > 15) {
            await sendMessage(chatId, '❌ Telefon raqami notoʻgʻri. Qaytadan kiriting:', {
                reply_markup: cancelKeyboard,
            });
            return;
        }
        data.phone = phone;
        await sendMessage(
            chatId,
            `3/4 qadam: yetkazish manzilini yozing yoki lokatsiyani yuboring 📍`,
            {
                reply_markup: {
                    keyboard: [
                        [{ text: '📍 Lokatsiyani yuborish', request_location: true }],
                        ...cancelKeyboard.keyboard,
                    ],
                    resize_keyboard: true,
                },
            }
        );
        setState(chatId, { step: 'address', data });
        return;
    }
    if (step === 'address') {
        if (text.trim().length < 5) {
            await sendMessage(chatId, 'Manzilni batafsilroq yozing yoki lokatsiyani yuboring 📍', {
                reply_markup: cancelKeyboard,
            });
            return;
        }
        data.address = text;
        await sendMessage(
            chatId,
            `4/4 qadam: buyurtmaga izoh bormi?\n` +
            `Masalan: shakarsiz, yetib kelganda qoʻngʻiroq qiling.\n` +
            `Izoh boʻlmasa «Yoʻq» deb yozing.`,
            { reply_markup: cancelKeyboard }
        );
        setState(chatId, { step: 'comment', data });
        return;
    }
    if (step === 'comment') {
        data.comment = ['yoq', "yo'q", 'нет', 'no'].includes(normalized) ? '' : text;

        const summary =
            `📋 <b>Buyurtma maʼlumotlari</b>\n\n` +
            `${getCartSummary(data.items)}\n\n` +
            `👤 Ism: ${esc(data.name)}\n` +
            `📞 Telefon: ${esc(data.phone)}\n` +
            `📍 Manzil: ${esc(data.address)}\n` +
            (data.coords ? `🗺 Koordinatalar: ${data.coords.lat.toFixed(6)}, ${data.coords.lng.toFixed(6)}\n` : '') +
            (data.comment ? `💬 Izoh: ${esc(data.comment)}\n` : '') +
            `\nTasdiqlaysizmi?`;

        await sendMessage(chatId, summary, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Tasdiqlash', callback_data: 'confirm_order' }],
                    [{ text: '❌ Bekor qilish', callback_data: 'cancel_order' }],
                ],
            },
        });
        setState(chatId, { step: 'confirm', data });
    }
}

async function sendOrderToAdmins(data, clientChatId, orderCode) {
    if (ADMIN_CHAT_IDS.length === 0) {
        throw new Error('TG_CHAT_IDS is not configured');
    }

    let routeBlock = '';
    let inlineKeyboard = null;
    if (data.coords) {
        const { lat, lng } = data.coords;
        const la = Number(lat).toFixed(6), ln = Number(lng).toFixed(6);
        routeBlock = `\n📍 <b>Marshrut</b>\nKoordinatalar: ${la}, ${ln}`;
        inlineKeyboard = {
            inline_keyboard: [[
                { text: '🚗 Yandex', url: `https://yandex.uz/maps/?rtext=~${la},${ln}&rtt=auto` },
                { text: '🗺 Google', url: `https://www.google.com/maps/dir/?api=1&destination=${la},${ln}&travelmode=driving` },
            ]],
        };
    }
    const text =
        `☕ <b>Yangi buyurtma — Telegram bot</b>\n` +
        `📥 <b>Manba:</b> Telegram bot\n\n` +
        `🔖 <b>Kod: ${orderCode}</b>\n\n` +
        `🛒 <b>Buyurtma tarkibi</b>\n` +
        `${data.items.map((item) =>
            `• ${esc(item.name)} × ${item.quantity} — ` +
            `${(item.price * item.quantity).toLocaleString('ru-RU')} soʻm`
        ).join('\n')}\n` +
        `💰 <b>Jami: ${getOrderTotal(data.items).toLocaleString('ru-RU')} soʻm</b>\n\n` +
        `👤 <b>Mijoz</b>\n` +
        `Ism: ${esc(data.name)}\n` +
        `Telefon: ${esc(data.phone)}\n` +
        `Manzil: ${esc(data.address)}\n` +
        (data.comment ? `Izoh: ${esc(data.comment)}\n` : '') +
        routeBlock +
        `\n💬 Chat ID: <code>${clientChatId}</code>\n` +
        `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`;

    await Promise.all(
        ADMIN_CHAT_IDS.map((chat_id) =>
            sendMessage(chat_id, text, {
                disable_web_page_preview: true,
                ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
            })
        )
    );
}

function getIntent(text) {
    const normalized = normalizeText(text);

    if (/(menu|menyu|taom|narx|price|цена|меню|блюд|coffee|kofe|чай|кофе)/.test(normalized)) return 'menu';
    if (/(buyurt|zakaz|order|заказ)/.test(normalized)) return 'order';
    if (/(yetkaz|dostav|delivery|достав)/.test(normalized)) return 'delivery';
    if (/(vaqt|qachon|ishlay|ochiq|yopiq|soat|график|время|работ)/.test(normalized)) return 'hours';
    if (/(manzil|adres|address|qayer|qaer|lokats|карта|адрес|где)/.test(normalized)) return 'address';
    if (/(aloqa|telefon|raqam|tel|qong|qo'ng|boglan|contact|call|number|номер|позвон|телефон|контакт)/.test(normalized)) return 'contact';
    if (
        ['salom', 'assalomu alaykum', 'hello', 'привет', 'здравствуйте'].some(
            (greeting) => normalized === greeting || normalized.startsWith(`${greeting} `)
        )
    ) return 'greeting';
    if (['yordam', 'help', 'помощь', 'меню'].includes(normalized)) return 'help';

    return null;
}

async function handleIntent(chatId, intent, firstName) {
    if (intent === 'menu') return handleMenu(chatId);
    if (intent === 'order') return handleOrderStart(chatId);
    if (intent === 'address') return handleAddress(chatId);
    if (intent === 'contact') return handleCall(chatId);
    if (intent === 'greeting') {
        await sendMessage(chatId, welcomeText(firstName), { reply_markup: mainKeyboard });
        return;
    }
    if (intent === 'hours') {
        await sendMessage(
            chatId,
            `🕐 <b>Ish vaqtimiz</b>\n\nHar kuni 09:00 dan 23:00 gacha ishlaymiz.\n\n` +
            `Manzil va yoʻnalish 👇`,
            { reply_markup: faqKeyboard }
        );
        return;
    }
    if (intent === 'delivery') {
        await sendMessage(
            chatId,
            `🛵 <b>Yetkazib berish</b>\n\n` +
            `Buyurtma berishda manzilingizni yoki lokatsiyangizni yuboring. ` +
            `Yetkazib berish imkoniyati va shartlarini manzil bo‘yicha operatorimiz aniqlashtiradi.`,
            { reply_markup: faqKeyboard }
        );
        return;
    }

    await sendMessage(chatId, helpText, { reply_markup: faqKeyboard });
}

function isValidWebhookSecret(received, expected) {
    if (!received || !expected) return false;
    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);
    return receivedBuffer.length === expectedBuffer.length &&
        timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(req) {
    try {
        const expectedSecret = process.env.TG_WEBHOOK_SECRET;
        if (
            expectedSecret &&
            !isValidWebhookSecret(
                req.headers.get('x-telegram-bot-api-secret-token'),
                expectedSecret
            )
        ) {
            return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
        }

        const update = await req.json();

        if (!update || typeof update !== 'object') {
            return NextResponse.json({ ok: false, error: 'Invalid update' }, { status: 400 });
        }

        const msg = update.message;
        if (msg?.chat?.id && msg.location) {
            const chatId = msg.chat.id;
            const state = getState(chatId);
            if (state && state.step === 'address') {
                const { latitude, longitude } = msg.location;
                state.data.address = '📍 Lokatsiya yuborildi';
                state.data.coords = { lat: latitude, lng: longitude };
                setState(chatId, { step: 'comment', data: state.data });
                await sendMessage(
                    chatId,
                    `4/4 qadam: buyurtmaga izoh bormi?\n` +
                    `Izoh boʻlmasa «Yoʻq» deb yozing.`,
                    { reply_markup: cancelKeyboard }
                );
            }
            return NextResponse.json({ ok: true });
        }

        if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message?.chat?.id;
            await answerCallback(cb.id);
            if (!chatId) return NextResponse.json({ ok: true });

            if (cb.data === 'start_order') {
                await handleOrderStart(chatId);
            } else if (cb.data === 'show_address') {
                await handleAddress(chatId);
            } else if (cb.data === 'confirm_order') {
                const state = getState(chatId);
                if (!state || state.step !== 'confirm') {
                    await sendMessage(
                        chatId,
                        'Sessiya buyurtmasi topilmadi yoki eskirdi. /order buyrugʻi bilan qayta boshlang.',
                        { reply_markup: mainKeyboard }
                    );
                } else {
                    const code = String(Math.floor(100000 + Math.random() * 900000));
                    await sendOrderToAdmins(state.data, chatId, code);
                    states.delete(chatId);
                    await sendMessage(
                        chatId,
                        `✅ <b>Buyurtma qabul qilindi!</b>\n\n` +
                        `🔖 Buyurtma kodi: <b>${code}</b>\n\n` +
                        `Operatorimiz siz bilan bogʻlanadi.\n` +
                        `Shoshilinch savol boʻlsa: ${PHONE}`,
                        { reply_markup: mainKeyboard }
                    );
                }
            } else if (cb.data === 'cancel_order') {
                states.delete(chatId);
                await sendMessage(chatId, 'Buyurtma bekor qilindi ❌', { reply_markup: mainKeyboard });
            }
            return NextResponse.json({ ok: true });
        }

        if (!msg?.chat?.id) return NextResponse.json({ ok: true });

        const chatId = msg.chat.id;
        const text = String(msg.text || '').trim();
        const firstName = msg.from?.first_name || 'doʻstim';
        const command = text.split(/\s/, 1)[0].split('@')[0].toLowerCase();
        const orderState = getState(chatId);

        if (command === '/start') await handleStart(chatId, firstName);
        else if (command === '/menu') await handleMenu(chatId);
        else if (command === '/contact') await handleCall(chatId);
        else if (command === '/address') await handleAddress(chatId);
        else if (command === '/order') await handleOrderStart(chatId);
        else if (command === '/help') await sendMessage(chatId, helpText, { reply_markup: faqKeyboard });
        else if (command === '/cancel') {
            states.delete(chatId);
            await sendMessage(chatId, 'Buyurtma bekor qilindi ❌', { reply_markup: mainKeyboard });
        }
        else if (text === '☕ Menyu') await handleMenu(chatId);
        else if (text === '🛒 Buyurtma berish') await handleOrderStart(chatId);
        else if (text === '📞 Qoʻngʻiroq') await handleCall(chatId);
        else if (text === '📍 Manzil') await handleAddress(chatId);
        else if (text === '🏠 Bosh menyu') {
            states.delete(chatId);
            await sendMessage(chatId, welcomeText(firstName), { reply_markup: mainKeyboard });
        }
        else if (orderState) {
            await handleOrderStep(chatId, text, orderState, msg);
        }
        else if (!text && msg.contact?.phone_number) {
            await sendMessage(
                chatId,
                'Telefon raqamingizni qabul qildim. Buyurtma berish uchun tugmani bosing 👇',
                { reply_markup: mainKeyboard }
            );
        }
        else {
            const menuAnswer = getMenuAnswer(text);
            if (menuAnswer) {
                await sendMessage(chatId, menuAnswer, { reply_markup: faqKeyboard });
            } else {
                const intent = getIntent(text);
                if (intent) {
                    await handleIntent(chatId, intent, firstName);
                } else {
                    await sendMessage(
                        chatId,
                        `Savolingizni toʻliqroq yozing — yordam beraman 😊\n\n${helpText}`,
                        { reply_markup: faqKeyboard }
                    );
                }
            }
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[telegram webhook] update failed:', err);
        return NextResponse.json({ ok: false, error: 'Webhook processing failed' }, { status: 500 });
    }
}

export async function GET() {
    const configured = Boolean(TOKEN && ADMIN_CHAT_IDS.length > 0);
    return NextResponse.json(
        {
            ok: configured,
            service: 'coffee-fresh-webhook',
            configured,
            webhookSecretEnabled: Boolean(process.env.TG_WEBHOOK_SECRET),
        },
        { status: configured ? 200 : 503 }
    );
}