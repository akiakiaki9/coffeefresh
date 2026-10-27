import { NextResponse } from 'next/server';

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefresh.uz';
const ADMIN_CHATS = (process.env.TG_CHAT_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

const generateOrderCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export async function POST(req) {
  try {
    const { items, total, customer, coords } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Savat boʻsh' }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { ok: false, error: 'Mijoz maʼlumotlari yetarli emas' },
        { status: 400 }
      );
    }

    const token = process.env.TG_TOKEN;
    if (!token || ADMIN_CHATS.length === 0) {
      return NextResponse.json({ ok: false, error: 'Server sozlanmagan' }, { status: 500 });
    }

    const orderCode = generateOrderCode();

    const lines = items
      .map((i) => `• ${esc(i.name)} × ${i.qty} — ${(i.price * i.qty).toLocaleString('ru-RU')} soʻm`)
      .join('\n');

    let routeBlock = '';
    let inlineKeyboard = null;
    if (coords?.lat && coords?.lng) {
      const lat = Number(coords.lat).toFixed(6);
      const lng = Number(coords.lng).toFixed(6);
      routeBlock = `\n📍 <b>Mijozgacha marshrut</b>\nKoordinatalar: ${lat}, ${lng}`;
      inlineKeyboard = {
        inline_keyboard: [[
          { text: '🚗 Yandex', url: `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto` },
          { text: '🗺 Google', url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving` },
        ]],
      };
    } else if (customer.address) {
      const q = encodeURIComponent(customer.address);
      inlineKeyboard = {
        inline_keyboard: [[{ text: '🔎 Manzilni topish', url: `https://yandex.uz/maps/?text=${q}` }]],
      };
    }

    const photos = items.filter((i) => i.image).map((i) => ({
      type: 'photo',
      media: i.image.startsWith('http') ? i.image : `${SITE_URL}${i.image}`,
      caption: `${esc(i.name)} × ${i.qty}`,
      parse_mode: 'HTML',
    }));

    const text = [
      `☕ <b>Yangi buyurtma — Coffee Fresh</b>`,
      ``,
      `🔖 <b>Kod: ${orderCode}</b>`,
      ``,
      `👤 <b>Mijoz</b>`,
      `Ism: ${esc(customer.name)}`,
      `Telefon: ${esc(customer.phone)}`,
      customer.telegram ? `Telegram: ${esc(customer.telegram)}` : null,
      customer.address ? `Manzil: ${esc(customer.address)}` : null,
      customer.comment ? `Izoh: ${esc(customer.comment)}` : null,
      routeBlock || null,
      ``,
      `🛒 <b>Buyurtma tarkibi</b>`,
      lines,
      ``,
      `💰 <b>Jami: ${Number(total).toLocaleString('ru-RU')} soʻm</b>`,
      ``,
      `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`,
    ].filter(Boolean).join('\n');

    const tgSend = async (method, body) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.json();
    };

    const sendAll = async (method, body) => {
      const results = await Promise.all(
        ADMIN_CHATS.map((chat_id) => tgSend(method, { chat_id, ...body }))
      );
      return results;
    };

    if (photos.length >= 2) {
      await sendAll('sendMediaGroup', { media: photos.slice(0, 10) });
    } else if (photos.length === 1) {
      await sendAll('sendPhoto', {
        photo: photos[0].media,
        caption: photos[0].caption,
        parse_mode: 'HTML',
      });
    }

    const results = await sendAll('sendMessage', {
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
    });

    const allOk = results.every((r) => r.ok);
    if (!allOk) {
      console.error('[order] baʼzi chatlarga yuborilmadi', results);
    }

    // Ответ клиенту с кодом
    return NextResponse.json({ ok: true, orderCode });
  } catch (err) {
    console.error('[order] fatal:', err);
    return NextResponse.json({ ok: false, error: 'Server xatosi' }, { status: 500 });
  }
}