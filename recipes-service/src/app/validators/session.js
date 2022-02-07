const { compare } = require('bcryptjs');

const User = require('../models/User');

async function forgot(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.render('session/forgot-password', {
            user: req.body,
            error: 'Email não encontrado'
        });

        req.user = user;

        next();
    } catch (err) {
        console.error(err);
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, password_repeat, token } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Usuário não encontrado!'
        });

        if(password != password_repeat) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Os campos nova senha e repetir senha precisam ser iguais'
        });

        if(token != user.reset_token) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token inválido! Por favor, solicite uma nova recuperação de senha.'
        });

        let now = new Date();
        now = now.setHours(now.getHours());

        if(now > user.reset_token_expires) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
        });

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    forgot,
    reset
};