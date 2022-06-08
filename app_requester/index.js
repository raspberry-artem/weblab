const express = require('express');
const app = express();
const responser_url = 'http://localhost:8080';
const axios = require('axios');

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
    const data = {
        login: req.body.login,
        password: req.body.password
    }
    axios.post(responser_url + '/v1/authorization', data,
        {
            headers:
            {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response)
        {
        const token = response.data.access_token;
        console.log(`token: ${token}`);
        res.cookie('access-token', token);
        res.redirect('/v1/cars');
        })
        .catch(function (error)
        {
            res.status(404).json('Неверные данные');
        });

})

app.get('/v1/cars', (req, res) =>
{
    axios.get(responser_url + '/v1/cars', req.body,
    {
        headers:
            {
                'Content-Type': 'application/json'
            }
    })
    .then(function (response)
    {
        const cars = response.data.cars;
        res.render('table',
            {
                cars: cars
            });
        res.status(200);
    })
    .catch(function (error)
    {
        res.status(404).json('Неверные данные');
    });
})

app.use((req, res, next) =>
{
    res.status(404).json(
    {
        message: 'Страница не найдена :)'
    })
})

app.listen(8090);