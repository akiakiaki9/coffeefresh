"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import OrderHistoryDrawer from '@/components/OrderHistory/OrderHistoryDrawer';
import OrderResultModal from '@/components/OrderResultModal/OrderResultModal';
import FloatingCart from '@/components/FloatingCart/FloatingCart';

export default function MenuPageControls() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [result, setResult] = useState(null);

    return (
        <>
            <Navbar
                onCartOpen={() => setIsCartOpen(true)}
                onHistoryOpen={() => setIsHistoryOpen(true)}
            />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onResult={setResult}
            />
            <OrderHistoryDrawer
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
            <OrderResultModal
                result={result}
                onClose={() => setResult(null)}
            />
            <FloatingCart
                isCartOpen={isCartOpen}
                onCartOpen={() => setIsCartOpen(true)}
            />
        </>
    );
}
