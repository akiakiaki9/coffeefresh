import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;
const ADMIN_CHAT_IDS = (process.env.TG_CHAT_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

const states = new Map();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefresh.uz';
const PHONE = '+998 91 885 99 99';
const LOCATION = { lat: 40.088606, lng: 64.676131 };
const ADDRESS_STR = 'Gʻijduvon, Oʻzbekiston';

async function tg(method, body) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
}

const sendMessage = (chat_id, text, extra = {}) =>
    tg('sendMessage', { chat_id, text, parse_mode: 'HTML', ...extra });
const sendLocation = (chat_id, lat, lng) =>
    tg('sendLocation', { chat_id, latitude: lat, longitude: lng });
const answerCallback = (id) => tg('answerCallbackQuery', { callback_query_id: id });
const esc = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const mainKeyboard = {
    keyboard: [
        [{ text: '☕ Menyu' }, { text: '🛒 Buyurtma berish' }],
        [{ text: '📞 Qoʻngʻiroq' }, { text: '📍 Manzil' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
};

const cancelKeyboard = {
    keyboard: [[{ text: '❌ Bekor qilish' }]],
    resize_keyboard: true,
};

const welcomeText = (name) =>
    `Salom, <b>${esc(name)}</b>! 👋\n\n` +
    `Bu <b>Coffee Fresh</b> boti ☕🍰\n\n` +
    `Gʻijduvondagi yangi qahva, shirinliklar va mualliflik taomlari.\n` +
    `Kerakli boʻlimni tanlang — pastdagi tugmalar 👇`;

const menuText = () =>
    `☕ <b>Bizning menyu</b>\n\n` +
    `Qahva, shirinliklar va issiq taomlar — har kuni yangi tayyorlaymiz.\n\n` +
    `👉 Menyuni ochish: ${SITE_URL}/menu`;

const contactText = () =>
    `📞 <b>Biz bilan bogʻlanish</b>\n\n${PHONE}\n\n🕐 Har kuni 09:00 – 23:00`;

const addressText = () =>
    `📍 <b>Biz shu yerdamiz</b>\n\n${ADDRESS_STR}\n\nQuyidagi tugma orqali marshrut quring 👇`;

async function handleStart(chatId, firstName) {
    states.delete(chatId);
    await sendMessage(chatId, welcomeText(firstName), { reply_markup: mainKeyboard });
}

async function handleMenu(chatId) {
    await sendMessage(chatId, menuText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: '☕ Menyuni ochish', url: `${SITE_URL}/menu` }],
                [{ text: '🛒 Buyurtma berish', callback_data: 'start_order' }],
            ],
        },
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
    states.set(chatId, { step: 'name', data: {} });
    await sendMessage(
        chatId,
        `🛒 <b>Buyurtma berish</b>\n\n` +
        `1/4 qadam: ismingizni yozing:`,
        { reply_markup: cancelKeyboard }
    );
}

async function handleOrderStep(chatId, text, state) {
    const { step, data } = state;

    if (text === '❌ Bekor qilish') {
        states.delete(chatId);
        await sendMessage(chatId, 'Buyurtma bekor qilindi ❌', { reply_markup: mainKeyboard });
        return;
    }

    if (step === 'name') {
        data.name = text;
        states.set(chatId, { step: 'phone', data });
        await sendMessage(chatId, `2/4 qadam: telefon raqamingiz?\n\nMasalan: +998901234567`);
        return;
    }
    if (step === 'phone') {
        if (text.replace(/\D/g, '').length < 9) {
            await sendMessage(chatId, '❌ Format xato. Qaytadan kiriting:');
            return;
        }
        data.phone = text;
        states.set(chatId, { step: 'address', data });
        await sendMessage(chatId, `3/4 qadam: yetkazish manzili?\n\nManzil yoki lokatsiya yuboring 📍`);
        return;
    }
    if (step === 'address') {
        data.address = text;
        states.set(chatId, { step: 'comment', data });
        await sendMessage(chatId, `4/4 qadam: izoh?\n\nMasalan: shakarsiz, 5 daqiqada qoʻngʻiroq qiling.\nAgar izoh yoʻq boʻlsa <b>«yoʻq»</b> deb yozing.`);
        return;
    }
    if (step === 'comment') {
        data.comment = text === 'yoʻq' ? '' : text;
        states.set(chatId, { step: 'confirm', data });

        const summary =
            `📋 <b>Buyurtma maʼlumotlari</b>\n\n` +
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
    }
}

async function sendOrderToAdmins(data, clientChatId, orderCode) {
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
        `☕ <b>Yangi buyurtma — Telegram</b>\n\n` +
        `🔖 <b>Kod: ${orderCode}</b>\n\n` +
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

export async function POST(req) {
    try {
        const update = await req.json();

        if (update.message?.location) {
            const chatId = update.message.chat.id;
            const state = states.get(chatId);
            if (state && state.step === 'address') {
                const { latitude, longitude } = update.message.location;
                state.data.address = `📍 Lokatsiya: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                state.data.coords = { lat: latitude, lng: longitude };
                states.set(chatId, { step: 'comment', data: state.data });
                await sendMessage(chatId, `4/4 qadam: izoh?\n\nYoki <b>«yoʻq»</b> deb yozing:`);
            }
            return NextResponse.json({ ok: true });
        }

        if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message.chat.id;
            await answerCallback(cb.id);

            if (cb.data === 'start_order') {
                await handleOrderStart(chatId);
            } else if (cb.data === 'confirm_order') {
                const state = states.get(chatId);
                if (!state || state.step !== 'confirm') {
                    await sendMessage(chatId, 'Sessiya tugadi. /start dan boshlang');
                    return NextResponse.json({ ok: true });
                }
                const code = String(Math.floor(100000 + Math.random() * 900000));
                await sendOrderToAdmins(state.data, chatId, code);
                states.delete(chatId);
                await sendMessage(
                    chatId,
                    `✅ <b>Buyurtma qabul qilindi!</b>\n\n` +
                    `🔖 Buyurtma kodi: <b>${code}</b>\n\n` +
                    `Tasdiqlash uchun siz bilan bogʻlanamiz.\n` +
                    `Shoshilinch savol boʻlsa: ${PHONE}`,
                    { reply_markup: mainKeyboard }
                );
            } else if (cb.data === 'cancel_order') {
                states.delete(chatId);
                await sendMessage(chatId, 'Buyurtma bekor qilindi ❌', { reply_markup: mainKeyboard });
            }
            return NextResponse.json({ ok: true });
        }

        const msg = update.message;
        if (!msg?.text) return NextResponse.json({ ok: true });

        const chatId = msg.chat.id;
        const text = msg.text.trim();
        const firstName = msg.from?.first_name || 'doʻstim';

        if (text === '/start') return handleStart(chatId, firstName);
        if (text === '/menu') return handleMenu(chatId);
        if (text === '/contact') return handleCall(chatId);
        if (text === '/address') return handleAddress(chatId);
        if (text === '/order') return handleOrderStart(chatId);

        if (text === '☕ Menyu') return handleMenu(chatId);
        if (text === '🛒 Buyurtma berish') return handleOrderStart(chatId);
        if (text === '📞 Qoʻngʻiroq') return handleCall(chatId);
        if (text === '📍 Manzil') return handleAddress(chatId);

        const state = states.get(chatId);
        if (state) {
            await handleOrderStep(chatId, text, state);
            return NextResponse.json({ ok: true });
        }

        await sendMessage(
            chatId,
            `Tushunmadim 🤔\n\nPastdagi tugmalardan foydalaning 👇`,
            { reply_markup: mainKeyboard }
        );
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[telegram webhook] error:', err);
        return NextResponse.json({ ok: true });
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, service: 'coffee-fresh-webhook' });
}