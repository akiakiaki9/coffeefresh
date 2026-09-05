// app/api/send-feedback/route.js
export async function POST(request) {
    try {
        const data = await request.json();

        const token = '7795166334:AAE_Z5f-2tNFI3Vpmzus7ej3vcgInrPjA2Q';
        const chatId = '1514969983';

        const ratingEmojis = {
            1: '😡',
            2: '😞',
            3: '😐',
            4: '😊',
            5: '❤️'
        };

        const categoryLabels = {
            quality: 'Качество еды',
            service: 'Обслуживание',
            delivery: 'Доставка',
            price: 'Цены',
            atmosphere: 'Атмосфера',
            other: 'Другое'
        };

        const message = `
📝 <b>НОВЫЙ ОТЗЫВ</b>

👤 <b>Имя:</b> ${data.isAnonymous ? 'Анонимно' : data.name || 'Не указано'}
📞 <b>Телефон:</b> ${data.phone || 'Не указан'}
📧 <b>Email:</b> ${data.email || 'Не указан'}

⭐ <b>Оценка:</b> ${data.rating}/5 ${ratingEmojis[data.rating] || ''}
📂 <b>Категория:</b> ${categoryLabels[data.category] || data.category}

💬 <b>Сообщение:</b>
${data.message || 'Не указано'}

🕐 <b>Время:</b> ${data.date}

${data.isAnonymous ? '🔒 Отправлено анонимно' : ''}
        `;

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            }),
        });

        if (response.ok) {
            return Response.json({ success: true });
        } else {
            const error = await response.text();
            console.error('Telegram error:', error);
            return Response.json({ success: false, error }, { status: 500 });
        }
    } catch (error) {
        console.error('Feedback error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}