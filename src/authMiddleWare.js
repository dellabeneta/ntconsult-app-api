const fixedAuthToken = 'dellabeneto';

function authenticate(req, res, next) {
    const authToken = req.headers['x-auth-token'];

    if (req.originalUrl.includes('/api-docs')) {
        next();
    } else {
        if (authToken && authToken === fixedAuthToken) {
            next();
        } else {
            return res.status(403).json({ message: 'Token de autenticação inválido' });
        }
    }
}

module.exports = authenticate;
