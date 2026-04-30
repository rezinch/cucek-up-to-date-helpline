import admin from 'firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password, id } = req.body;

    if (!process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT === 'undefined') {
        return res.status(500).json({ message: 'Server Configuration Error: FIREBASE_SERVICE_ACCOUNT is missing or invalid.' });
    }

    // Initialize Firebase Admin (Singleton pattern)
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
            return res.status(500).json({ message: 'Server Configuration Error: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON.' });
        }
    }

    // Verify Admin Credentials
    const validCredentials = process.env.ADMIN_CREDENTIALS ? process.env.ADMIN_CREDENTIALS.split(',') : [];
    const incomingCredential = `${username}:${password}`;

    if (!validCredentials.includes(incomingCredential)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }

    if (!id) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    try {
        const db = admin.firestore();
        await db.collection('announcements').doc(id).delete();
        return res.status(200).json({ success: true, message: 'Notification deleted successfully.' });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
