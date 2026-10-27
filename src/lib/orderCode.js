export function generateOrderCode() {
    // 6-значный код без ведущих нулей
    const n = Math.floor(100000 + Math.random() * 900000);
    return String(n);
}