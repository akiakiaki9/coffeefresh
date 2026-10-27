"use client";
import { useEffect, useRef } from 'react';

export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        el.classList.add('is-visible');
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${delay ? `reveal--d${delay}` : ''} ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}