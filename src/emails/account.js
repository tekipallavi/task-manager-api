const sendgridAPIKey = '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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgridAPIKey)
sgMail.send({
    to: 'tekipallavi@gmail.com',
    from: 'tekipallavi@gmail.com',
    subject: 'This is my first creation!',
    text: 'Hope this will reach you'
})