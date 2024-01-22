const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express()
const port = process.env.PORT || 3000
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

// setUp static directory
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Abhishek Kumar'
    })
})

// app.get('/title', (req, res) => {
//     res.send({
//         forecast: '',
//         location: 'Fatehpur'
//     })
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address should be mandatory..'
        })
    }
    geocode(req.query.address, (error, { lattitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(lattitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        });
    });
})


// Start server

app.listen(port, () => {
    console.log('Server is up in port '+port)
})