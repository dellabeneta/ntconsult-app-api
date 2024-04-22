// authMiddleware.js

const fixedAuthToken = 'TESTETOKENABERTO'; // UUID fixo para autenticação

function authenticate(req, res, next) {
    const authToken = req.headers['x-auth-token']; // Supondo que o UUID esteja no cabeçalho 'x-auth-token'
    
    // Verifica se o token está presente e se é válido
    if (authToken && authToken === fixedAuthToken) {
        // Token válido, permite a próxima rota
        next();
    } else {
        return res.status(403).json({ message: 'Token de autenticação inválido' });
    }
}

module.exports = authenticate;
