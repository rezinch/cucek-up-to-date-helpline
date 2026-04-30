import admin from 'firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password, title, message } = req.body;

    if (!process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT === 'undefined') {
        return res.status(500).json({ message: 'Server Configuration Error: FIREBASE_SERVICE_ACCOUNT is missing or invalid in .env.local' });
    }

    // Initialize Firebase Admin (Singleton pattern to prevent re-initialization in Serverless functions)
    if (!admin.apps.length) {
        try {
            let envJsonStr = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
            if (envJsonStr.startsWith("'") && envJsonStr.endsWith("'")) {
                envJsonStr = envJsonStr.slice(1, -1);
            }
            const serviceAccount = JSON.parse(envJsonStr);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (error) {
            console.error("Firebase Admin Initialization Error:", error);
            return res.status(500).json({ message: 'Server Configuration Error: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON. Check your .env.local format.' });
        }
    }

    // Verify Admin Credentials (ADMIN_CREDENTIALS format: "user1:pass1,user2:pass2")
    const validCredentials = process.env.ADMIN_CREDENTIALS ? process.env.ADMIN_CREDENTIALS.split(',') : [];
    const incomingCredential = `${username}:${password}`;

    if (!validCredentials.includes(incomingCredential)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }

    if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required' });
    }

    try {
        const db = admin.firestore();
        const messaging = admin.messaging();

        // 1. Save to Announcements Collection (For the Banner)
        await db.collection('announcements').add({
            title: title,
            text: message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // 2. Fetch all registered tokens
        const tokensSnapshot = await db.collection('tokens').get();
        const tokens = [];
        tokensSnapshot.forEach((doc) => {
            tokens.push(doc.id);
        });

        // 3. Send Push Notifications via FCM Multicast
        let successCount = 0;
        let failureCount = 0;

        if (tokens.length > 0) {
            // FCM allows max 500 tokens per multicast request
            const payload = {
                data: {
                    title: title,
                    body: message,
                },
                tokens: tokens,
            };

            const response = await messaging.sendEachForMulticast(payload);
            successCount = response.successCount;
            failureCount = response.failureCount;

            // Optional: Clean up invalid tokens
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
                // You could delete these from the 'tokens' collection here
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Announcement sent successfully!',
            stats: { tokensFound: tokens.length, successCount, failureCount }
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
