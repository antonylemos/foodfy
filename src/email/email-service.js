const mailer = require('../lib/mailer');
const queue = require('../lib/queue');

welcomeEmail = (name, email) => {
    return `
    <h2 style="font-size: 24px; font-weight: normal;">Olá <strong>${name}</strong>,</h2>
    <p>Seja muito bem-vindo(a) ao <strong>Foodfy</strong> :)</p>
    <p>Seu cadastro foi realizado com sucesso! Confira seus dados:</p>
    <p>Login: ${email}</p>
    <br>
    <h3>Como eu acesso minha Conta?</h3>
    <p>
        Bem simples, você só precisa clicar no botão abaixo e entrar com seu email e senha informados acima.
    </p>
    <p style="text-align: center;">
        <a
            style="display: block; margin: 32px auto; padding: 16px; width:150px; color: #fff;
            background-color: #6558C3; text-decoration: none; border-radius: 4px;"
            href="http:localhost:5000/admin/users/login" target="_blank"
        >Acessar</a> 
    </p>
    <p style="padding-top:16px; border-top: 2px solid #ccc">Te esperamos lá!</p>
    <p>Equipe Foodfy.</p>
    `; 
}

//worker.js
console.log("email-service started");
queue.consume("emails", message => {
    //process the message
    let { name, email, is_admin } = JSON.parse(message.content);
    console.log("Enviando email para " + message.content);
    
    mailer.sendMail({
        to: email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Bem-vindo ao Foodfy',
        html: welcomeEmail(name , email)
    });
})
