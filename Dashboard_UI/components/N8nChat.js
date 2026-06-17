'use client';

import { useEffect } from 'react';

export default function N8nChat() {
  useEffect(() => {
    // Inject CSS stylesheet
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Inject Script as ES Module
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
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
    `;
    document.body.appendChild(script);

    return () => {
      // Clean up if component unmounts
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Note: We don't manually delete the chat iframe/widget container to avoid breaking internal states during hot reload,
      // but in standard production navigation the component persists in the RootLayout.
    };
  }, []);

  return null;
}
