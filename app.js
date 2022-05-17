const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const { redirect } = require('express/lib/response')
const mongoose = require('mongoose')
const db = mongoose.connection

const Restaurant = require('./models/Restaurant')
const bodyParser = require('body-parser')
const urlencoded = require('body-parser/lib/types/urlencoded')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })


db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})




// render indexed.hbs

app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .then(console.log('index rendered!'))
    .catch(error => console.log(error))
})

// add Create restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const body = req.body
  return Restaurant.create(body)
    .then(console.log('new restaurant added,req.body', body))
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// add Read restaurant

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .then(console.log('show restaurant detail!'))
    .catch(err => console.log(err))
})

// add Update restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .then(console.log('editing!'))
    .catch(err => console.log(err))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const body = req.body
  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.name = body.name
      restaurant.name_en = body.name_en
      restaurant.category = body.category
      restaurant.image = body.image
      restaurant.location = body.location
      restaurant.phone = body.phone
      restaurant.google_map = body.google_map
      restaurant.rating = body.rating
      restaurant.description = body.description
      console.log('restaurantbody', restaurant.body)
      console.log('reqbody', req.body)
      return restaurant.save()
    })
    .then(console.log('finished edit!'))
    .then(res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render("index", { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})