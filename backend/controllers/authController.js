require('dotenv').config();

// POST /login
// Simple hardcoded login for the MVP (no JWT, no DB lookup)
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: 'Login successful',
            user: { username, role: 'admin' }
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
    });
};
