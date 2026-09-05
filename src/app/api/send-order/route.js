// app/api/send-order/route.js

export async function POST(request) {
    try {
        const order = await request.json();

        // Замените на свои данные
        const token = '7795166334:AAE_Z5f-2tNFI3Vpmzus7ej3vcgInrPjA2Q';
        const chatIds = ['1514969983', ''];

        // Координаты вашего кафе (замените на свои)
        const CAFE_LAT = 40.101068;
        const CAFE_LNG = 64.681580;

        // Строим ссылки на карты с маршрутом от кафе до клиента
        const googleMapsLink = order.location 
            ? `https://www.google.com/maps/dir/${CAFE_LAT},${CAFE_LNG}/${order.location.lat},${order.location.lng}/`
            : `https://www.google.com/maps/dir/${CAFE_LAT},${CAFE_LNG}/search/${encodeURIComponent(order.address)}/`;

        const yandexMapsLink = order.location
            ? `https://yandex.uz/maps/?rtext=${CAFE_LAT}%2C${CAFE_LNG}~${order.location.lat}%2C${order.location.lng}&rtt=auto`
            : `https://yandex.uz/maps/?text=${encodeURIComponent(order.address)}`;

        const message = `
🆕 <b>НОВЫЙ ЗАКАЗ</b>

📋 <b>Состав заказа:</b>
${order.items.map((i, idx) =>
            `${idx + 1}. ${i.name} × ${i.quantity} = ${i.price * i.quantity} сум`
        ).join('\n')}

💰 <b>Итого:</b> ${order.total} сум

📍 <b>Адрес доставки:</b> ${order.address}
📌 <b>Координаты:</b> ${order.location ? `${order.location.lat}, ${order.location.lng}` : 'Не определены'}

📞 <b>Телефон:</b> ${order.phone}
🕐 <b>Время заказа:</b> ${order.date}

🗺️ <b>Маршрут до клиента:</b>
• <a href="${googleMapsLink}">Google Maps</a>
• <a href="${yandexMapsLink}">Яндекс Карты</a>

Спасибо за заказ! ☕
        `;

        // Отправляем сообщения во все чаты
        const results = await Promise.allSettled(chatIds.map(chatId =>
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false
                }),
            })
        ));

        // Проверяем результаты
        let successCount = 0;
        let errorMessages = [];

        for (const [index, result] of results.entries()) {
            if (result.status === 'fulfilled') {
                const response = result.value;
                if (response.ok) {
                    successCount++;
                } else {
                    try {
                        const errorData = await response.text();
                        errorMessages.push(`Chat ${chatIds[index]}: ${errorData}`);
                    } catch {
                        errorMessages.push(`Chat ${chatIds[index]}: Unknown error`);
                    }
                }
            } else {
                errorMessages.push(`Chat ${chatIds[index]}: ${result.reason}`);
            }
        }

        // Если хотя бы один чат получил сообщение - считаем успехом
        if (successCount > 0) {
            console.log(`✅ Заказ отправлен в ${successCount} из ${chatIds.length} чатов`);
            
            // Если есть ошибки, логируем их но не прерываем ответ
            if (errorMessages.length > 0) {
                console.warn('⚠️ Частичные ошибки:', errorMessages);
                return Response.json({ 
                    success: true, 
                    warning: `Отправлено в ${successCount} чатов, ошибки в ${errorMessages.length}` 
                }, { status: 200 });
            }
            
            return Response.json({ success: true }, { status: 200 });
        }

        // Если ни один чат не получил сообщение - ошибка
        console.error('❌ Все отправки провалились:', errorMessages);
        return Response.json({ 
            success: false, 
            error: 'Не удалось отправить заказ в Telegram',
            details: errorMessages 
        }, { status: 500 });

    } catch (error) {
        console.error('Order error:', error);
        return Response.json({ 
            success: false, 
            error: error.message || 'Внутренняя ошибка сервера' 
        }, { status: 500 });
    }
}