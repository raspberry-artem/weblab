const express = require('express');
const app = express();
const crypto = require('crypto');
const yaml = require('js-yaml');
const fs = require('fs');

app.set('view engine', 'pug');

app.use(express.urlencoded(
{
    extended: true
}));
app.use(express.json());

app.get('/', (req, res) =>
{
    res.render('index');
    res.status(200);
});

app.post('/v1/authorization', (req, res) =>
{
    const hash2 = crypto.createHash('sha1').update(req.body.password).digest('hex');
    const accounts = yaml.load(fs.readFileSync(__dirname + '/accounts.yaml'), 'utf-8').accounts;
    const login = req.body.login
    const account = accounts.find(x => x.login === login && x.password.toUpperCase() === hash2.toUpperCase())

    if (account)
    {
        const token = req.headers.cookie;
        console.log(`token: ${token}`);
        res.set('access-token', token);
        res.redirect('/v1/cars');
    }
    else
    {
        const error =
        {
            text: hash2,
        }
        res.status(404).json(error);
    }
})

app.get('/v1/cars', (req, res) =>
{
    const cars = [
    {
        id: 1,
        model: 'm3',
        price: 10000000,
        power: 500,
        description: null,
        brandName: 'BMW'
    },
    {
        id: 2,
        model: 'm2 competition',
        price: 100000000,
        power: 1000,
        description: null,
        brandName: 'BMW'
    }]
    res.render('table',
    {
        cars: cars
    });
    res.status(200);
})

app.use((req, res, next) =>
{
    res.status(404).json(
    {
        message: 'Страница не найдена :)'
    })
})

app.listen(8080);