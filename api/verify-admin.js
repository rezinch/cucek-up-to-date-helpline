export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    // Verify Admin Credentials
    const validCredentials = process.env.ADMIN_CREDENTIALS ? process.env.ADMIN_CREDENTIALS.split(',') : [];
    const incomingCredential = `${username}:${password}`;

    if (!validCredentials.includes(incomingCredential)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
    }

    return res.status(200).json({ success: true, message: 'Valid credentials' });
}
