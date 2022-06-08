const express = require('express');
const app = express();
const crypto = require('crypto');
const yaml = require('js-yaml');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const jwt_key = "2hH_DJHKD9";

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
    const hash3 = crypto.createHash('sha1').update(req.body.password).digest('hex');
    const accounts = yaml.load(fs.readFileSync(__dirname + '/accounts.yaml'), 'utf-8').accounts;
    const login = req.body.login
    const account = accounts.find(x => x.login === login && x.password.toUpperCase() === hash3.toUpperCase())

    if (account)
    {
        const token = jwt.sign({ id: 1, role: "admin" }, jwt_key);
        return res.status(200).send({'access_token': token});
    }
    else
    {
        const error =
        {
            text: hash3,
        }
        return res.status(404).json(error);
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
    return res.status(200).send({'cars': cars});
})

app.use((req, res, next) =>
{
    return res.status(404).json(
    {
        message: 'Страница не найдена :)'
    })
})

app.listen(8080);