"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const OrderHistoryContext = createContext(null);
const STORAGE_KEY = 'cf_orders_v2';
const TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function OrderHistoryProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            const now = Date.now();
            const fresh = parsed.filter((o) => now - o.createdAt < TTL_MS);
            setOrders(fresh);
            if (fresh.length !== parsed.length) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
            }
        } catch { }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch { }
    }, [orders, hydrated]);

    const addOrder = (order) => {
        const entry = {
            id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            createdAt: Date.now(),
            status: 'ok',
            ...order,
        };
        setOrders((prev) => [entry, ...prev]);
        return entry;
    };

    const clearHistory = () => setOrders([]);

    return (
        <OrderHistoryContext.Provider value={{ orders, addOrder, clearHistory }}>
            {children}
        </OrderHistoryContext.Provider>
    );
}

export function useOrderHistory() {
    const ctx = useContext(OrderHistoryContext);
    if (!ctx) throw new Error('useOrderHistory must be used within OrderHistoryProvider');
    return ctx;
}