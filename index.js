// index.js: Stable Proxy using Axios
const express = require('express');
const axios = require('axios'); // استبدال fetch بـ axios لحل مشكلة التوافق

const app = express();
const PORT = process.env.PORT || 3000; 

// الروابط الخاصة بك
const WEBHOOK_URLS = {
    'kick_ban': 'https://discord.com/api/webhooks/1441446911021285398/ObkKUaMf9E3lkFDyfSqvsCR-HEJ4b8on0tMUm3h6ObqNvQh1_pe7NbWu8y3MtpHuvNnu',
    'zp_admin': 'https://discord.com/api/webhooks/1441445037844988009/T5dXidGgtVzI7Ikl4Znw510XlmPL1hYzzu319LS6bIcOrqcByEQ4V06pUFciXDcXQz8l',
    'shop':     'https://discord.com/api/webhooks/1441446146349203477/VclPuYZn4PigsvnYYZ1WOFY5F5BQK1prooJjWbrhP-0VMyp0O_fS051e89sVwa5RlSGr',
    'connect':  'https://discord.com/api/webhooks/1441445035844436130/UIR2hiN7isQViguPL0g_MeflBphRjvJ6Zna4AJK6NkSV6Jl2ITl1Yj4wRxTc16XGgcD7',
    'currency': 'https://discord.com/api/webhooks/1441447809000931361/KEot9r-foKJSdO1-kxr5F9mMcG7DBjJMzAFQeKRBP3E0JYslS7Ti8_-7f9gp2bFb4eVs',
    'test':     'https://discord.com/api/webhooks/1441445035844436130/UIR2hiN7isQViguPL0g_MeflBphRjvJ6Zna4AJK6NkSV6Jl2ITl1Yj4wRxTc16XGgcD7'
};

app.get('/log', async (req, res) => {
    const action = req.query.action;
    const encoded_msg = req.query.msg;

    console.log(`[INCOMING] Action: ${action} | Msg: ${encoded_msg}`);

    if (!action || !encoded_msg || !WEBHOOK_URLS[action]) {
        console.log(`[ERROR] Invalid parameters. Action: ${action}`);
        return res.status(400).send('Invalid request parameters or action.');
    }

    try {
        const message = decodeURIComponent(encoded_msg); 
        const webhookUrl = WEBHOOK_URLS[action];

        // استخدام axios بدلاً من fetch لأنه أكثر استقراراً
        await axios.post(webhookUrl, {
            content: message
        });

        console.log(`[SUCCESS] Sent to Discord (${action})`);
        res.send('Success: Log forwarded.');

    } catch (error) {
        // تحسين عرض الأخطاء
        if (error.response) {
            console.error(`[DISCORD ERROR] Status: ${error.response.status} | Data:`, error.response.data);
        } else {
            console.error('[SERVER ERROR]', error.message);
        }
        res.status(500).send('Failed to send to Discord.');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});