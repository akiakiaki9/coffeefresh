// src/app/api/order/route.js
import { NextResponse } from 'next/server';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefresh.uz';

export async function POST(req) {
  try {
    const { items, total, customer, coords } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Корзина пуста' }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { ok: false, error: 'Не хватает данных клиента' },
        { status: 400 }
      );
    }

    const token = process.env.TG_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) {
      console.error('[order] TG_TOKEN или TG_CHAT_ID не заданы');
      return NextResponse.json(
        { ok: false, error: 'Сервер не настроен' },
        { status: 500 }
      );
    }

    // ===== Состав заказа (текст) =====
    const lines = items
      .map(
        (i) =>
          `• ${esc(i.name)} × ${i.qty} — ${(i.price * i.qty).toLocaleString('ru-RU')} сум`
      )
      .join('\n');

    // ===== Маршрут =====
    let routeBlock = '';
    let inlineKeyboard = null;

    if (coords?.lat && coords?.lng) {
      const lat = Number(coords.lat).toFixed(6);
      const lng = Number(coords.lng).toFixed(6);
      const yandexRoute = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;
      const googleRoute = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

      routeBlock = `\n📍 <b>Маршрут до клиента</b>\nКоординаты: ${lat}, ${lng}`;
      inlineKeyboard = {
        inline_keyboard: [
          [
            { text: '🚗 Яндекс.Карты', url: yandexRoute },
            { text: '🗺 Google Maps', url: googleRoute },
          ],
        ],
      };
    } else if (customer.address) {
      // если нет координат, но есть адрес — отправляем ссылку на поиск по адресу
      const q = encodeURIComponent(customer.address);
      inlineKeyboard = {
        inline_keyboard: [
          [{ text: '🔎 Найти адрес', url: `https://yandex.uz/maps/?text=${q}` }],
        ],
      };
    }

    // ===== Фото товаров =====
    // Telegram sendMediaGroup требует 2–10 фото с одинаковым типом.
    // Если фото только одно — отправляем sendPhoto, если несколько — mediaGroup.
    const photos = items
      .filter((i) => i.image)
      .map((i) => ({
        type: 'photo',
        media: i.image.startsWith('http') ? i.image : `${SITE_URL}${i.image}`,
        caption: `${esc(i.name)} × ${i.qty}`,
        parse_mode: 'HTML',
      }));

    // ===== Текст уведомления =====
    const text = [
      '☕ <b>Новый заказ Coffee Fresh</b>',
      '',
      '👤 <b>Клиент</b>',
      `Имя: ${esc(customer.name)}`,
      `Телефон: ${esc(customer.phone)}`,
      customer.address ? `Адрес: ${esc(customer.address)}` : null,
      customer.comment ? `Комментарий: ${esc(customer.comment)}` : null,
      routeBlock || null,
      '',
      '🛒 <b>Состав заказа</b>',
      lines,
      '',
      `💰 <b>Итого: ${Number(total).toLocaleString('ru-RU')} сум</b>`,
      '',
      `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    const tgSend = async (method, body) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.json();
    };

    // 1) Фото товаров (если есть)
    if (photos.length >= 2) {
      // sendMediaGroup поддерживает 2..10 элементов
      const group = photos.slice(0, 10);
      await tgSend('sendMediaGroup', {
        chat_id: chatId,
        media: group,
      });
    } else if (photos.length === 1) {
      await tgSend('sendPhoto', {
        chat_id: chatId,
        photo: photos[0].media,
        caption: photos[0].caption,
        parse_mode: 'HTML',
      });
    }

    // 2) Основное сообщение с составом и маршрутом
    const tgRes = await tgSend('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
    });

    if (!tgRes.ok) {
      console.error('[order] Telegram error:', tgRes);
      return NextResponse.json(
        { ok: false, error: 'Не удалось отправить в Telegram' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[order] fatal:', err);
    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}