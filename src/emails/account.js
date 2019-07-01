const sgmail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY
sgmail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'lance299@gmail.com',
        subject: `Thanks for joining in, ${name}!`,
        text: `Welcome to the app, ${name}.  Let me know how you get along with the app.` 
    })
}

const accountDeletionEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'lance299@gmail.com',
        subject: `We'll miss you, ${name}.`,
        text: `Goodbye, ${name}.  We're sorry that you've decided to delete your account.  Would you like to let us know what we could've done better?`
    })
}

module.exports = {
    sendWelcomeEmail,
    accountDeletionEmail 
}