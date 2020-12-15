const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET); // Add your Secret Key Here

const app = express();

// This will make our form data much more useful
app.use(bodyParser.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.get('/', function(req, res){ 
    res.render('index', { 
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY 
    }) 
}) 

// Future Code Goes Here

app.post("/charge", (req, res) => {
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    description: 'Web Development Product',
                    currency: "usd",
                    customer: customer.id
                })
            )
            .then(() => res.render("completed.html"))
            .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));