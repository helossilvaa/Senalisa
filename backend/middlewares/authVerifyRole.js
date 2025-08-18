const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.funcao)) {
            return res.status(403).json({ mensagem: 'Acesso negado' });
        }
        next();
    };
};

export default verifyRole;
