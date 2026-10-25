NEXUS-18 Random Video Chat — starter package

इस पैकेज में index.html और Socket.IO signaling server है। यह अपने-आप लाइव वेबसाइट पर deploy नहीं होता।

जरूरी:
1) Render.com पर नया Web Service बनाएँ और इस पैकेज का server.js/package.json deploy करें (Node environment; Build Command: npm install; Start Command: npm start).
2) Render का HTTPS service URL मिलने के बाद index.html में SIGNALING_SERVER_URL को उस URL से बदलें।
3) index.html को Netlify पर index.html के रूप में deploy करें।
4) दो अलग-अलग मोबाइल से वेबसाइट खोलकर कैमरा/माइक अनुमति दें और Next / Skip दबाएँ।

महत्वपूर्ण सीमाएँ:
- यह शुरुआती demo matching server है, पूर्ण production सुरक्षा/मॉडरेशन/रेट लिमिटिंग नहीं। अजनबी लोगों के लिए public launch से पहले abuse reporting, age gating, moderation, TURN relay और बेहतर authentication/authorization लगाएँ।
- केवल STUN सर्वर हैं; कुछ मोबाइल नेटवर्क/NAT पर कनेक्शन न बन पाए। भरोसेमंद cross-network वीडियो के लिए TURN server लग सकता है और उसमें शुल्क हो सकता है।
- Firebase Database Rules को true न करें; इस starter में database को public read/write की जरूरत नहीं है।
- Render free service sleep/cold start कर सकती है; पहला connection धीमा हो सकता है।
- SMS OTP पर Firebase billing/quotas की अलग सीमाएँ लागू हो सकती हैं।
