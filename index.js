// index.js: Simple Node.js Proxy using Express
const express = require('express');
const fetch = require('node-fetch'); // لاستخدام fetch لإرسال طلبات POST

const app = express();
// يتم تعيين المنفذ تلقائياً من قبل Render عبر متغير البيئة PORT
const PORT = process.env.PORT || 3000; 

// ***************************************************************
// 🚨 يجب وضع روابط Webhook الخمسة الخاصة بك هنا
// ***************************************************************
const WEBHOOK_URLS = {
    'kick_ban': 'https://discord.com/api/webhooks/1441446911021285398/ObkKUaMf9E3lkFDyfSqvsCR-HEJ4b8on0tMUm3h6ObqNvQh1_pe7NbWu8y3MtpHuvNnu',
    'zp_admin': 'https://discord.com/api/webhooks/1441445037844988009/T5dXidGgtVzI7Ikl4Znw510XlmPL1hYzzu319LS6bIcOrqcByEQ4V06pUFciXDcXQz8l',
    'shop':     'https://discord.com/api/webhooks/1441446146349203477/VclPuYZn4PigsvnYYZ1WOFY5F5BQK1prooJjWbrhP-0VMyp0O_fS051e89sVwa5RlSGr',
    'connect':  'https://discord.com/api/webhooks/1441445035844436130/UIR2hiN7isQViguPL0g_MeflBphRjvJ6Zna4AJK6NkSV6Jl2ITl1Yj4wRxTc16XGgcD7',
    'currency': 'https://discord.com/api/webhooks/1441447809000931361/KEot9r-foKJSdO1-kxr5F9mMcG7DBjJMzAFQeKRBP3E0JYslS7Ti8_-7f9gp2bFb4eVs'
};

app.get('/log', async (req, res) => {
    const action = req.query.action;
    const encoded_msg = req.query.msg;

    if (!action || !encoded_msg || !WEBHOOK_URLS[action]) {
        return res.status(400).send('Invalid request parameters or action.');
    }

    try {
        // فك ترميز الرسالة المرسلة من AMXX
        const message = decodeURIComponent(encoded_msg); 
        const webhookUrl = WEBHOOK_URLS[action];

        // إرسال طلب POST إلى Discord
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });

        if (discordResponse.ok) {
            res.send('Success: Log forwarded to Discord.');
        } else {
            console.error(`Discord API Error: ${discordResponse.status}`);
            res.status(500).send('Failed to send to Discord API.');
        }

    } catch (error) {
        console.error('Processing Error:', error);
        res.status(500).send('Internal Server Error.');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});