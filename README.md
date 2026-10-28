This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Telegram bot

The webhook endpoint is `/api/telegram/webhook`. Configure `TG_TOKEN` and
`TG_CHAT_IDS` (comma-separated admin chat IDs) in the deployment environment.
After deploying the app, register the public HTTPS endpoint with Telegram using
the Bot API `setWebhook` method. The endpoint's `GET` response reports whether
the bot configuration is present.

Bot orders start with category and dish selection using Telegram's chat keyboard;
the selected items and total are included in the confirmation and admin message.

For production, also set `TG_WEBHOOK_SECRET` and register the same value as
Telegram's `secret_token` when calling `setWebhook`. Keep bot tokens and webhook
secrets out of source control and logs.

Order conversations are held in process memory for up to 30 minutes. Use a
persistent shared store before deploying to a serverless or multi-instance
runtime so a conversation survives instance changes.
