"use client";

import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = null;

export default function useBodyScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return;

        const html = document.documentElement;
        const body = document.body;

        if (lockCount === 0) {
            previousOverflow = {
                html: html.style.overflow,
                body: body.style.overflow,
            };
            html.classList.add('no-scroll');
            body.classList.add('no-scroll');
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        }

        lockCount += 1;

        return () => {
            lockCount -= 1;
            if (lockCount !== 0) return;

            html.classList.remove('no-scroll');
            body.classList.remove('no-scroll');
            html.style.overflow = previousOverflow.html;
            body.style.overflow = previousOverflow.body;
            previousOverflow = null;
        };
    }, [isLocked]);
}
