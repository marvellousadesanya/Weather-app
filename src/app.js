const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => { // Renders the hbs file
    res.render('index', { // first argument is the file to render, second argument is an object with content you want dynamic
        title: 'Weather',
        name: 'Marv'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title:  'About me',
        name: 'Marv'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is the help page',
        name: 'Marv'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ // Add a return to this cos it will bring up an error if not. The error comes up because Express cannot process two res.send commands.
            error: 'You must provide a search term',
        })
    }
    console.log(req.query.search)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('help404', {
        title: '404 error',
        errorMessage: 'Help article not found!',
        name: 'Marv'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        errorMessage: 'Page not found!',
        name: 'Marv'
    })
})

app.listen(4000, () => {
    console.log('Server is up on port 4000.')
})

// app.com 
// app.com/help
// app.com/about