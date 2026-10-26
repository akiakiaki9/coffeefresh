// src/app/api/telegram/webhook/route.js
import { NextResponse } from 'next/server';

const TOKEN = process.env.TG_TOKEN;
const ADMIN_CHAT_ID = process.env.TG_CHAT_ID;

const states = new Map();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefresh.uz';
const PHONE = '+998 91 885 99 99';
const LOCATION = { lat: 40.088606, lng: 64.676131 };
const ADDRESS_STR = 'Гиждуван, Узбекистан';

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

const answerCallback = (callback_query_id) =>
    tg('answerCallbackQuery', { callback_query_id });

const esc = (s) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const mainKeyboard = {
    keyboard: [
        [{ text: '☕ Меню' }, { text: '🛒 Сделать заказ' }],
        [{ text: '📞 Позвонить' }, { text: '📍 Адрес' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
};

const cancelKeyboard = {
    keyboard: [[{ text: '❌ Отменить' }]],
    resize_keyboard: true,
};

const welcomeText = (name) =>
    `Привет, <b>${esc(name)}</b>! 👋\n\n` +
    `Это бот <b>Coffee Fresh</b> ☕🍰\n\n` +
    `Свежий кофе, десерты и авторские блюда в Гиждуване.\n` +
    `Выберите действие — кнопки внизу 👇`;

const menuText = () =>
    `☕ <b>Наше меню</b>\n\n` +
    `Кофе, десерты и горячие блюда — готовим с любовью.\n\n` +
    `👉 Открыть меню: ${SITE_URL}/menu`;

const contactText = () =>
    `📞 <b>Связаться с нами</b>\n\n` +
    `${PHONE}\n\n` +
    `🕐 Ежедневно 09:00 – 23:00`;

const addressText = () =>
    `📍 <b>Мы находимся здесь</b>\n\n` +
    `${ADDRESS_STR}\n\n` +
    `Нажмите кнопку ниже, чтобы построить маршрут 👇`;

async function handleStart(chatId, firstName) {
    states.delete(chatId);
    await sendMessage(chatId, welcomeText(firstName), { reply_markup: mainKeyboard });
}

async function handleMenu(chatId) {
    await sendMessage(chatId, menuText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: '☕ Открыть меню', url: `${SITE_URL}/menu` }],
                [{ text: '🛒 Сделать заказ', callback_data: 'start_order' }],
            ],
        },
    });
}

async function handleCall(chatId) {
    await sendMessage(chatId, contactText(), {
        reply_markup: {
            inline_keyboard: [
                [{ text: `📞 Позвонить ${PHONE}`, url: `tel:${PHONE.replace(/\s/g, '')}` }],
            ],
        },
    });
}

async function handleAddress(chatId) {
    await sendLocation(chatId, LOCATION.lat, LOCATION.lng);
    await sendMessage(chatId, addressText(), {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🚗 Маршрут в Яндекс.Картах',
                        url: `https://yandex.uz/maps/?rtext=~${LOCATION.lat},${LOCATION.lng}&rtt=auto`,
                    },
                ],
                [
                    {
                        text: '🗺 Google Maps',
                        url: `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}&travelmode=driving`,
                    },
                ],
            ],
        },
    });
}

async function handleOrderStart(chatId) {
    states.set(chatId, { step: 'name', data: {} });
    await sendMessage(
        chatId,
        `🛒 <b>Оформление заказа</b>\n\n` +
        `Шаг 1 из 4: как к вам обращаться?\n\nНапишите имя:`,
        { reply_markup: cancelKeyboard }
    );
}

async function handleOrderStep(chatId, text, state) {
    const { step, data } = state;

    if (text === '❌ Отменить') {
        states.delete(chatId);
        await sendMessage(chatId, 'Заказ отменён ❌', { reply_markup: mainKeyboard });
        return;
    }

    if (step === 'name') {
        data.name = text;
        states.set(chatId, { step: 'phone', data });
        await sendMessage(chatId, `Шаг 2 из 4: ваш номер телефона?\n\nНапример: +998901234567`);
        return;
    }

    if (step === 'phone') {
        const digits = text.replace(/\D/g, '');
        if (digits.length < 9) {
            await sendMessage(chatId, '❌ Неверный формат. Введите номер ещё раз:');
            return;
        }
        data.phone = text;
        states.set(chatId, { step: 'address', data });
        await sendMessage(
            chatId,
            `Шаг 3 из 4: адрес доставки?\n\nНапишите адрес или отправьте свою локацию 📍`
        );
        return;
    }

    if (step === 'address') {
        data.address = text;
        states.set(chatId, { step: 'comment', data });
        await sendMessage(
            chatId,
            `Шаг 4 из 4: комментарий к заказу?\n\n` +
            `Например: без сахара, позвонить за 5 минут.\n` +
            `Или напишите <b>«нет»</b>, если комментария нет.`
        );
        return;
    }

    if (step === 'comment') {
        data.comment = text === 'нет' ? '' : text;
        states.set(chatId, { step: 'confirm', data });

        const summary =
            `📋 <b>Проверьте данные заказа</b>\n\n` +
            `👤 Имя: ${esc(data.name)}\n` +
            `📞 Телефон: ${esc(data.phone)}\n` +
            `📍 Адрес: ${esc(data.address)}\n` +
            (data.coords
                ? `🗺 Координаты: ${data.coords.lat.toFixed(6)}, ${data.coords.lng.toFixed(6)}\n`
                : '') +
            (data.comment ? `💬 Комментарий: ${esc(data.comment)}\n` : '') +
            `\nВсё верно?`;

        await sendMessage(chatId, summary, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Подтвердить', callback_data: 'confirm_order' }],
                    [{ text: '❌ Отменить', callback_data: 'cancel_order' }],
                ],
            },
        });
    }
}

async function sendOrderToAdmin(data, clientChatId) {
    let routeBlock = '';
    let inlineKeyboard = null;

    if (data.coords) {
        const { lat, lng } = data.coords;
        const la = Number(lat).toFixed(6);
        const ln = Number(lng).toFixed(6);
        routeBlock = `\n📍 <b>Маршрут</b>\nКоординаты: ${la}, ${ln}`;
        inlineKeyboard = {
            inline_keyboard: [
                [
                    {
                        text: '🚗 Яндекс.Карты',
                        url: `https://yandex.uz/maps/?rtext=~${la},${ln}&rtt=auto`,
                    },
                    {
                        text: '🗺 Google Maps',
                        url: `https://www.google.com/maps/dir/?api=1&destination=${la},${ln}&travelmode=driving`,
                    },
                ],
            ],
        };
    }

    const text =
        `☕ <b>Новый заказ из Telegram</b>\n\n` +
        `👤 <b>Клиент</b>\n` +
        `Имя: ${esc(data.name)}\n` +
        `Телефон: ${esc(data.phone)}\n` +
        `Адрес: ${esc(data.address)}\n` +
        (data.comment ? `Комментарий: ${esc(data.comment)}\n` : '') +
        routeBlock +
        `\n💬 Chat ID клиента: <code>${clientChatId}</code>\n` +
        `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`;

    await sendMessage(ADMIN_CHAT_ID, text, {
        disable_web_page_preview: true,
        ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
    });
}

export async function POST(req) {
    try {
        const update = await req.json();

        // ===== Геолокация от клиента =====
        if (update.message?.location) {
            const chatId = update.message.chat.id;
            const state = states.get(chatId);
            if (state && state.step === 'address') {
                const { latitude, longitude } = update.message.location;
                state.data.address = `📍 Геолокация: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                state.data.coords = { lat: latitude, lng: longitude };
                states.set(chatId, { step: 'comment', data: state.data });
                await sendMessage(
                    chatId,
                    `Шаг 4 из 4: комментарий к заказу?\n\nИли напишите <b>«нет»</b>:`
                );
            }
            return NextResponse.json({ ok: true });
        }

        // ===== Callback (inline-кнопки) =====
        if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message.chat.id;
            await answerCallback(cb.id);

            if (cb.data === 'start_order') {
                await handleOrderStart(chatId);
            } else if (cb.data === 'confirm_order') {
                const state = states.get(chatId);
                if (!state || state.step !== 'confirm') {
                    await sendMessage(chatId, 'Сессия истекла. Начните заново: /start');
                    return NextResponse.json({ ok: true });
                }
                await sendOrderToAdmin(state.data, chatId);
                states.delete(chatId);
                await sendMessage(
                    chatId,
                    `✅ <b>Заказ принят!</b>\n\n` +
                    `Мы свяжемся с вами для подтверждения.\n` +
                    `Если что-то срочно — звоните: ${PHONE}`,
                    { reply_markup: mainKeyboard }
                );
            } else if (cb.data === 'cancel_order') {
                states.delete(chatId);
                await sendMessage(chatId, 'Заказ отменён ❌', { reply_markup: mainKeyboard });
            }
            return NextResponse.json({ ok: true });
        }

        // ===== Текстовые сообщения =====
        const msg = update.message;
        if (!msg?.text) return NextResponse.json({ ok: true });

        const chatId = msg.chat.id;
        const text = msg.text.trim();
        const firstName = msg.from?.first_name || 'друг';

        if (text === '/start') return handleStart(chatId, firstName);
        if (text === '/menu') return handleMenu(chatId);
        if (text === '/contact') return handleCall(chatId);
        if (text === '/address') return handleAddress(chatId);
        if (text === '/order') return handleOrderStart(chatId);

        if (text === '☕ Меню') return handleMenu(chatId);
        if (text === '🛒 Сделать заказ') return handleOrderStart(chatId);
        if (text === '📞 Позвонить') return handleCall(chatId);
        if (text === '📍 Адрес') return handleAddress(chatId);

        const state = states.get(chatId);
        if (state) {
            await handleOrderStep(chatId, text, state);
            return NextResponse.json({ ok: true });
        }

        await sendMessage(
            chatId,
            `Не понял 🤔\n\nПожалуйста, воспользуйтесь кнопками внизу 👇`,
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