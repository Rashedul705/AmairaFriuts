'use client';

import Script from 'next/script';

export default function N8nChat() {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
      <Script 
        id="n8n-chat-widget" 
        strategy="lazyOnload" 
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
            createChat({
              webhookUrl: 'https://n8n.premiumfruitbd.com/webhook/62a22881-2b3f-4e8e-b77f-07a110688f16/chat',
              initialMessages: [
                'Assalamu Alaikum! Welcome to Amaira Fruits AI Assistant. How can I help you today?',
                'আসসালামু আলাইকুম! আমাইরা ফ্রুটস এআই অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম। আজ আপনাকে কীভাবে সাহায্য করতে পারি?'
              ],
              i18n: {
                en: {
                  title: 'Amaira Fruits Assistant',
                  subtitle: 'Ask about premium fruits, prices, and orders.',
                  inputPlaceholder: 'Type your message...',
                }
              }
            });
          `
        }}
      />
    </>
  );
}
