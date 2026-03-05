const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

/* Simple token generator (no JWT dep needed) */
function generateToken(userId) {
    const payload = `${userId}:${Date.now()}:${Math.random()}`;
    return Buffer.from(payload).toString('base64');
}

/* ── POST /api/auth/signup ── */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const hashedPassword = User.hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);
        res.status(201).json({ token, name: user.name, email: user.email });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

/* ── POST /api/auth/signin ── */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const valid = User.verifyPassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);
        res.json({ token, name: user.name, email: user.email });

    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

/* ── GET /api/auth/me ── (verify token presence, lightweight) */
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated.' });
    // Token validation would go here with JWT in production
    res.json({ authenticated: true });
});

module.exports = router;
